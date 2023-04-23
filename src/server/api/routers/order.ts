import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { bookBase } from '~/schemes/base/bookBase.scheme'
import { TRPCError } from '@trpc/server'

const makeOrderSchema = z.object({
    books: z.map(bookBase.id, z.number().int().positive()),
})

export const orderRouter = createTRPCRouter({
    make: protectedProcedure
        .input(makeOrderSchema)
        .mutation(async ({ ctx, input }) => {
            const { books } = input

            const booksIds = [...books.keys()]

            const existingBookIds = await ctx.prisma.book.findMany({
                where: {
                    id: {
                        in: booksIds,
                    },
                },
                select: {
                    id: true,
                    price: true,
                },
            })

            if (!existingBookIds) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            if (existingBookIds.length !== books.size) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            let totalOrderPrice = 0

            const orderItems: {
                bookId: bigint
                totalPrice: number
                quantity: number
            }[] = existingBookIds.map((book) => {
                const quantity = books.get(book.id)

                if (quantity === undefined) {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
                }

                const totalOrderItemPrice = book.price * quantity

                totalOrderPrice += totalOrderItemPrice

                return {
                    bookId: book.id,
                    totalPrice: totalOrderItemPrice,
                    quantity,
                }
            })

            return ctx.prisma.order.create({
                data: {
                    userId: ctx.session.user.id,
                    totalPrice: totalOrderPrice,
                    status: 'PENDING',
                    items: {
                        createMany: {
                            data: orderItems,
                        },
                    },
                },
            })
        }),
})
