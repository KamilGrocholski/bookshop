import type { Order } from '@prisma/client'
import { z } from 'zod'

export const COUNTRIES = ['Poland', 'Germany', 'Finland', 'USA'] as const

export const ORDER_STATUSES = ['PENDING', 'SHIPPING', 'DELIVERED'] as const

// export const addresZipRegex = /^\\d{5|2}-\\d{3}$/

export const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
)

export const orderBase = {
    id: z.bigint(),
    status: z.string().refine((value) => {
        if (ORDER_STATUSES.includes(value as Order['status'])) return true
    }) as z.ZodType<Order['status']>,
    totalPrice: z.number().nonnegative(),
    person: z.object({
        name: z.string().min(2).max(50),
        surname: z.string().min(2).max(50),
        email: z.string().email(),
        phone: z.string().regex(phoneRegex),
    }),
    address: z.object({
        country: z.enum(COUNTRIES),
        state: z.string().min(2).max(50),
        city: z.string().min(2).max(50),
        zip: z.string(),
        street: z.string().min(2).max(50),
    }),
}
