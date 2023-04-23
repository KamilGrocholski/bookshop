import { z } from 'zod'

export const publisherBase = {
    id: z.string().uuid(),
    name: z.string(),
}
