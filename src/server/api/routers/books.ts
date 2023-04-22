import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { Order } from '@prisma/client'

const ORDER_STATUSES: Order['status'][] = [
    'CANCEL',
    'PENDING',
    'SHIPPING',
    'DELIVERED',
]

const publisherBase = {
    id: z.string().uuid(),
    name: z.string(),
}

const authorBase = {
    id: z.string().uuid(),
    name: z.string(),
}

const categoryBase = {
    id: z.string().uuid(),
    name: z.string(),
}

const orderBase = {
    id: z.string().uuid(),
    status: z.string().refine((value) => {
        if (ORDER_STATUSES.includes(value as Order['status'])) return true
    }) as z.ZodType<Order['status']>,
}

const bookBase = {
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    stock: z.number().int().nonnegative(),
    price: z.number().nonnegative(),
    publishedAt: z.date(),
    pages: z.number().int().nonnegative(),
    format: z.string(),
    coverType: z.string(),
    coverImageUrl: z.string(),
    authorsIds: authorBase.id.array(),
    publisherId: publisherBase.id,
    categoriesIds: categoryBase.id.array(),
}

const addBookSchema = z.object(bookBase)

const addBooksSchema = z.object({
    books: addBookSchema.array(),
})

const getBookByIdSchema = z.object({
    id: bookBase.id,
})

const getBestSellersSchema = z.object({
    lastDays: z.number().int().positive(),
    take: z.number().int().positive(),
})

export const bookRouter = createTRPCRouter({
    addBook: publicProcedure.input(addBookSchema).mutation(({ ctx, input }) => {
        return ctx.prisma.book.create({
            data: {
                ...input,
                authors: {
                    connect: input.authorsIds.map((a) => ({ id: a })),
                },
                categories: {
                    connect: input.categoriesIds.map((c) => ({ id: c })),
                },
            },
        })
    }),
    getOneById: publicProcedure
        .input(getBookByIdSchema)
        .query(({ ctx, input }) => {
            const { id } = input

            return ctx.prisma.book.findUnique({
                where: {
                    id,
                },
            })
        }),
    getBestSellers: publicProcedure
        .input(getBestSellersSchema)
        .query(({ ctx, input }) => {
            const { take, lastDays } = input

            return ctx.prisma.book.findMany({
                // TODO add `where` condition for createdAt
                take,
                orderBy: {
                    order: {
                        _count: 'desc',
                    },
                },
            })
        }),
})
