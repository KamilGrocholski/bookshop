import { z } from 'zod'

export const authorBase = {
    id: z.bigint(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string(),
}
