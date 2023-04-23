import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'
import { bookBase } from '~/schemes/base/bookBase.scheme'

export const getBookByIdSchema = z.object({
    id: bookBase.id,
})

export const getBestSellersSchema = z.object({
    lastDays: z.number().int().positive(),
    take: z.number().int().positive(),
})

export const getRecentlyAddedSchema = z.object({
    take: z.number().int().positive(),
})

export const bookRouter = createTRPCRouter({
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

            const since = new Date(Date.now() - lastDays * 60 * 60 * 1000)

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
            })
        }),
})
