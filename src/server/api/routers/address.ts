import { createTRPCRouter, protectedProcedure } from '../trpc'
import { addAddressSchema, updateAddressSchema } from '~/schemes/address'

export const addressRouter = createTRPCRouter({
    add: protectedProcedure
        .input(addAddressSchema)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.address.create({
                data: {
                    userId: ctx.session.user.id,
                    ...input,
                },
            })
        }),
    update: protectedProcedure
        .input(updateAddressSchema)
        .mutation(({ ctx, input }) => {
            const { addressId, ...newAddress } = input

            return ctx.prisma.address.update({
                where: {
                    id: addressId,
                },
                data: newAddress,
            })
        }),
})
