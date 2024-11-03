import { asc, db, desc, eq } from '$lib/drizzle';
import { json, type RequestHandler } from '@sveltejs/kit';
import { syllabus } from '@uci-syllabus-finder/database/schema';

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url;

  const Dept = searchParams.get('Dept')!.toUpperCase();
  const CourseNum = searchParams.get('CourseNum')!.toUpperCase();
  const courseId = `${Dept}${CourseNum}`;

  const syllabi = await db
    .select()
    .from(syllabus)
    .where(eq(syllabus.courseId, courseId))
    .orderBy(desc(syllabus.term), asc(syllabus.instructors));

  return json(syllabi);
};
