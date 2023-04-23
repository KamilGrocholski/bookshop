import type { Book } from '@prisma/client'
import BookCard from './Book/BookCard'

export type BooksSectionProps = {
    title: string
    books: Pick<Book, 'coverImageUrl' | 'title' | 'id'>[]
}

const BooksSection: React.FC<BooksSectionProps> = ({ title, books }) => {
    return (
        <section>
            <h1>{title}</h1>
            <div>
                {books.map((book) => (
                    <BookCard
                        id={book.id}
                        coverImageUrl={book.coverImageUrl}
                        title={book.title}
                        key={book.id}
                    />
                ))}
            </div>
        </section>
    )
}

export default BooksSection
