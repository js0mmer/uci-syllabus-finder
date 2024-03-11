import { dbClient } from 'database';
import dotenv from 'dotenv';

dotenv.config();

export const db = dbClient(process.env.DATABASE_URL!);

export * from 'database';
