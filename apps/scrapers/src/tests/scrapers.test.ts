import { describe, expect, test } from '@jest/globals';
import { parseCourseId, parseInstructors } from '../syllabi';
import { load } from 'cheerio';
import fs from 'fs';
import { isDeptInactive } from '../depts';

describe('syllabi', () => {
  test('compsci 112 parsed', () => {
    const data = fs.readFileSync('./sample-data/syllabi.html', 'utf8');
    const $ = load(data);

    expect(parseCourseId($('.CourseTitle').first().text() ?? 'undefined')).toBe('COMPSCI112');
  });
  test('XU, P.;MAJUMDER,A. parsed', () => {
    const data = fs.readFileSync('./sample-data/instructor.html', 'utf8');
    const $ = load(data);

    expect(parseInstructors($('td').first().html() ?? 'null')).toBe('XU, P.;MAJUMDER, A.');
  })
});

describe('depts', () => {
  test('CBEMS is inactive', () => {
    expect(isDeptInactive('CBEMS . . . . . .Chemical Engr and Materials Science (until 2019 SS2)')).toBe(true);
  });
  test('COMPSCI is active', () => {
    expect(isDeptInactive('COMPSCI . . . . Computer Science')).toBe(false);
  });
});