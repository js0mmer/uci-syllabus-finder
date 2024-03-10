import { dbClient } from 'database';

export const db = dbClient(process.env.DATABASE_URL!);

export * from 'database';
