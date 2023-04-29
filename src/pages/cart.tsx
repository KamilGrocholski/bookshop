import Button from '~/components/Button'
import CartItem from '~/components/Cart/CartItem'
import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { api } from '~/utils/api'
import formatPrice from '~/utils/formatPrice'

const CartPage = () => {
    const cartQuery = api.cart.getCart.useQuery()

    return (
        <MainLayout>
            <StateWrapper
                data={cartQuery.data}
                isLoading={cartQuery.isLoading}
                isError={cartQuery.isError}
                isEmpty={cartQuery.data?.cart.length === 0}
                NonEmpty={(data) => (
                    <div>
                        <div className="flex flex-row items-center justify-between border-b pb-2">
                            <div className="text-lg font-semibold">
                                <span>Total: </span>
                                <span>{formatPrice(data.totalPrice)}</span>
                            </div>
                            <Button className="text-lg font-semibold">
                                Paying
                            </Button>
                        </div>
                        <div>
                            <ul>
                                {data.cart.map((item) => (
                                    <CartItem
                                        {...item}
                                        key={item.book.id.toString()}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default CartPage
