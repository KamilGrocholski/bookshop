import { z } from 'zod'

export const cartItemBase = {
    id: z.string().uuid(),
    quantity: z.number().int().nonnegative(),
    total: z.number().nonnegative(),
}

export const cartBase = z.object(cartItemBase).array()
