import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const getOneByIdSchema = z.object({
    authorId: z.string().nonempty().transform(BigInt),
})

export const authorRouter = createTRPCRouter({
    getOneById: publicProcedure
        .input(getOneByIdSchema)
        .query(({ ctx, input }) => {
            const { authorId } = input

            return ctx.prisma.author.findUnique({
                where: {
                    id: authorId,
                },
                include: {
                    books: {
                        include: {
                            authors: true,
                        },
                    },
                    _count: {
                        select: {
                            books: true,
                        },
                    },
                },
            })
        }),
})
