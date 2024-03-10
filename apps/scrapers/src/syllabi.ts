import * as cheerio from 'cheerio';
import { WEBSOC_URL, getLatestTerm, termToString } from 'websoc';
import axios from 'axios';
import { db } from './drizzle';
import { Syllabus, syllabi } from 'database/schema';

const NUM_COLS_COURSE = 16;
const INSTRUCTOR_COLUMN_INDEX = 4;
const WEB_COLUMN_INDEX = 14;

export async function handler() {
  const term = termToString(getLatestTerm(new Date()));
  const depts = await getDepts();
  for (const dept of depts) {
    const syllabiArr = await scrapeSyllabi(dept, term);
    await db.insert(syllabi).values(syllabiArr).onConflictDoNothing();
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 4.0 + 1)
    );
  }

  // cleanUpOldSyllabi();
}

// function cleanUpOldSyllabi() {

// }

async function scrapeSyllabi(dept: string, term: string) {
  const data = getWebSocData(dept, term);
  const $ = cheerio.load(await data);
  let courseId: string;

  const syllabi: Syllabus[] = [];

  $('tr').each((_, elem) => {
    const cells = elem.children;
    const courseTitle = $(elem).find('.CourseTitle');
    // if tr is a course title
    if (courseTitle.length > 0) {
      courseId = parseCourseId($(courseTitle).text());
    } else if (cells.length === NUM_COLS_COURSE) {
      // if tr is a course offering
      const link = $(cells[WEB_COLUMN_INDEX]).find('a').attr('href');
      if (link) {
        const instructors = parseInstructors(
          $(cells[INSTRUCTOR_COLUMN_INDEX]).html() ?? ''
        );
        const syllabus: Syllabus = {
          courseid: courseId,
          term,
          instructors,
          link: link
        };
        syllabi.push(syllabus);
      }
    }
  });

  return syllabi;
}

async function getDepts() {
  const depts = await db.query.depts.findMany();
  return depts.map((dept) => dept.dept);
}

export function parseCourseId(text: string) {
  return text.split(/\s+/).slice(0, 3).join('').toUpperCase();
}

export function parseInstructors(html: string) {
  return html.split('<br>').join(';');
}

export async function getWebSocData(dept: string, term: string) {
  const response = await axios.get(WEBSOC_URL, {
    params: {
      Dept: dept,
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
