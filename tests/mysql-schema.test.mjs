import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import mysql from "mysql2/promise";
import ts from "typescript";

const filename = new URL("../lib/mysql-migrations.ts", import.meta.url);
const source = ts.transpileModule(readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { mysqlMigrations } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
const drizzleMigrations = ["0000_init.sql", "0001_reviews.sql"].map((id) => ({
  id,
  sql: readFileSync(new URL(`../drizzle/${id}`, import.meta.url), "utf8").trim(),
}));

function normalize(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

test("bundled MySQL migrations match the Drizzle SQL files", () => {
  assert.equal(mysqlMigrations.length, drizzleMigrations.length);
  for (const [index, migration] of drizzleMigrations.entries()) {
    assert.equal(mysqlMigrations[index].id, migration.id);
    assert.equal(normalize(mysqlMigrations[index].sql), normalize(migration.sql));
  }
});

test("MySQL accepts the schema and a pending order", async (t) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "virginia",
      password: process.env.DB_PASSWORD || "virginia",
      database: process.env.DB_NAME || "virginia_spa",
    });
    await connection.query("SELECT 1");
  } catch (error) {
    t.skip(`MySQL non disponibile: ${error instanceof Error ? error.message : error}`);
    return;
  }

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id varchar(120) NOT NULL,
        applied_at varchar(40) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    for (const migration of mysqlMigrations) {
      for (const statement of migration.sql.split(";").map((part) => part.trim()).filter(Boolean)) {
        await connection.query(statement);
      }
    }

    const orderId = crypto.randomUUID();
    await connection.query(
      "INSERT INTO orders (id, customer_name, customer_email, amount_total, created_at) VALUES (?, ?, ?, ?, ?)",
      [orderId, "Test", "test@example.com", 11000, "2000-01-01T00:00:00.000Z"],
    );
    const [rows] = await connection.query("SELECT status FROM orders WHERE id = ?", [orderId]);
    assert.equal(rows[0].status, "in_attesa");

    await connection.query("DELETE FROM orders WHERE id = ?", [orderId]);

    const reviewId = crypto.randomUUID();
    await connection.query(
      "INSERT INTO reviews (id, customer_name, customer_email, rating, message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [reviewId, "Test", "test@example.com", 5, "Esperienza di test molto positiva.", "2000-01-01T00:00:00.000Z"],
    );
    const [reviewRows] = await connection.query("SELECT status FROM reviews WHERE id = ?", [reviewId]);
    assert.equal(reviewRows[0].status, "in_revisione");
    await connection.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    try {
      await connection.query("INSERT INTO stripe_events (id, type, processed_at) VALUES (?, ?, ?)", [
        "evt_dup_test",
        "checkout.session.completed",
        new Date().toISOString(),
      ]);
      await connection.query("INSERT INTO stripe_events (id, type, processed_at) VALUES (?, ?, ?)", [
        "evt_dup_test",
        "checkout.session.completed",
        new Date().toISOString(),
      ]);
      assert.fail("expected duplicate key");
    } catch (error) {
      assert.equal(error.errno, 1062);
    } finally {
      await connection.query("DELETE FROM stripe_events WHERE id = ?", ["evt_dup_test"]);
    }
  } finally {
    await connection.end();
  }
});
