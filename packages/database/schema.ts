import { InferInsertModel } from 'drizzle-orm';
import { index, pgTable, text } from 'drizzle-orm/pg-core';

export const syllabus = pgTable(
  'syllabus',
  {
    courseId: text('course_id').notNull(),
    term: text('term').notNull(),
    instructors: text('instructors').notNull(),
    link: text('link').notNull()
  },
  (table) => ({
    courseIdIndex: index('course_id_index').on(table.courseId)
  })
);

export type Syllabus = InferInsertModel<typeof syllabus>;

export const dept = pgTable('dept', {
  dept: text('dept').notNull()
});

export type Dept = InferInsertModel<typeof dept>;
