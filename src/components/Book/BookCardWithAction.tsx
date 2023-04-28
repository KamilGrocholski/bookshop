import Button from '../Button'
import { Author, Book } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { api } from '~/utils/api'

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
        addToCartMutation.mutate({
            bookId: id,
        })
    }

    return (
        <article className="flex flex-col gap-2 hover:shadow-lg rounded-lg">
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
                <p className="text-center font-semibold">{price} $</p>
                <Button onClick={handleAddToCart}>Add to cart</Button>
            </div>
        </article>
    )
}

export default BookCardWithAction
