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
        <div className="grid grid-cols-3 py-1 px-2 items-start gap-3">
            <div className="col-span-2 flex flex-row gap-1">
                <figure className="min-w-[50px] min-h-[100px]">
                    <Image
                        src={book.coverImageUrl}
                        alt=""
                        width={50}
                        height={100}
                        className="w-auto h-auto"
                    />
                </figure>
                <div className="flex flex-col gap-1">
                    <h4>{book.title}</h4>
                    <span>{formatPrice(totalItemPrice)}</span>
                </div>
            </div>
            <div className="flex md:flex-row flex-col gap-2 items-center">
                <NumberInputCounter
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(book.id, e.target.valueAsNumber)
                    }
                    onIncrement={() => increment(book.id, quantity)}
                    onDecrement={() => decrement(book.id, quantity)}
                />
                <RemoveButton remove={() => remove(book.id)} />
            </div>
        </div>
    )
}

const RemoveButton: React.FC<{ remove: () => void }> = ({ remove }) => {
    return (
        <button
            onClick={remove}
            className="hover:bg-gray-300 rounded-full w-8 h-8 flex justify-center items-center"
        >
            <BsFillTrash3Fill className="text-red-500 flex items-center" />
        </button>
    )
}

export default CartItem
