import { FaTimes } from 'react-icons/fa'

import { forwardRef } from 'react'
import Image from 'next/image'

import { api } from '~/utils/api'
import StateWrapper from '../StateWrapper'
import NumberInputCounter from '../NumberInputCounter'
import Button from '../Button'

const Cart = forwardRef<HTMLDivElement>((_, ref) => {
    const cartItemsQuery = api.cart.getCart.useQuery()

    const utils = api.useContext()

    const setQuantityMutation = api.cart.setQuantity.useMutation({
        onSuccess() {
            utils.cart.getCart.refetch()
        },
        onError(error) {
            console.error(error)
        },
    })

    const removeMutation = api.cart.remove.useMutation({
        onSuccess() {
            utils.cart.getCart.refetch()
        },
        onError(error) {
            console.error(error)
        },
    })

    const handleRemove = (bookId: bigint) => {
        removeMutation.mutate({
            bookId,
        })
    }

    const handleSetQuantity = (bookId: bigint, quantity: number) => {
        setQuantityMutation.mutate({
            bookId,
            quantity,
        })
    }

    const handleIncrement = (bookId: bigint, currentQuantity: number) => {
        setQuantityMutation.mutate({
            bookId,
            quantity: currentQuantity + 1,
        })
    }

    const handleDecrement = (bookId: bigint, currentQuantity: number) => {
        if (currentQuantity <= 1) {
            return
        }

        setQuantityMutation.mutate({
            bookId,
            quantity: currentQuantity - 1,
        })
    }

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
                Empty={<div>No items in the cart.</div>}
                Error={
                    <div>
                        <span>An error has occured.</span>
                        <Button onClick={() => cartItemsQuery.refetch()}>
                            Try again
                        </Button>
                    </div>
                }
                NonEmpty={(data) => (
                    <ul className="flex flex-col divide-y overflow-y-scroll max-h-[30vh] p-3 overscroll-y-none">
                        {data.cart.map((item) => (
                            <li
                                key={item.book.id.toString()}
                                className="grid grid-cols-4 gap-3 py-1 px-2 items-center hover:bg-gray-300"
                            >
                                <figure className="col-span-1">
                                    <Image
                                        src={item.book.coverImageUrl}
                                        alt=""
                                        width={50}
                                        height={50}
                                    />
                                </figure>
                                <span className="col-span-2">
                                    {item.book.title}
                                </span>
                                <form className="col-span-1 flex flex-row items-center">
                                    <NumberInputCounter
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleSetQuantity(
                                                item.book.id,
                                                e.target.valueAsNumber,
                                            )
                                        }
                                        onDecrement={() =>
                                            handleDecrement(
                                                item.book.id,
                                                item.quantity,
                                            )
                                        }
                                        onIncrement={() =>
                                            handleIncrement(
                                                item.book.id,
                                                item.quantity,
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="flex justify-end"
                                        onClick={() =>
                                            handleRemove(item.book.id)
                                        }
                                    >
                                        <FaTimes className="text-red-500" />
                                    </button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}
            />
        </div>
    )
})

export default Cart
