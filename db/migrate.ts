import { mysqlMigrations } from "../lib/mysql-migrations";

type Queryable = {
  getConnection: () => Promise<{
    query: (sql: string, values?: unknown[]) => Promise<[unknown, unknown]>;
    release: () => void;
  }>;
};

export async function applyMysqlMigrations(pool: Queryable) {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id varchar(120) NOT NULL,
        applied_at varchar(40) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    for (const migration of mysqlMigrations) {
      const [existing] = await connection.query("SELECT id FROM schema_migrations WHERE id = ?", [migration.id]);
      if ((existing as { id: string }[]).length) continue;
      for (const statement of migration.sql.split(";").map((part) => part.trim()).filter(Boolean)) {
        await connection.query(statement);
      }
      await connection.query("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)", [
        migration.id,
        new Date().toISOString(),
      ]);
    }
  } finally {
    connection.release();
  }
}
