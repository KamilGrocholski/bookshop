import {
    type GetStaticPaths,
    type GetStaticPropsContext,
    type InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { type Book } from '@prisma/client'
import { createServerSideHelpers } from '@trpc/react-query/server'
import clsx from 'clsx'
import SuperJSON from 'superjson'

import Button from '~/components/Button'
import StateWrapper from '~/components/StateWrapper'
import useCart from '~/hooks/useCart'
import MainLayout from '~/layouts/MainLayout'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { api } from '~/utils/api'
import getSecondsFrom from '~/utils/getSecondsFrom'
import formatPrice from '~/utils/formatPrice'

// 3 hour in seconds
export const revalidate = 60 * 60 * 3
export const take = 1000
export const lastDays = 7

export async function getStaticProps(
    context: GetStaticPropsContext<{ id: string }>,
) {
    const id = context.params?.id as string

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({
            session: null,
        }),
        transformer: SuperJSON,
    })

    await helpers.book.getOneById.prefetch({
        id,
    })

    return {
        props: {
            trpcState: helpers.dehydrate(),
        },
        revalidate,
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const since = new Date(
        Date.now() - getSecondsFrom({ unit: 'DAY', value: lastDays }),
    )

    const books = await prisma.book.findMany({
        take,
        where: {
            orderItems: {
                some: {
                    order: {
                        createdAt: {
                            gte: since,
                        },
                    },
                },
            },
        },
        orderBy: {
            orderItems: {
                _count: 'desc',
            },
        },
        select: {
            id: true,
        },
    })

    return {
        paths: books.map((book) => ({
            params: {
                id: book.id.toString(),
            },
        })),
        fallback: 'blocking',
    }
}

export default function BookPage(
    props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const router = useRouter()

    const id = router.query.id as string

    const bookQuery = api.book.getOneById.useQuery({
        id,
    })

    return (
        <MainLayout>
            <StateWrapper
                data={bookQuery.data}
                isLoading={bookQuery.isLoading}
                isError={bookQuery.isError}
                Error={
                    <div className="flex flex-col gap-1 items-center">
                        <p>An error has occured.</p>
                        <p>
                            <button
                                className="p-2 bg-green-500 rounded-lg"
                                onClick={() => router.replace(router.asPath)}
                            >
                                Try again.
                            </button>
                        </p>
                    </div>
                }
                Empty={
                    <div className="flex flex-col gap-1 items-center">
                        <p>A book with such id does not exist.</p>
                        <p>
                            <Link className="underline" href="/">
                                Click here
                            </Link>
                            , to find what you want.
                        </p>
                    </div>
                }
                NonEmpty={(book) => (
                    <>
                        <Head>
                            <title>{book.title}</title>
                            <meta
                                name="description"
                                content={book.description}
                            />
                            <meta property="og:type" content="book" />
                            <meta property="og:title" content={book.title} />
                            <meta
                                property="og:description"
                                content={book.description}
                            />
                            <meta
                                property="og:image"
                                content={book.coverImageUrl}
                            />
                            <meta
                                property="og:image:alt"
                                content={book.title}
                            />
                            <meta property="twitter:card" content="summary" />
                            <meta
                                property="twitter:title"
                                content={book.title}
                            />
                            <meta
                                property="twitter:description"
                                content={book.description}
                            />
                            <meta
                                property="twitter:image"
                                content={book.coverImageUrl}
                            />
                            <meta
                                property="twitter:image:alt"
                                content={book.title}
                            />
                            <meta
                                property="twitter:card:alt"
                                content="Book cover"
                            />
                        </Head>
                        <div className="grid grid-cols-1 mx-auto lg:grid-cols-3 gap-8">
                            <div className="col-span-1">
                                <Image
                                    width={300}
                                    height={400}
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    className="h-auto w-auto"
                                />
                            </div>
                            <div className="col-span-2 flex flex-col gap-12">
                                <div>
                                    <h1>{book.title}</h1>
                                    <ul className="flex flex-col gap-1">
                                        {book.authors.map((author) => (
                                            <li key={author.id.toString()}>
                                                <Link
                                                    href={`/authors/${author.id}`}
                                                    className="underline"
                                                >
                                                    {author.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <BookForm
                                        book={{
                                            stock: book.stock,
                                            title: book.title,
                                            id: book.id,
                                            coverImageUrl: book.coverImageUrl,
                                        }}
                                    />
                                </div>
                                <section>
                                    <h2>Categories</h2>
                                    <ul className="text-gray-500 text-lg">
                                        {book.categories.map((category) => (
                                            <li key={category.id.toString()}>
                                                {category.name}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h2>Description</h2>
                                    <p>{book.description}</p>
                                </section>
                                <section>
                                    <h2>Details</h2>
                                    <Details
                                        pairs={{
                                            Price: formatPrice(book.price),
                                            Publisher: book.publisher.name,
                                            'Publish date': book.publishedAt
                                                .toISOString()
                                                .slice(0, 10),
                                            Pages: book.pages,
                                        }}
                                    />
                                </section>
                            </div>
                        </div>
                    </>
                )}
            />
        </MainLayout>
    )
}

const Details: React.FC<{ pairs: Record<string, string | number> }> = ({
    pairs,
}) => {
    return (
        <ul className="flex flex-col gap-1 justify-start w-fit">
            {Object.entries(pairs).map(([key, value]) => (
                <li key={key}>
                    <p className="grid grid-cols-2">
                        <span className="text-end mr-2 italic">{key}</span>
                        <span className="text-start">{value}</span>
                    </p>
                </li>
            ))}
        </ul>
    )
}

const BookForm: React.FC<{
    book: Pick<Book, 'id' | 'title' | 'coverImageUrl' | 'stock'>
}> = ({ book: { stock, id, title, coverImageUrl } }) => {
    const { add } = useCart()
    const availabilityMessage = stock > 0 ? 'available' : 'not available'

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                add(id)
            }}
        >
            <div
                className={clsx(
                    'uppercase font-semibold',
                    stock > 0 ? 'text-teal-500' : 'text-red-500',
                )}
            >
                {availabilityMessage}
            </div>
            <div className="flex gap-3">
                <Button size="lg" type="submit">
                    Add to cart
                </Button>
            </div>
        </form>
    )
}
