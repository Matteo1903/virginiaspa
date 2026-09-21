import { fileURLToPath } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

function config() {
  if (process.env.DATABASE_URL) {
    return { uri: process.env.DATABASE_URL };
  }
  return {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "virginia",
    password: process.env.DB_PASSWORD || "virginia",
    database: process.env.DB_NAME || "virginia_spa",
    multipleStatements: true,
  };
}

const connection = await mysql.createConnection({
  ...config(),
  multipleStatements: true,
});

await connection.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id varchar(120) NOT NULL,
    applied_at varchar(40) NOT NULL,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

const drizzleDir = path.resolve(fileURLToPath(new URL("../drizzle", import.meta.url)));
const files = (await readdir(drizzleDir))
  .filter((name) => name.endsWith(".sql"))
  .sort();

for (const file of files) {
  const [existing] = await connection.query("SELECT id FROM schema_migrations WHERE id = ?", [file]);
  const rows = /** @type {{ id: string }[]} */ (existing);
  if (rows.length) {
    console.log(`skip ${file}`);
    continue;
  }
  const sql = await readFile(path.join(drizzleDir, file), "utf8");
  await connection.query(sql);
  await connection.query("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)", [
    file,
    new Date().toISOString(),
  ]);
  console.log(`applied ${file}`);
}

await connection.end();
