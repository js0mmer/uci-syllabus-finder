import axios from 'axios';
import prisma from './prisma';
import { z } from 'zod';
import * as cheerio from 'cheerio';

const WEBSOC_URL = 'https://www.reg.uci.edu/perl/WebSoc';

export const course = z.object({
  Dept: z.string(),
  CourseNum: z.string()
});

export type Course = z.infer<typeof course>;

enum Quarter {
  FALL = '92',
  WINTER = '03',
  SPRING = '14',
  SUMMER = '25',
  SUMMER10WK = '39',
  SUMMER2 = '76'
}

const term = z.object({
  year: z.number(),
  quarter: z.nativeEnum(Quarter)
});

type Term = z.infer<typeof term>;

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

function getRelevantTerms(): Term[] {
  const today = new Date();
  const latestTerm = getLatestTerm(today);
  const relevantTerms = [latestTerm];

  for (let i = 1; i < Object.keys(Quarter).length; i++) {
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

function getLatestTerm(date: Date): Term {
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

export async function getSyllabi(course: Course) {
  const { Dept, CourseNum } = course;
  const syllabi = await prisma.syllabi.findFirst({
    where: {
      dept: Dept,
      courseNum: CourseNum
    }
  });

  if (syllabi === null) {
    // fetch then cache
    return;
  }

  // remove old terms from db, keep only past year
  // for (const term of syllabi.terms) {
  //     if (term.term === Quarter.FALL) {
  //         return;
  //     }
  // }
  return syllabi;
}

async function scrapeSyllabi(course: Course) {
  // todo: get relevant terms
  const data = getWebSocData(course, '2019-03');
  const $ = cheerio.load(data);
  // todo: scrape syllabi
}

export async function getWebSocData(course: Course, term: string) {
  const response = await axios.get(WEBSOC_URL, {
    params: {
      ...course,
      YearTerm: term,
      ShowComments: 'on',
      ShowFinals: 'on',
      Breadth: 'ANY',
      Division: 'ANY',
      ClassType: 'ALL',
      FullCourses: 'ANY',
      CancelledCourses: 'Exclude',
      Submit: 'Display Web Results'
    }
  });

  return response.data;
}
