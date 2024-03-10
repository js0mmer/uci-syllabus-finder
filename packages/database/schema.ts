import { InferInsertModel } from 'drizzle-orm';
import { pgTable, index, varchar, char } from 'drizzle-orm/pg-core';

export const syllabi = pgTable(
  'syllabi',
  {
    courseid: varchar('courseid', { length: 32 }).notNull(),
    term: char('term', { length: 7 }).notNull(),
    instructors: varchar('instructors', { length: 255 }).notNull(),
    link: varchar('link', { length: 255 }).notNull()
  },
  (table) => {
    return {
      courseidindex: index('courseidindex').on(table.courseid)
    };
  }
);

export type Syllabus = InferInsertModel<typeof syllabi>;

export const depts = pgTable('depts', {
  dept: varchar('dept', { length: 32 }).notNull()
});

export type Dept = InferInsertModel<typeof depts>;