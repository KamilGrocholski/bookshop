import { z } from 'zod'

export const addresZipRegex = /^\d{5}-\d{3}$/

export const addressBase = {
    country: z.string().min(2).max(50),
    state: z.string().min(2).max(50),
    city: z.string().min(2).max(50),
    zip: z.string().regex(addresZipRegex),
    street: z.string().min(2).max(50),
}
