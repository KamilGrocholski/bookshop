import React from 'react'
import { RouterOutputs } from '~/utils/api'
import Image from 'next/image'

const BookCard: React.FC<RouterOutputs['book']['bestsellers'][number]> = (
    book,
) => {
    return (
        <article className="flex flex-col space-y-2 items-center">
            <h2>{book.title}</h2>
            <div>
                <Image src={book.coverImageURL} alt={book.coverImageURL} />
            </div>
            <div>
                <p>{book.price}</p>
                <button className="uppercase bg-teal-700 p-3">
                    Add to cart
                </button>
            </div>
        </article>
    )
}

export default BookCard
