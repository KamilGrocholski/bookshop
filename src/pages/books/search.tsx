import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import BookCardWithAction from '~/components/Book/BookCardWithAction'
import BooksSection from '~/components/BooksSection'
import BooksSectionLoader from '~/components/BooksSectionLoader'
import ShouldRender from '~/components/ShouldRender'
import StateWrapper from '~/components/StateWrapper'
import useIntersectionObserver from '~/hooks/useIntersectionObserver'
import MainLayout from '~/layouts/MainLayout'
import { api } from '~/utils/api'

export type SearchPageQuery = {
    query: string
}

const Search = () => {
    const router = useRouter()

    const bottomRef = useRef<HTMLDivElement | null>(null)

    const entry = useIntersectionObserver(bottomRef, {
        threshold: 1,
    })

    const isVisible = !!entry?.isIntersecting

    const bookQuery = useMemo(() => {
        if (router.isReady) {
            if (typeof router.query.query !== 'string') {
                return ''
            }
            return router.query.query as string
        }
        return ''
    }, [router])

    const {
        data,
        isFetchingNextPage,
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage,
    } = api.book.booksPagination.useInfiniteQuery(
        {
            query: bookQuery,
            itemsPerPage: 3,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    )

    useEffect(() => {
        if (isVisible && hasNextPage) {
            fetchNextPage()
        }
    }, [isVisible])

    const booksToShow = useMemo(() => {
        return data?.pages.flatMap((page) => page.books)
    }, [data])

    return (
        <MainLayout>
            <StateWrapper
                data={booksToShow}
                isError={isError}
                isLoading={isLoading}
                NonEmpty={(books) => (
                    <div className="max-w-base mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
                            {books.map((book) => (
                                <BookCardWithAction
                                    key={book.id.toString()}
                                    id={book.id}
                                    title={book.title}
                                    price={book.price}
                                    authors={book.authors}
                                    coverImageUrl={book.coverImageUrl}
                                />
                            ))}
                        </div>
                        <ShouldRender if={isFetchingNextPage}>
                            <BooksSectionLoader />
                        </ShouldRender>
                        <ShouldRender if={!hasNextPage}>
                            <div className="w-full bg-green-500/20 text-center p-3 rounded-lg font-semibold">
                                No more books
                            </div>
                        </ShouldRender>
                        <div ref={bottomRef} />
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default Search
