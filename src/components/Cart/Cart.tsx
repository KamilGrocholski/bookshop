import { useAtom } from 'jotai'
import Image from 'next/image'
import { cartAtom, type Cart } from '~/atoms'

export type CartProps = Cart

const Cart: React.FC<CartProps> = () => {
    const [cart, setCart] = useAtom(cartAtom)

    const handleSetCartQuantity = (
        book: CartProps['items'][number]['book'],
        newQuantity: number,
    ) => {
        setCart((prev) => {
            return {
                items: prev.items.map((item) => {
                    if (item.book === book) {
                        return {
                            book: item.book,
                            quantity: newQuantity,
                        }
                    }

                    return item
                }),
            }
        })
    }

    return (
        <div>
            <ul className="flex flex-col space-y-3">
                {cart.items.map((item) => (
                    <li
                        key={item.book.id.toString()}
                        className="flex w-full justify-between"
                    >
                        <Image src={item.book.coverImageUrl} alt="" />
                        <span>{item.book.title}</span>
                        <input
                            type="number"
                            min={1}
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(e) =>
                                handleSetCartQuantity(
                                    item.book,
                                    parseInt(e.target.value, 10),
                                )
                            }
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Cart
