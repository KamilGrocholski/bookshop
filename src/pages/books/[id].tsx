import { useRouter } from 'next/router'
import StateWrapper from '~/components/StateWrapper'
import MainLayout from '~/layouts/MainLayout'
import { api } from '~/utils/api'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { cartAtom } from '~/atoms'
import { useMemo } from 'react'
import { Book } from '@prisma/client'
import Button from '~/components/Button'

const BookPage = () => {
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
                        <div className="grid grid-cols-1 mx-auto lg:grid-cols-3 gap-8 max-w-base">
                            <div className="col-span-1">
                                <Image
                                    width={250}
                                    height={250}
                                    src={book.coverImageUrl}
                                    alt={book.title}
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
                                    <h2>Description</h2>
                                    <p>{book.description}</p>
                                </section>
                                <section>
                                    <h2>Details</h2>
                                    <Details
                                        pairs={{
                                            Price: `${book.price} $`,
                                            Publisher: book.publisher.name,
                                            PublishDate: book.publishedAt
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
                        <span className="text-end mr-2">{key}</span>
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
    const [cart, setCart] = useAtom(cartAtom)

    const isItemInCart = useMemo(() => {
        return cart.items.find((item) => item.book.id === id)
    }, [cart])

    const handleAddToCart = (e: React.FormEvent) => {
        e.preventDefault()

        if (isItemInCart) {
            return
        }

        setCart((prev) => {
            const newCart = {
                items: [
                    ...prev.items,
                    {
                        book: {
                            id,
                            title,
                            coverImageUrl,
                        },
                        quantity: 1,
                    },
                ],
            }

            return newCart
        })
    }

    return (
        <form onSubmit={handleAddToCart}>
            <div
                className={clsx(
                    'uppercase font-semibold',
                    stock > 0 ? 'text-teal-500' : 'text-red-500',
                )}
            >
                {stock > 0 ? 'available' : 'not available'}
            </div>
            <div className="flex gap-3">
                <Button type="submit">Add to cart</Button>
                <Button variant="secondary">Add to whishlist</Button>
            </div>
        </form>
    )
}

export default BookPage
