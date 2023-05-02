import { forwardRef } from 'react'
import Link from 'next/link'

import { api } from '~/utils/api'
import StateWrapper from '../StateWrapper'
import Button from '../Button'
import formatPrice from '~/utils/formatPrice'
import CartItem from './CartItem'
import useCart from '~/hooks/useCart'

const Cart = forwardRef<HTMLDivElement>((_, ref) => {
    const cartItemsQuery = api.cart.getCart.useQuery()

    const { resetCart } = useCart()

    return (
        <div
            ref={ref}
            className="absolute top-16 right-0 shadow-lg border border-gray-500/20 bg-white"
        >
            <StateWrapper
                data={cartItemsQuery.data}
                isLoading={cartItemsQuery.isLoading}
                isError={cartItemsQuery.isError}
                isEmpty={cartItemsQuery.data?.cart.length === 0}
                Empty={<div className="p-3">No items in the cart.</div>}
                Error={
                    <div className="p-3">
                        <span>An error has occured.</span>
                        <Button onClick={() => cartItemsQuery.refetch()}>
                            Try again
                        </Button>
                    </div>
                }
                NonEmpty={(data) => (
                    <div className="flex flex-col gap-1">
                        <ul className="flex flex-col divide-y overflow-y-scroll max-h-[30vh] p-3 overscroll-y-none">
                            {data.cart.map((item) => (
                                <li key={item.book.id.toString()}>
                                    <CartItem
                                        book={item.book}
                                        totalItemPrice={item.totalItemPrice}
                                        quantity={item.quantity}
                                    />
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-row justify-between bg-gray-200 px-2 border-t border-gray-300">
                            <button onClick={() => resetCart()}>Reset</button>
                            <div className="flex flex-row items-center gap-1">
                                <span className="font-semibold">Total:</span>
                                <span>{formatPrice(data.totalPrice)}</span>
                                <Button size="sm" className="font-bold">
                                    <Link href="/cart">Checkout</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    )
})

export default Cart
