import Image from 'next/image'
import Link from 'next/link'

import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { type RouterOutputs, api } from '~/utils/api'
import formatDate from '~/utils/formatDate'
import formatPrice from '~/utils/formatPrice'

const MyOrdersPage = () => {
    const ordersQuery = api.order.getMyOrders.useQuery()

    return (
        <MainLayout>
            <StateWrapper
                data={ordersQuery.data}
                isLoading={ordersQuery.isLoading}
                isError={ordersQuery.isError}
                NonEmpty={(data) => (
                    <div>
                        <ul className="flex flex-col gap-5">
                            {data.map((order) => (
                                <Order key={order.id.toString()} {...order} />
                            ))}
                        </ul>
                    </div>
                )}
            />
        </MainLayout>
    )
}

const Order: React.FC<RouterOutputs['order']['getMyOrders'][number]> = (
    order,
) => {
    return (
        <li className="grid grid-cols-2 gap-2 border border-gray-300 p-3">
            <ul>
                {order.items.map((item) => (
                    <OrderItem key={item.id.toString()} {...item} />
                ))}
            </ul>
            <div className="flex flex-col gap-3 border border-gray-300 p-3 divide-y divide-gray-300">
                <div>
                    <h3>Created at</h3>
                    <span>{formatDate(order.createdAt)}</span>
                </div>
                <div>
                    <h3>Status</h3>
                    <span>{order.status}</span>
                </div>
                <div>
                    <h3>Total</h3>
                    <span>{formatPrice(order.totalPrice)}</span>
                </div>
                <div>
                    <h3>Credentials</h3>
                    <p>{order.name}</p>
                    <p>{order.surname}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                    <p>{order.zip}</p>
                    <p>{order.city}</p>
                    <p>{order.country}</p>
                    <p>{order.street}</p>
                    <p>{order.state}</p>
                </div>
            </div>
        </li>
    )
}

const OrderItem: React.FC<
    RouterOutputs['order']['getMyOrders'][number]['items'][number]
> = (item) => {
    return (
        <li className="flex flex-row items-center gap-5">
            <div className="font-semibold text-xl">{item.quantity}</div>
            <div className="font-semibold text-xl">X</div>
            <Link href={`/books/book/${item.book.id}`}>
                <figure>
                    <Image
                        className="h-auto w-auto"
                        width={50}
                        height={100}
                        src={item.book.coverImageUrl}
                        alt=""
                    />
                    <figcaption>{item.book.title}</figcaption>
                </figure>
            </Link>
        </li>
    )
}

export default MyOrdersPage
