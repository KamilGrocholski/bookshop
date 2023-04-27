import ShouldRender from '../ShouldRender'
import Image from 'next/image'
import { forwardRef } from 'react'
import { useCartStore } from '~/store/cart'

const Cart = forwardRef<HTMLDivElement>((_, ref) => {
    const remove = useCartStore((state) => state.remove)
    const books = useCartStore((state) => state.books)

    return (
        <div ref={ref} className="absolute top-16 right-0 border border-black">
            <ul className="flex flex-col space-y-3">
                <ShouldRender if={books.length === 0}>
                    You have no items in the cart.
                </ShouldRender>
                {books.map((book) => (
                    <li
                        key={book.id.toString()}
                        className="flex w-full justify-between"
                    >
                        <h3>{book.title}</h3>
                    </li>
                ))}
            </ul>
        </div>
    )
})

export default Cart
