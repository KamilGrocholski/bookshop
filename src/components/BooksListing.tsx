import BookCardWithAction, {
    type BookCardWithActionProps,
} from './Book/BookCardWithAction'

export type BooksListingProps = {
    books: BookCardWithActionProps[]
}

const BooksListing: React.FC<BooksListingProps> = ({ books }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {books.map((book) => (
                <BookCardWithAction
                    id={book.id}
                    price={book.price}
                    title={book.title}
                    coverImageUrl={book.coverImageUrl}
                    authors={book.authors}
                    key={book.id.toString()}
                />
            ))}
        </div>
    )
}

export default BooksListing
