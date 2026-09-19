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
const drizzleSql = readFileSync(new URL("../drizzle/0000_init.sql", import.meta.url), "utf8").trim();

function normalize(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

test("bundled MySQL migration matches drizzle/0000_init.sql", () => {
  assert.equal(mysqlMigrations.length, 1);
  assert.equal(mysqlMigrations[0].id, "0000_init.sql");
  assert.equal(normalize(mysqlMigrations[0].sql), normalize(drizzleSql));
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
    for (const statement of mysqlMigrations[0].sql.split(";").map((part) => part.trim()).filter(Boolean)) {
      await connection.query(statement);
    }

    const orderId = `test-${crypto.randomUUID()}`;
    await connection.query(
      "INSERT INTO orders (id, customer_name, customer_email, amount_total, created_at) VALUES (?, ?, ?, ?, ?)",
      [orderId, "Test", "test@example.com", 11000, "2000-01-01T00:00:00.000Z"],
    );
    const [rows] = await connection.query("SELECT status FROM orders WHERE id = ?", [orderId]);
    assert.equal(rows[0].status, "in_attesa");

    await connection.query("DELETE FROM orders WHERE id = ?", [orderId]);

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
