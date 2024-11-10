import { asc, db, desc, lte, sql } from '$lib/drizzle';
import { json, type RequestHandler } from '@sveltejs/kit';
import { syllabus } from '@uci-syllabus-finder/database/schema';

const levenshtein = sql`levenshtein_less_equal(${syllabus.courseId}, ${sql.placeholder('query')}, 3)`;
const syllabusQuery = db
  .select()
  .from(syllabus)
  .where(lte(levenshtein, 3))
  .orderBy(asc(levenshtein), desc(syllabus.term), desc(syllabus.instructors))
  .limit(50)
  .prepare('query');

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url;
  const query = searchParams.get('query')!.toUpperCase().replace(/\s+/, '');
  const syllabi = await syllabusQuery.execute({ query });

  return json(syllabi);
};
