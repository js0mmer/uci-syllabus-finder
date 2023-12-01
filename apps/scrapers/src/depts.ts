import prisma from "./prisma";
import axios from "axios";
import * as cheerio from "cheerio";

export async function handler() {
  const depts = await scrapeDepts();
  await prisma.depts.deleteMany();
  await prisma.depts.createMany({
    data: depts.map(dept => ({ dept }))
  });
}

async function scrapeDepts() {
  const data = (await axios.get('https://www.reg.uci.edu/perl/WebSoc')).data;
  const $ = cheerio.load(data);
  const depts: string[] = [];

  $('select[name="Dept"]').children().each((i, elem) => {
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
  return optionText.match(/\(until \d\d\d\d \w+\)/g) !== null;
}