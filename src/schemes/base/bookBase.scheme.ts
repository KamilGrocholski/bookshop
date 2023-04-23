import { z } from 'zod'
import { publisherBase } from './publisherBase.scheme'
import { authorBase } from './authorBase.scheme'
import { categoryBase } from './categoryBase.scheme'

export const bookBase = {
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    stock: z.number().int().nonnegative(),
    price: z.number().nonnegative(),
    publishedAt: z.date(),
    pages: z.number().int().nonnegative(),
    format: z.string(),
    coverType: z.string(),
    coverImageUrl: z.string(),
    authorsIds: authorBase.id.array(),
    publisherId: publisherBase.id,
    categoriesIds: categoryBase.id.array(),
}
