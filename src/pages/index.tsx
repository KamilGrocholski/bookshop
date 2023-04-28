import { createServerSideHelpers } from '@trpc/react-query/server'
import { type GetStaticPropsContext, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import SuperJSON from 'superjson'
import BooksListing from '~/components/BooksListing'
import BooksSectionLoader from '~/components/BooksSectionLoader'
import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { api } from '~/utils/api'

// 1 hour in seconds
export const revalidate = 60 * 60
export const take = 15
export const lastDays = 7

export async function getStaticProps(context: GetStaticPropsContext) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({
            session: null,
        }),
        transformer: SuperJSON,
    })

    await helpers.book.getBestSellers.prefetch({
        take,
        lastDays,
    })

    return {
        props: {
            trpcState: helpers.dehydrate(),
        },
        revalidate,
    }
}

export default function HomePage(
    props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const bestSellersQuery = api.book.getBestSellers.useQuery({
        take,
        lastDays,
    })

    // const recentlyAddedQuery = api.book.getRecentlyAdded.useQuery({
    //     take: 15,
    // })

    return (
        <>
            <Head>
                <title>Bookshop</title>
                <meta name="description" content="Buy any books." />
            </Head>
            <MainLayout>
                <StateWrapper
                    data={bestSellersQuery.data}
                    isLoading={bestSellersQuery.isLoading}
                    isError={bestSellersQuery.isError}
                    Loading={<BooksSectionLoader />}
                    Empty={
                        <div>Currently there are no books in the store.</div>
                    }
                    Error={
                        <div>
                            Something went wrong and we could not get the best
                            sellers list.
                        </div>
                    }
                    NonEmpty={(books) => (
                        <section>
                            <h2>Bestsellers</h2>
                            <BooksListing books={books} />
                        </section>
                    )}
                />
            </MainLayout>
        </>
    )
}
