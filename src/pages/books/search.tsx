import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import BooksListing from '~/components/BooksListing'
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
            itemsPerPage: 15,
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
        return data?.pages.flatMap((page) => page.books) ?? []
    }, [data?.pages])

    return (
        <MainLayout>
            <StateWrapper
                data={booksToShow}
                isError={isError}
                isLoading={isLoading}
                NonEmpty={(books) => (
                    <div className="mx-auto flex flex-col gap-8">
                        <div className="flex flex-row items-center gap-3 text-3xl">
                            <span className="font-semibold">Results for:</span>
                            <span className="italic">{bookQuery}</span>
                        </div>
                        <BooksListing books={books} />
                        <ShouldRender if={isFetchingNextPage}>
                            <BooksSectionLoader />
                        </ShouldRender>
                        <ShouldRender if={!hasNextPage}>
                            <div className="mt-12 w-full bg-green-500/20 text-center p-3 rounded-lg font-semibold">
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
