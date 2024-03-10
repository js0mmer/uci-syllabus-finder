import { db } from '$lib/drizzle';
import { json, type RequestHandler } from '@sveltejs/kit';
import { getSyllabi } from 'websoc';

export const GET: RequestHandler = async ({ url }) => {
  const { searchParams } = url;

  const Dept = searchParams.get('Dept')!;
  const CourseNum = searchParams.get('CourseNum')!;

  const syllabi = await getSyllabi(db, { Dept, CourseNum });

  return json(syllabi);
};
