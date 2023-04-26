import Button from './Button'
import Loader from './Loader'
import StateWrapper from './StateWrapper'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { GoSearch } from 'react-icons/go'
import useDebounce from '~/hooks/useDebounce'
import useOnClickOutside from '~/hooks/useOnClickOutside'
import { api } from '~/utils/api'

const BooksSearch = () => {
    const searchRef = useRef<HTMLInputElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)

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

        if (debouncedQuery.length === 0) {
            return
        }

        void router.push({
            pathname: '/books/search',
            query: {
                query: debouncedQuery,
            },
        })
    }

    useOnClickOutside(formRef, () => {
        setShouldShowHints(false)
    })

    const handleTryAgain = () => {
        booksQuery.refetch()
    }

    const handleKeydown = (e: React.KeyboardEvent) => {
        const { key } = e

        switch (key) {
            case 'Escape':
                e.preventDefault()
                setShouldShowHints(false)
                return
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full lg:min-w-[400px]"
            ref={formRef}
        >
            <div className="flex flex-row justify-between w-full bg-gray-300 items-center px-3 py-1 rounded-3xl relative">
                <input
                    ref={searchRef}
                    className="bg-transparent w-full outline-none pr-5"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setShouldShowHints(true)}
                    onKeyDown={handleKeydown}
                    type="search"
                    placeholder="Search titles, authors"
                    aria-placeholder="Search titles, authors"
                />
                <button
                    type="submit"
                    className="transition-all duration-300 ease-in-out absolute right-0 top-0 bottom-0 text-gray-600 hover:bg-gray-500/30 rounded-3xl w-8 flex items-center justify-center"
                >
                    <GoSearch />
                </button>
            </div>
            <div
                className={clsx(
                    'z-40 absolute rounded-lg top-10 left-0 right-0 shadow-2xl shadow-black bg-white',
                    !shouldShowHints && 'hidden',
                )}
            >
                <StateWrapper
                    data={booksQuery.data}
                    isLoading={booksQuery.isFetching}
                    isError={booksQuery.isError}
                    isEmpty={booksQuery?.data?.books.length === 0}
                    Error={
                        <div className="flex flex-col gap-1 p-4 items-center">
                            <span>An error has occured.</span>
                            <Button size="sm" onClick={handleTryAgain}>
                                Try again
                            </Button>
                        </div>
                    }
                    Empty={
                        <div className="flex flex-col gap-1 p-4 items-center">
                            {query.length === 0 ? (
                                <span>Type anything...</span>
                            ) : (
                                <span>No results</span>
                            )}
                        </div>
                    }
                    Loading={
                        <div className="flex flex-col gap-1 p-4 items-center">
                            <Loader />
                        </div>
                    }
                    NonEmpty={({ books, count }) => (
                        <div className="flex flex-col gap-1">
                            <ul className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll overscroll-y-none px-2">
                                {books.map((book) => (
                                    <Link
                                        onClick={() => {
                                            setShouldShowHints(false)
                                        }}
                                        href={`/books/book/${book.id}`}
                                        className="group"
                                        key={book.id.toString()}
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
                                            <div className="flex flex-col gap-1">
                                                <h4>{book.title}</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {book.authors.map(
                                                        (author) => (
                                                            <span
                                                                key={author.id.toString()}
                                                                // adds `,` after every name except the last one
                                                                className='text-sm after:content-[","] last:after:content-[""]'
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
                            <div className="bg-gray-200 px-2 border-t border-gray-300">
                                <Link
                                    className="underline text-sm font-semibold text-gray-500"
                                    onClick={() => setShouldShowHints(false)}
                                    href={{
                                        pathname: '/books/search',
                                        query: {
                                            query: debouncedQuery,
                                        },
                                    }}
                                >
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
