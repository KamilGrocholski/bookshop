import { PrismaClient } from '@prisma/client'

import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'

dotenv.config()

function getNumberOfArrays(quantity, min, max) {
    const numbers = new Array(quantity)

    for (let i = 0; i < quantity; ++i) {
        numbers[i] = faker.datatype.number({ min, max })
    }

    return numbers
}

async function seedDatabase() {
    let client

    const DATABASE_URL = process.env.DATABASE_URL
    console.log(DATABASE_URL)

    client = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })

    await client.$connect()

    const isSeeded = (await client.book.count()) > 0

    if (isSeeded) {
        console.log('Already seeded')
        client.$disconnect()
        return
    }

    const authors = await seedAuthors(client, 10)
    const publishers = await seedPublishers(client, 10)
    const books = await seedBooks(client, 30, authors, publishers)
}

async function seedAuthors(client, quantity) {
    const records = [
        ...Array.from({ length: quantity }).map((value, index) => {
            const id = index + 1
            const name = faker.name.fullName()
            const description = faker.lorem.paragraph()
            const imageUrl = faker.image.abstract()

            return {
                id,
                name,
                description,
                imageUrl,
            }
        }),
    ]

    console.log(records)
    const result = await client.author.createMany({
        data: records,
        skipDuplicates: true,
    })

    if (result) {
        console.log(`Authors: ${result.count}`)
    }

    return records
}

async function seedPublishers(client, quantity) {
    const records = [
        ...Array.from({ length: quantity }).map((value, index) => {
            const id = index + 1

            const name = faker.name.jobDescriptor()

            return {
                id,
                name,
            }
        }),
    ]

    const result = await client.publisher.createMany({
        data: records,
        skipDuplicates: true,
    })

    if (result) {
        console.log(`Publishers: ${result.count}`)
    }

    return records
}

async function seedBooks(client, quantity, authors, publishers) {
    const records = [
        ...Array.from({ length: quantity }).map((value, index) => {
            const id = index + 1

            const title = faker.music.songName()
            const description = faker.lorem.paragraph()
            const price = faker.datatype.number({
                min: 0,
                max: 255,
                precision: 0.01,
            })
            const pages = faker.datatype.number({ min: 0, max: 1500 })
            const stock = faker.datatype.number({ min: 0, max: 1000 })
            const publishedAt = faker.date.between(
                '2000-01-01T00:00:00.000Z',
                Date.now().toString(),
            )
            const coverImageUrl = faker.image.abstract()

            const authorsIds = getNumberOfArrays(
                faker.datatype.number({ min: 1, max: 3 }),
                1,
                authors.length,
            )

            const categories = Array.from({ length: 3 }).map(() =>
                faker.music.genre(),
            )

            const publisherId = faker.datatype.number({
                min: 1,
                max: publishers.length,
            })

            return {
                id,
                title,
                description,
                price,
                stock,
                pages,
                publishedAt,
                coverImageUrl,
                publisherId,
                authorsIds,
                categories,
            }
        }),
    ]

    const result = await Promise.all(
        records.map(async (b) => {
            const bookResult = await client.book.create({
                data: {
                    id: b.id,
                    title: b.title,
                    description: b.description,
                    price: b.price,
                    stock: b.stock,
                    pages: b.pages,
                    publishedAt: b.publishedAt,
                    coverImageUrl: b.coverImageUrl,
                    authors: {
                        connect: b.authorsIds.map((a) => ({ id: a })),
                    },
                    categories: {
                        connectOrCreate: b.categories.map((c) => {
                            return {
                                where: {
                                    name: c,
                                },
                                create: {
                                    name: c,
                                },
                            }
                        }),
                    },
                    publisher: {
                        connect: {
                            id: b.publisherId,
                        },
                    },
                },
            })
        }),
    )

    return records
}

;(async () => {
    try {
        console.log('start')
        await seedDatabase()
        console.log('end')
    } catch (error) {
        console.error(error)
    }
})()
