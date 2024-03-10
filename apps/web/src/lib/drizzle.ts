import { DATABASE_URL } from '$env/static/private';
import { dbClient } from 'database';

export const db = dbClient(DATABASE_URL);
export * from 'database';
