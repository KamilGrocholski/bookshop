import { z } from 'zod'

export const authorBase = {
    id: z.string().uuid(),
    name: z.string(),
}
