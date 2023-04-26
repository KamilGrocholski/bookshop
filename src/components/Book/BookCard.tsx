import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { RouterOutputs } from '~/utils/api'

export type BookCardProps = RouterOutputs['book']['getBestSellers'][number]

const BookCard: React.FC<BookCardProps> = (book) => {
    return (
        <Link href={`/books/book/${book.id.toString()}`}>
            <article
                data-book__id={book.id}
                data-book__title={book.title}
                data-book__cover-image-url={book.coverImageUrl}
                className="relative group flex flex-col space-y-2 items-center h-fit w-fit cursor-pointer"
            >
                <figure>
                    <Image
                        width={165}
                        height={250}
                        src={book.coverImageUrl}
                        alt={book.coverImageUrl}
                        loading="lazy"
                    />
                </figure>
                <div className="group-hover:opacity-100 opacity-0 absolute inset-0 bg-black/50 text-white transition-all duration-300 ease-in-out p-3 flex flex-col justify-between">
                    <p>{book.title}</p>
                    <ul className="flex flex-wrap gap-3">
                        {book.authors.map((author) => (
                            <li key={author.id.toString()}>{author.name}</li>
                        ))}
                    </ul>
                </div>
            </article>
        </Link>
    )
}

export default BookCard
