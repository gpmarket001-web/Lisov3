/**
 * Conexão Postgres (Drizzle). Gated por DATABASE_URL.
 * Sem DATABASE_URL => null (o app cai pro modo demo de lib/data.ts).
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const isDemo = !process.env.DATABASE_URL;

let _db: ReturnType<typeof drizzle> | null = null;

export function db() {
  if (isDemo) return null;
  if (!_db) {
    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    _db = drizzle(client, { schema });
  }
  return _db;
}
