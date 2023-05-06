import Button from '../Button'
import { Author, Book } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { api } from '~/utils/api'
import formatPrice from '~/utils/formatPrice'
import { handleSignIn } from '../SessionStateWrapper'

export type BookCardWithActionProps = Pick<
    Book,
    'id' | 'coverImageUrl' | 'title' | 'price'
> & {
    authors: Pick<Author, 'id' | 'name'>[]
}

const BookCardWithAction: React.FC<BookCardWithActionProps> = ({
    id,
    coverImageUrl,
    price,
    title,
    authors,
}) => {
    const { data: session } = useSession()

    const utils = api.useContext()

    const addToCartMutation = api.cart.add.useMutation({
        onSuccess() {
            utils.cart.getCart.refetch()
            toast('Book added to the cart', {
                type: 'success',
            })
        },
        onError() {
            toast('Book not added to the cart', {
                type: 'error',
            })
        },
    })

    function handleAddToCart() {
        if (session?.user) {
            const isAlreadyInCart = !!utils.cart.getCart
                .getData()
                ?.cart.some((item) => item.book.id === id)

            if (isAlreadyInCart) {
                toast('Book is already in the cart.', {
                    type: 'info',
                })

                return
            }

            addToCartMutation.mutate({
                bookId: id,
            })

            return
        }

        handleSignIn()
    }

    return (
        <article className="flex flex-col gap-2 p-2 shadow-gray-300 shadow-xl border border-gray-100 hover:shadow-3xl hover:bg-gray-200 hover:scale-105 transition-all delay-50 duration-200 ease-in-out rounded-lg">
            <Link href={`/books/book/${id}`}>
                <figure className="w-full flex justify-center">
                    <Image
                        src={coverImageUrl}
                        alt={title}
                        width={256}
                        height={256}
                    />
                </figure>
            </Link>
            <div className="grid grid-cols-1 auto-rows-fr gap-1 h-full">
                <h3 className="text-center">{title}</h3>
                <div className="flex flex-wrap gap-1 justify-center">
                    {authors.map((author) => (
                        <span
                            key={author.id.toString()}
                            className='text-sm after:content-[","] last:after:content-[""]'
                        >
                            {author.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-center font-semibold">
                    {formatPrice(price)}
                </p>
                <Button onClick={handleAddToCart}>Add to cart</Button>
            </div>
        </article>
    )
}

export default BookCardWithAction
