import React from 'react'
import Image from 'next/image'
import { Book } from '@prisma/client'

export type BookCard = Pick<Book, 'coverImageUrl' | 'id' | 'title'>

const BookCard: React.FC<BookCard> = (book) => {
    return (
        <article
            data-book__id={book.id}
            data-book__title={book.title}
            className="flex flex-col space-y-2 items-center"
        >
            <Image src={book.coverImageUrl} alt={book.coverImageUrl} />
        </article>
    )
}

export default BookCard
