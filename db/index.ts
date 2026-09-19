import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
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

const globalForDb = globalThis as unknown as {
  virginiaPool?: mysql.Pool;
  virginiaDb?: ReturnType<typeof createDb>;
};

function createDb() {
  if (!globalForDb.virginiaPool) {
    globalForDb.virginiaPool = mysql.createPool({
      ...mysqlConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      timezone: "Z",
      charset: "utf8mb4",
    });
  }
  return drizzle(globalForDb.virginiaPool, { schema, mode: "default" });
}

export function getPool() {
  createDb();
  return globalForDb.virginiaPool!;
}

export async function getDb() {
  if (!globalForDb.virginiaDb) {
    globalForDb.virginiaDb = createDb();
  }
  return globalForDb.virginiaDb;
}
