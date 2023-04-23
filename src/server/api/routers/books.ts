import { z } from 'zod'
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc'
import { bookBase } from '~/schemes/base/bookBase.scheme'

export const addBookSchema = z.object({
    title: bookBase.title,
    coverImageUrl: bookBase.coverImageUrl,
    price: bookBase.price,
    pages: bookBase.pages,
    stock: bookBase.stock,
    description: bookBase.description,
    publishedAt: bookBase.publishedAt,
    publisherId: bookBase.publisherId,
    authorsIds: bookBase.authorsIds,
    categoriesIds: bookBase.categoriesIds,
    format: bookBase.format,
    coverType: bookBase.coverType,
})

export const addBooksSchema = z.object({
    books: addBookSchema.array(),
})

export const getBookByIdSchema = z.object({
    id: bookBase.id,
})

export const getBestSellersSchema = z.object({
    lastDays: z.number().int().positive(),
    take: z.number().int().positive(),
})

export const bookRouter = createTRPCRouter({
    addBooks: adminProcedure
        .input(addBooksSchema)
        .mutation(({ ctx, input }) => {
            const { books } = input

            return ctx.prisma.book.createMany({
                data: books.map((book) => {
                    return {
                        ...book,
                        authors: {
                            connect: book.authorsIds.map((a) => ({ id: a })),
                        },
                        categories: {
                            connect: book.categoriesIds.map((c) => ({ id: c })),
                        },
                    }
                }),
            })
        }),
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

            const since = new Date(
                Date.now() * lastDays * 60 * 60 * 1000,
            ).toISOString()

            return ctx.prisma.book.findMany({
                where: {
                    order: {
                        every: {
                            createdAt: {
                                gte: since,
                            },
                        },
                    },
                },
                take,
                orderBy: {
                    order: {
                        _count: 'desc',
                    },
                },
            })
        }),
})
