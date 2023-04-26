import BookCard, { BookCardProps } from "./Book/BookCard";

export type BooksSectionProps = {
  title: string;
  books: BookCardProps[];
};

const BooksSection: React.FC<BooksSectionProps> = ({ title, books }) => {
  return (
    <section>
      <h1>{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {books.map((book) => (
          <BookCard
            id={book.id}
            title={book.title}
            coverImageUrl={book.coverImageUrl}
            authors={book.authors}
            key={book.id.toString()}
          />
        ))}
      </div>
    </section>
  );
};

export default BooksSection;
