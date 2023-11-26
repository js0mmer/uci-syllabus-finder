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

async function getRelevantTerms() {}

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
