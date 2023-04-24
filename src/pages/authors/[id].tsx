import { useRouter } from 'next/router'
import React from 'react'
import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { api } from '~/utils/api'
import Image from 'next/image'
import BookCardWithAction from '~/components/Book/BookCardWithAction'

const AuthorPage = () => {
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
                    <div className="flex flex-col gap-1 prose mx-auto">
                        <h1>{author.name}</h1>
                        <div>
                            <Image
                                width={350}
                                height={300}
                                src={author.imageUrl ?? ''}
                                alt={author.name}
                            />
                        </div>
                        <section>
                            <h2>About</h2>
                            <p>{author.description}</p>
                        </section>
                        <section>
                            <h2>Titles</h2>
                            <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
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

export default AuthorPage
