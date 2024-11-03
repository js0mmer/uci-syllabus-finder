import { db } from '$lib/drizzle';
import { json, type RequestHandler } from '@sveltejs/kit';
import { getSyllabi } from '@uci-syllabus-finder/websoc';

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url;

  const Dept = searchParams.get('Dept')!.toUpperCase();
  const CourseNum = searchParams.get('CourseNum')!.toUpperCase();

  const syllabi = await getSyllabi(db, { Dept, CourseNum });

  return json(syllabi);
};
