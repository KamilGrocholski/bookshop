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
        <article className="flex flex-col">
            <div>
                <Link href={`/books/${id}`}>
                    <Image
                        width={250}
                        height={200}
                        src={coverImageUrl}
                        alt={title}
                    />
                </Link>
            </div>
            <div className="flex flex-col justify-between h-full">
                <h3>{title}</h3>
                <div className="flex flex-wrap gap-1">
                    {authors.map((author) => (
                        <Link
                            key={author.id.toString()}
                            href={`/authors/${author.id}`}
                        >
                            {author.name}
                        </Link>
                    ))}
                </div>
                <p>${price}</p>
            </div>
            <div className="w-full flex justify-center">
                <Button className="w-full">Add to cart</Button>
            </div>
        </article>
    )
}

export default BookCardWithAction
