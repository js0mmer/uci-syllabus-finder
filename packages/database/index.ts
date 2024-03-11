import { NeonQueryFunction, neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export const dbClient = function (database_url: string) {
  const sql = neon(database_url) as NeonQueryFunction<boolean, boolean>;
  const db = drizzle(sql, { schema });
  return db;
};

export * from 'drizzle-orm';
