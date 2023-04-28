import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { bookBase } from '~/schemes/base/bookBase.scheme'
import { TRPCError } from '@trpc/server'

export const cartItemBase = {
    bookId: bookBase.id,
    quantity: z.number().int().nonnegative(),
}

export const addSchema = z.object({
    bookId: cartItemBase.bookId,
})

export const removeSchema = z.object({
    bookId: cartItemBase.bookId,
})

export const setQuantitySchema = z.object({
    bookId: cartItemBase.bookId,
    quantity: cartItemBase.quantity,
})

export const cartRouter = createTRPCRouter({
    clear: protectedProcedure.mutation(({ ctx }) => {
        return ctx.prisma.cartItem.deleteMany({
            where: {
                userId: ctx.session.user.id,
            },
        })
    }),
    getCart: protectedProcedure.query(async ({ ctx }) => {
        const userCart = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                cart: {
                    select: {
                        quantity: true,
                        book: {
                            select: {
                                id: true,
                                title: true,
                                coverImageUrl: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        })

        if (!userCart) {
            throw new TRPCError({ code: 'NOT_FOUND' })
        }

        let totalPrice = 0

        type SingleResult = (typeof userCart)['cart'][number] & {
            totalItemPrice: number
        }

        type Result = SingleResult[]

        const resultCart: Result = userCart.cart.map((item) => {
            let itemTotalPrice = item.quantity * item.book.price

            totalPrice += itemTotalPrice

            return {
                book: item.book,
                quantity: item.quantity,
                totalItemPrice: itemTotalPrice,
            }
        })

        return {
            totalPrice,
            cart: resultCart,
        }
    }),
    add: protectedProcedure.input(addSchema).mutation(({ ctx, input }) => {
        const { bookId } = input

        return ctx.prisma.cartItem.create({
            data: {
                userId: ctx.session.user.id,
                bookId,
                quantity: 1,
            },
        })
    }),
    remove: protectedProcedure
        .input(removeSchema)
        .mutation(({ ctx, input }) => {
            const { bookId } = input

            return ctx.prisma.cartItem.delete({
                where: {
                    id: {
                        userId: ctx.session.user.id,
                        bookId,
                    },
                },
            })
        }),
    setQuantity: protectedProcedure
        .input(setQuantitySchema)
        .mutation(({ ctx, input }) => {
            const { bookId, quantity } = input

            return ctx.prisma.cartItem.update({
                where: {
                    id: {
                        bookId,
                        userId: ctx.session.user.id,
                    },
                },
                data: {
                    quantity,
                },
            })
        }),
})
