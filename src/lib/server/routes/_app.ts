import { course, getSyllabi } from '$lib/websoc';
import { publicProcedure, router } from '../trpc';
 
export const appRouter = router({
  search: publicProcedure.input(course).query(async data => {
    const syllabi = await getSyllabi(data.input);

    return syllabi;
  }),
});
 
export type AppRouter = typeof appRouter;