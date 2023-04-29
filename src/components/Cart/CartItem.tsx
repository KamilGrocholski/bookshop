import Image from 'next/image'

import { BsFillTrash3Fill } from 'react-icons/bs'

import { type RouterOutputs } from '~/utils/api'
import NumberInputCounter from '../NumberInputCounter'
import formatPrice from '~/utils/formatPrice'
import useCart from '~/hooks/useCart'

export type CartItemProps = RouterOutputs['cart']['getCart']['cart'][number]

const CartItem: React.FC<CartItemProps> = ({
    book,
    quantity,
    totalItemPrice,
}) => {
    const { setQuantity, remove, increment, decrement } = useCart()

    return (
        <div className="grid grid-cols-6 py-1 px-2">
            <button
                onClick={() => remove(book.id)}
                className="hover:bg-gray-300 rounded-full w-8 h-8 flex justify-center items-center"
            >
                <BsFillTrash3Fill className="text-red-500 flex items-center" />
            </button>
            <figure>
                <Image src={book.coverImageUrl} alt="" width={50} height={50} />
            </figure>
            <div className="col-span-2 flex items-center">{book.title}</div>
            <NumberInputCounter
                value={quantity}
                onChange={(e) => setQuantity(book.id, e.target.valueAsNumber)}
                onIncrement={() => increment(book.id, quantity)}
                onDecrement={() => decrement(book.id, quantity)}
            />
            <div className="justify-center flex items-center">
                {formatPrice(totalItemPrice)}
            </div>
        </div>
    )
}

export default CartItem
