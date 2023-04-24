import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export type Cart = {
    items: {
        book: {
            id: bigint
            title: string
            coverImageUrl: string
        }
        quantity: number
    }[]
}

export const cartAtom = atomWithStorage<Cart>('cart', { items: [] })

export const isCartOpenAtom = atom<boolean>(false)
