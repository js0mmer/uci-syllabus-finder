import { initTRPC } from '@trpc/server';

export const createSvelteKitContext = (locals: App.Locals) => () => locals;

const t = initTRPC.context<ReturnType<typeof createSvelteKitContext>>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
