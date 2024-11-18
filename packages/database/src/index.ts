import { drizzle } from 'drizzle-orm/neon-http';

export const dbClient = (databaseUrl: string) => drizzle(databaseUrl);

export * from 'drizzle-orm';
