import { InferInsertModel } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

export const syllabus = pgTable(
  'syllabus',
  {
    courseId: text('course_id').notNull(),
    term: text('term').notNull(),
    instructors: text('instructors').notNull(),
    link: text('link').notNull()
  },
  (table) => ([
    primaryKey({ columns: [table.courseId, table.term, table.instructors]})
  ])
);

export type Syllabus = InferInsertModel<typeof syllabus>;
