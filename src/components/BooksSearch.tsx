import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import useDebounce from '~/hooks/useDebounce'
import { api } from '~/utils/api'
import StateWrapper from './StateWrapper'
import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'

const BooksSearch = () => {
    const searchRef = useRef<HTMLInputElement | null>(null)

    const router = useRouter()

    const [query, setQuery] = useState<string>('')

    const debouncedQuery = useDebounce<string>(query)

    const booksQuery = api.book.getByQuery.useQuery(
        {
            query: debouncedQuery,
            take: 5,
        },
        {
            enabled: debouncedQuery.length > 0,
        },
    )

    const [shouldShowHints, setShouldShowHints] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value ?? '')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        void router.push({
            pathname: '/books/search',
            query: {
                query: debouncedQuery,
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="flex flex-row justify-between w-full bg-gray-300 items-center px-3 py-1 rounded-3xl">
                <input
                    ref={searchRef}
                    className="bg-transparent w-full outline-none"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setShouldShowHints(true)}
                    onBlur={() => setShouldShowHints(false)}
                />
                <button type="submit">Search</button>
            </div>
            <div
                className={clsx(
                    'absolute top-10 shadow-2xl shadow-black bg-white p-4',
                    !shouldShowHints && 'hidden',
                )}
            >
                <StateWrapper
                    data={booksQuery.data}
                    isLoading={booksQuery.isFetching}
                    isError={booksQuery.isError}
                    Error={<div>Error</div>}
                    Empty={<div>Empty</div>}
                    Loading={<div>Loading...</div>}
                    NonEmpty={({ books, count }) => (
                        <div className="flex flex-col gap-1">
                            <ul className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll overscroll-y-none px-2">
                                {books.map((book) => (
                                    <Link
                                        href={`/books/${book.id}`}
                                        className="group"
                                    >
                                        <li
                                            key={book.id.toString()}
                                            className="flex gap-2 items-start group-hover:bg-gray-300 p-2"
                                        >
                                            <Image
                                                width={50}
                                                height={100}
                                                src={book.coverImageUrl}
                                                alt={book.title}
                                            />
                                            <div className="flex flex-col gap-1 prose">
                                                <h4>{book.title}</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {book.authors.map(
                                                        (author) => (
                                                            <span
                                                                key={author.id.toString()}
                                                                className='after:content-[","] last:after:content-[""]'
                                                            >
                                                                {author.name}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                            <div>
                                <Link className="underline " href={''}>
                                    Total results: {count}
                                </Link>
                            </div>
                        </div>
                    )}
                />
            </div>
        </form>
    )
}

export default BooksSearch
