import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { bookBase } from '~/schemes/base/bookBase.scheme'

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
    getCart: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                cart: {
                    select: {
                        book: {
                            select: {
                                id: true,
                                title: true,
                                coverImageUrl: true,
                            },
                        },
                    },
                },
            },
        })
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
