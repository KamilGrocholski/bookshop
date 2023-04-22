import { createTRPCRouter } from '~/server/api/trpc'
import { bookRouter } from './routers/book'
import { authorRouter } from './routers/author'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    book: bookRouter,
    author: authorRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
