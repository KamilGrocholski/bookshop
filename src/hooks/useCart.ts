import { Book } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { handleSignIn } from '~/components/SessionStateWrapper'
import { api } from '~/utils/api'

export default function useCart() {
    const { data: session } = useSession()

    const utils = api.useContext()

    const addToCartMutation = api.cart.add.useMutation({
        onSuccess() {
            utils.cart.getCart.invalidate()
            toast('Book added to the cart.', {
                type: 'success',
            })
        },
        onError() {
            toast('Book not added to the cart.', {
                type: 'error',
            })
        },
    })

    function handleAddToCart(bookId: Book['id']) {
        if (session?.user) {
            const isAlreadyInCart = !!utils.cart.getCart
                .getData()
                ?.cart.some((item) => item.book.id === bookId)

            if (isAlreadyInCart) {
                toast('Book is already in the cart.', {
                    type: 'info',
                })

                return
            }

            addToCartMutation.mutate({
                bookId,
            })

            return
        }

        handleSignIn()
    }

    const setQuantityMutation = api.cart.setQuantity.useMutation({
        onSuccess() {
            utils.cart.getCart.invalidate()
        },
    })

    function handleSetQuantity(bookId: Book['id'], newQuantity: number) {
        setQuantityMutation.mutate({
            bookId,
            quantity: newQuantity,
        })
    }

    function handleIncrement(bookId: Book['id'], currentQuantity: number) {
        setQuantityMutation.mutate({
            bookId,
            quantity: currentQuantity + 1,
        })
    }

    function handleDecrement(bookId: Book['id'], currentQuantity: number) {
        if (currentQuantity <= 1) {
            return
        }

        setQuantityMutation.mutate({
            bookId,
            quantity: currentQuantity - 1,
        })
    }

    const removeMutation = api.cart.remove.useMutation({
        onSuccess() {
            utils.cart.getCart.invalidate()
            toast('Book removed from the cart.', {
                type: 'success',
            })
        },
        onError() {
            toast('Book not removed from the cart.', {
                type: 'error',
            })
        },
    })

    function handleRemove(bookId: Book['id']) {
        removeMutation.mutate({
            bookId,
        })
    }

    const resetCartMutation = api.cart.clear.useMutation({
        onSuccess() {
            utils.cart.getCart.invalidate()
            toast('The cart is now empty', {
                type: 'success',
            })
        },
        onError() {
            toast('Could not reset the cart.', {
                type: 'error',
            })
        },
    })

    return {
        add: handleAddToCart,
        setQuantity: handleSetQuantity,
        decrement: handleDecrement,
        increment: handleIncrement,
        remove: handleRemove,
        resetCart: resetCartMutation.mutate,
    }
}
