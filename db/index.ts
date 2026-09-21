import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { applyMysqlMigrations } from "./migrate";
import * as schema from "./schema";

export { isDuplicateKeyError } from "../lib/db-errors";

function mysqlConfig() {
  const url = process.env.DATABASE_URL;
  if (url) {
    if (!url.startsWith("mysql://") && !url.startsWith("mysql2://")) {
      throw new Error("DATABASE_URL deve usare il prefisso mysql://");
    }
    return { uri: url };
  }

  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;
  if (!user || !database) {
    throw new Error(
      "Database non configurato. Imposta DATABASE_URL oppure DB_HOST, DB_USER, DB_PASSWORD e DB_NAME (su Hostinger usa DB_HOST=127.0.0.1).",
    );
  }

  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user,
    password: process.env.DB_PASSWORD || "",
    database,
  };
}

function createDb() {
  const pool = mysql.createPool({
    ...mysqlConfig(),
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    timezone: "Z",
    charset: "utf8mb4",
  });
  return { pool, db: drizzle(pool, { schema, mode: "default" }) };
}

const globalForDb = globalThis as unknown as {
  virginiaPool?: ReturnType<typeof createDb>["pool"];
  virginiaDb?: ReturnType<typeof createDb>["db"];
  virginiaMigrating?: Promise<void>;
};

function getPool() {
  if (!globalForDb.virginiaPool) {
    const created = createDb();
    globalForDb.virginiaPool = created.pool;
    globalForDb.virginiaDb = created.db;
  }
  return globalForDb.virginiaPool;
}

async function ensureSchema(pool: ReturnType<typeof createDb>["pool"]) {
  if (!globalForDb.virginiaMigrating) {
    globalForDb.virginiaMigrating = applyMysqlMigrations(pool).catch((error) => {
      globalForDb.virginiaMigrating = undefined;
      throw error;
    });
  }
  await globalForDb.virginiaMigrating;
}

export async function getDb() {
  const pool = getPool();
  await ensureSchema(pool);
  return globalForDb.virginiaDb!;
}
