import { authorRouter } from './routers/author'
import { bookRouter } from './routers/books'
import { createTRPCRouter } from '~/server/api/trpc'
import { cartRouter } from './routers/cart'
import { orderRouter } from './routers/order'
import { categoryRouter } from './routers/category'
import { newsletterRouter } from './routers/newsletter'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    book: bookRouter,
    author: authorRouter,
    cart: cartRouter,
    order: orderRouter,
    category: categoryRouter,
    newsletter: newsletterRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
