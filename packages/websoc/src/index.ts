import { dbClient, desc, asc, eq } from 'database';
import { syllabus } from 'database/schema';

export const WEBSOC_URL = 'https://www.reg.uci.edu/perl/WebSoc';

export interface Course {
  Dept: string;
  CourseNum: string;
}

enum Quarter {
  FALL = '92',
  WINTER = '03',
  SPRING = '14',
  SUMMER = '25',
  SUMMER10WK = '39',
  SUMMER2 = '76'
}

export interface Term {
  year: number;
  quarter: Quarter;
}

export function termToString(term: Term) {
  return `${term.year}-${term.quarter.valueOf()}`;
}

export function formatTermReadable(term: string) {
  const [year, quarter] = term.split('-');

  let quarterName;
  for (const [key, value] of Object.entries(Quarter)) {
    if (value === quarter) {
      quarterName = key;
      break;
    }
  }

  return `${year} ${quarterName}`;
}

/**
 * up to 2 previous terms
 * @returns
 */
export function getRelevantTerms(): Term[] {
  const today = new Date();
  const latestTerm = getLatestTerm(today);
  const relevantTerms = [latestTerm];

  for (let i = 1; i < 2; i++) {
    const sucessiveTerm = relevantTerms[i - 1];
    relevantTerms.push(getPreviousTerm(sucessiveTerm));
  }

  return relevantTerms;
}

function getPreviousTerm(term: Term): Term {
  const { year, quarter } = term;

  if (quarter === Quarter.FALL) {
    return { year, quarter: Quarter.SUMMER2 };
  } else if (quarter === Quarter.SUMMER2) {
    return { year, quarter: Quarter.SUMMER10WK };
  } else if (quarter === Quarter.SUMMER10WK) {
    return { year, quarter: Quarter.SUMMER };
  } else if (quarter === Quarter.SUMMER) {
    return { year, quarter: Quarter.SPRING };
  } else if (quarter === Quarter.SPRING) {
    return { year, quarter: Quarter.WINTER };
  } else if (quarter === Quarter.WINTER) {
    return { year: year - 1, quarter: Quarter.FALL };
  } else {
    throw new Error('Invalid quarter');
  }
}

export function getLatestTerm(date: Date): Term {
  const month = date.getMonth();
  const year = date.getFullYear();

  if (month >= 9) {
    return { year, quarter: Quarter.FALL };
  } else if (month >= 8) {
    return { year, quarter: Quarter.SUMMER2 };
  } else if (month >= 6) {
    return { year, quarter: Quarter.SUMMER10WK };
  } else if (month >= 4) {
    return { year, quarter: Quarter.SPRING };
  } else if (month >= 1) {
    return { year, quarter: Quarter.WINTER };
  } else {
    return { year: year - 1, quarter: Quarter.FALL };
  }
}

export async function getSyllabi(
  db: ReturnType<typeof dbClient>,
  course: Course
) {
  return await db
    .select()
    .from(syllabus)
    .where(eq(syllabus.courseId, `${course.Dept}${course.CourseNum}`))
    .orderBy(desc(syllabus.term), asc(syllabus.instructors));
}
