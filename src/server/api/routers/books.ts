import { createTRPCRouter, publicProcedure } from '../trpc'
import { z } from 'zod'
import { categoryBase } from '~/schemes/base/categoryBase.scheme'
import getSecondsFrom from '~/utils/getSecondsFrom'

export const getBookByIdSchema = z.object({
    id: z.string().nonempty().transform(BigInt),
})

export const getBestSellersSchema = z.object({
    lastDays: z.number().int().positive(),
    take: z.number().int().positive(),
})

export const getRecentlyAddedSchema = z.object({
    take: z.number().int().positive(),
})

export const getPopularByCategoriesSchema = z.object({
    categories: categoryBase.id.array(),
    take: z.number().int().positive(),
})

export const getBooksByQuerySchema = z.object({
    query: z.string(),
    take: z.number().int().positive(),
})

export const booksPaginationSchema = z.object({
    itemsPerPage: z.number().int().nonnegative().default(25),
    cursor: z.bigint().optional(),
    query: z.string(),
})

export const bookRouter = createTRPCRouter({
    booksPagination: publicProcedure
        .input(booksPaginationSchema)
        .query(async ({ ctx, input }) => {
            const { query, itemsPerPage, cursor } = input

            const books = await ctx.prisma.book.findMany({
                take: itemsPerPage + 1,
                where: {
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            authors: {
                                some: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    ],
                },
                cursor:
                    cursor !== undefined
                        ? {
                              id: cursor,
                          }
                        : undefined,
                orderBy: {
                    id: 'desc',
                },
                select: {
                    id: true,
                    title: true,
                    coverImageUrl: true,
                    price: true,
                    authors: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

            let nextCursor: typeof cursor = undefined

            if (books.length > itemsPerPage) {
                const nextBook = books.pop()
                nextCursor = nextBook!.id
            }

            return {
                books,
                nextCursor,
            }
        }),
    getByQuery: publicProcedure
        .input(getBooksByQuerySchema)
        .query(async ({ ctx, input }) => {
            const { take, query } = input

            const count = await ctx.prisma.book.count({
                where: {
                    OR: [
                        {
                            authors: {
                                some: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
            })

            const books = await ctx.prisma.book.findMany({
                take,
                where: {
                    OR: [
                        {
                            authors: {
                                some: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    coverImageUrl: true,
                    authors: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

            return {
                books,
                count,
            }
        }),
    getSimilarBooks: publicProcedure
        .input(getPopularByCategoriesSchema)
        .query(({ ctx, input }) => {
            const { take, categories } = input

            return ctx.prisma.book.findMany({
                take,
                where: {
                    categories: {
                        some: {
                            id: {
                                in: categories,
                            },
                        },
                    },
                },
                orderBy: {
                    orderItems: {
                        _count: 'desc',
                    },
                },
                select: {
                    id: true,
                    title: true,
                    coverImageUrl: true,
                    price: true,
                    authors: {
                        select: {
                            id: true,
                            name: true,
                        },
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
                include: {
                    authors: true,
                    categories: true,
                    publisher: true,
                },
            })
        }),
    getBestSellers: publicProcedure
        .input(getBestSellersSchema)
        .query(({ ctx, input }) => {
            const { take, lastDays } = input

            const since = new Date(
                Date.now() -
                    getSecondsFrom({ unit: 'DAY', value: lastDays }) * 1000,
            )

            return ctx.prisma.book.findMany({
                take,
                where: {
                    orderItems: {
                        every: {
                            order: {
                                createdAt: {
                                    gte: since,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    orderItems: {
                        _count: 'desc',
                    },
                },
                select: {
                    id: true,
                    title: true,
                    coverImageUrl: true,
                    price: true,
                    authors: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        }),
    getRecentlyAdded: publicProcedure
        .input(getRecentlyAddedSchema)
        .query(({ ctx, input }) => {
            const { take } = input

            return ctx.prisma.book.findMany({
                take,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    title: true,
                    coverImageUrl: true,
                    authors: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        }),
})
