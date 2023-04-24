import React from 'react'
import Image from 'next/image'
import { RouterOutputs } from '~/utils/api'
import Link from 'next/link'

export type BookCardProps = RouterOutputs['book']['getBestSellers'][number]

const BookCard: React.FC<BookCardProps> = (book) => {
    return (
        <Link href={`/books/${book.id.toString()}`}>
            <article
                data-book__id={book.id}
                data-book__title={book.title}
                data-book__cover-image-url={book.coverImageUrl}
                className="relative group flex flex-col space-y-2 items-center h-fit w-fit cursor-pointer"
            >
                <Image
                    width={200}
                    height={200}
                    src={book.coverImageUrl}
                    alt={book.coverImageUrl}
                    loading="lazy"
                />
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
