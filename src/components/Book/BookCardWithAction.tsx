import { Author, Book } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button'

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
    return (
        <article className="flex flex-col gap-2 hover:shadow-lg rounded-lg">
            <figure className="w-full flex justify-center">
                <Image
                    src={coverImageUrl}
                    alt={title}
                    width={256}
                    height={256}
                />
            </figure>
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
                <Button>Add to cart</Button>
            </div>
        </article>
    )
}

export default BookCardWithAction
