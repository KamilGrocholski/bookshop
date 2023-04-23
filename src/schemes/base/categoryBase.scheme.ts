import { z } from 'zod'

export const categoryBase = {
    id: z.string().uuid(),
    name: z.string(),
}
