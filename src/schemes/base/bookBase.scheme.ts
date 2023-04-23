import { z } from 'zod'

export const bookBase = {
    id: z.bigint(),
    title: z.string(),
    description: z.string(),
    stock: z.number().int().nonnegative(),
    price: z.number().nonnegative(),
    publishedAt: z.date(),
    pages: z.number().int().nonnegative(),
    coverImageUrl: z.string(),
}
