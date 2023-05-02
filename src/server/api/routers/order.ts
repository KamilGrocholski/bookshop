import { z } from 'zod'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { orderBase } from '~/schemes/base/orderBase.scheme'

export const makeOrderSchema = z.object({
    person: orderBase.person,
    address: orderBase.address,
    // books: z.map(bookBase.id, z.number().int().positive()),
})

export const updateOrderStatusSchema = z.object({
    orderId: orderBase.id,
    status: orderBase.status,
})

export const paymentSchema = z.object({
    orderId: orderBase.id,
})

export const orderRouter = createTRPCRouter({
    make: protectedProcedure
        .input(makeOrderSchema)
        .mutation(async ({ ctx, input }) => {
            const { address, person } = input

            // get CartItem[] by userId
            const cartQuery = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    cart: {
                        select: {
                            bookId: true,
                            quantity: true,
                        },
                    },
                },
            })

            if (!cartQuery) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            // get booksIds array for next query
            const booksIds = cartQuery.cart.map((book) => book.bookId)

            // check if books from cartQuery exist
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
            if (existingBookIds.length !== booksIds.length) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            let totalOrderPrice = 0

            // books lookup for easier orderItems creation
            const booksLookup = new Map<bigint, number>(
                cartQuery.cart.map((book) => {
                    return [book.bookId, book.quantity]
                }),
            )

            // for order.create
            const orderItems: {
                bookId: bigint
                totalPrice: number
                quantity: number
            }[] = existingBookIds.map((book) => {
                const quantity = booksLookup.get(book.id)

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

            return await ctx.prisma.$transaction([
                ctx.prisma.order.create({
                    data: {
                        userId: ctx.session.user.id,
                        totalPrice: totalOrderPrice,
                        status: 'PENDING',
                        items: {
                            createMany: {
                                data: orderItems,
                            },
                        },
                        ...address,
                        ...person,
                    },
                }),
                // remove every CartItem after order.create with success
                ctx.prisma.cartItem.deleteMany({
                    where: {
                        userId: ctx.session.user.id,
                    },
                }),
            ])
        }),
    updateOrderStatus: protectedProcedure
        .input(updateOrderStatusSchema)
        .mutation(({ ctx, input }) => {
            const { status, orderId } = input

            return ctx.prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status,
                },
            })
        }),
    payment: protectedProcedure
        .input(paymentSchema)
        .mutation(async ({ ctx, input }) => {
            const { orderId } = input

            const order = await ctx.prisma.order.findUnique({
                where: {
                    id: orderId,
                },
                select: {
                    totalPrice: true,
                    status: true,
                },
            })

            if (!order) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            if (order.status !== 'PENDING') {
                throw new TRPCError({ code: 'PRECONDITION_FAILED' })
            }

            // simulate payment delay
            await new Promise((res) => setTimeout(res, 2000))

            return await ctx.prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: 'SHIPPING',
                },
            })
        }),
    getMyOrders: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                userId: ctx.session.user.id,
            },
            include: {
                items: {
                    include: {
                        book: true,
                    },
                },
            },
        })
    }),
})
