import { neon } from "@neondatabase/serverless";

const connectionString = process.env.NEON_DATABASE_URL ?? "";

export const neonDbClient = async (query: string, params: unknown[] = []) => {
  if (!connectionString) {
    throw new Error("Missing NEON_DATABASE_URL");
  }

  const sql = neon(connectionString);
  return sql.query(query, params);
};
