import * as cheerio from 'cheerio';
import {
  WEBSOC_URL,
  formatTermReadable,
  getLatestTerm,
  getRelevantTerms,
  termToString
} from '@uci-syllabus-finder/websoc';
import axios from 'axios';
import { db, not, inArray } from './drizzle';
import { Syllabus, syllabus } from '@uci-syllabus-finder/database/schema';
import { scrapeDepts } from './depts';

const NUM_COLS_COURSE = 15; // or 16 (todo: investigate)
const INSTRUCTOR_COLUMN_INDEX = 4;
const WEB_COLUMN_INDEX = 13; // or 14

export async function handler() {
  await deleteOldSyllabi();

  const depts = await scrapeDepts();
  console.log('Departments:', depts);
  await wait();
  const term = getLatestTerm(new Date());
  console.log(`Scraping syllabi for ${formatTermReadable(termToString(term))}`);
  for (const dept of depts) {
    console.log(`- ${dept}`);
    const syllabiArr = await scrapeSyllabi(dept, termToString(term));
    console.log(`- ${syllabiArr.length} syllabi`);
    if (syllabiArr.length > 0) {
      await db.insert(syllabus).values(syllabiArr).onConflictDoNothing();
    }
    await wait();
  }

  console.log('Done');
}

async function wait() {
  return new Promise((resolve) => {
    const waitTime = Math.random() * 4000.0 + 1000;
    console.log(`Waiting ${waitTime} ms`);
    setTimeout(resolve, waitTime);
  });
}

async function deleteOldSyllabi() {
  const terms = getRelevantTerms().map(termToString);
  await db.delete(syllabus).where(not(inArray(syllabus.term, terms)));
}

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
      courseId = parseCourseId($(courseTitle).text(), dept);
    } else if (cells.length === NUM_COLS_COURSE) {
      // if tr is a course offering
      const link = $(cells[WEB_COLUMN_INDEX]).find('a').attr('href');
      if (link) {
        const instructors = parseInstructors(
          $(cells[INSTRUCTOR_COLUMN_INDEX]).html() ?? ''
        );
        const syllabus: Syllabus = {
          courseId,
          term,
          instructors,
          link
        };
        syllabi.push(syllabus);
      }
    }
  });

  return syllabi;
}

export function parseCourseId(text: string, dept: string) {
  return text
    .split(/\s+/)
    .slice(0, dept.split(/\s/).length + 2)
    .join('')
    .toUpperCase();
}

export function parseInstructors(html: string) {
  return html.split('<br>').join(';');
}

export async function getWebSocData(dept: string, term: string) {
  const response = await axios.get(WEBSOC_URL, {
    params: {
      Dept: dept,
      YearTerm: term,
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
