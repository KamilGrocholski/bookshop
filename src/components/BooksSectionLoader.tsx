import BookCardSkeleton from './Book/BookCardSkeleton'

const BooksSectionLoader: React.FC<{ items?: number }> = ({ items = 5 }) => {
    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-hidden">
                {Array.from({ length: items }).map(() => (
                    <BookCardSkeleton />
                ))}
            </div>
        </section>
    )
}

export default BooksSectionLoader
