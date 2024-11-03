import { DATABASE_URL } from '$env/static/private';
import { dbClient } from '@uci-syllabus-finder/database';

export const db = dbClient(DATABASE_URL);
export * from '@uci-syllabus-finder/database';
