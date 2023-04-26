import { Author } from '@prisma/client'
import { createServerSideHelpers } from '@trpc/react-query/server'
import {
    GetStaticPaths,
    GetStaticPropsContext,
    InferGetStaticPropsType,
} from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import SuperJSON from 'superjson'
import BookCardWithAction from '~/components/Book/BookCardWithAction'
import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { prisma } from '~/server/db'
import { api } from '~/utils/api'
import getSecondsFrom from '~/utils/getSecondsFrom'

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

    await helpers.author.getOneById.prefetch({ authorId: id })

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
            authors: {
                select: {
                    id: true,
                },
            },
        },
    })

    const authorsIds: Author['id'][] = []

    books.forEach((book) => {
        const ids = book.authors.map((author) => author.id)
        authorsIds.push(...ids)
    })

    const authorsIdsSet = new Set<bigint>(authorsIds)

    const paths: { params: { id: string } }[] = new Array(authorsIdsSet.size)
    let index = 0

    authorsIdsSet.forEach((id) => {
        paths[index] = {
            params: {
                id: id.toString(),
            },
        }

        index++
    })

    return {
        paths,
        fallback: 'blocking',
    }
}

export default function AuthorPage(
    props: InferGetStaticPropsType<typeof getStaticProps>,
) {
    const router = useRouter()

    const id = router.query.id as string

    const authorQuery = api.author.getOneById.useQuery({
        authorId: id,
    })

    return (
        <MainLayout>
            <StateWrapper
                data={authorQuery.data}
                isLoading={authorQuery.isLoading}
                isError={authorQuery.isError}
                NonEmpty={(author) => (
                    <div className="flex flex-col gap-12 mx-auto">
                        <div className="flex flex-col ">
                            <h1>{author.name}</h1>
                            <figure>
                                <Image
                                    width={350}
                                    height={300}
                                    src={author.imageUrl ?? ''}
                                    alt={author.name}
                                />
                            </figure>
                        </div>
                        <section>
                            <h2>About</h2>
                            <p>{author.description}</p>
                        </section>
                        <section>
                            <h2>Titles</h2>
                            <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                                {author.books.map((book) => (
                                    <BookCardWithAction
                                        {...book}
                                        key={book.id.toString()}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            />
        </MainLayout>
    )
}
