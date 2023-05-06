import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const subscribeSchema = z.object({
    email: z.string().email(),
})

export const newsletterRouter = createTRPCRouter({
    subscribe: publicProcedure
        .input(subscribeSchema)
        .mutation(({ ctx, input }) => {
            const { email } = input

            return ctx.prisma.newsletterSubscription.create({
                data: {
                    email,
                },
            })
        }),
})
