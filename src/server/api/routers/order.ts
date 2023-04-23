import { createTRPCRouter, protectedProcedure } from '../trpc'

const makeOrderSchema = z.object({})

export const ordereRouter = createTRPCRouter({
    make: protectedProcedure.input(),
})
