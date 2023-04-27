import { authorRouter } from './routers/author'
import { bookRouter } from './routers/books'
import { createTRPCRouter } from '~/server/api/trpc'
import { cartRouter } from './routers/cart'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    book: bookRouter,
    author: authorRouter,
    cart: cartRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
