import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from './drizzle';
import { depts } from 'database/schema';
import { WEBSOC_URL } from 'websoc';

export async function handler() {
  const deptsArr = await scrapeDepts();
  await db.delete(depts);
  await db.insert(depts).values(deptsArr.map((dept) => ({ dept })));
}

async function scrapeDepts() {
  const data = (await axios.get(WEBSOC_URL)).data;
  const $ = cheerio.load(data);
  const depts: string[] = [];

  $('select[name="Dept"]')
    .children()
    .each((i, elem) => {
      // skip first option tag b/c it's all departments option
      if (i != 0 && !isDeptInactive($(elem).text())) {
        const dept = $(elem).attr('value');
        if (dept) {
          depts.push(dept);
        } else {
          console.error(`Dept ${$(elem).text()} has no value on option tag`);
        }
      }
    });

  return depts;
}

export function isDeptInactive(optionText: string) {
  return optionText.match(/\(until \d{4} \w+\)/g) !== null;
}
