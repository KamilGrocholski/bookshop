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
    const categories = await seedCategories(client, 10)
    const publishers = await seedPublishers(client, 10)
    const books = await seedBooks(client, 30, authors, categories, publishers)
}

async function seedAuthors(client, quantity) {
    const records = [
        ...Array(quantity).map((value, index) => {
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

    const result = await client.author.createMany({
        data: records,
        skipDuplicates: true,
    })

    if (result) {
        console.log(`Authors: ${result.count}`)
    }

    return records
}

async function seedCategories(client, quantity) {
    const records = [
        ...Array(quantity).map((value, index) => {
            const id = index + 1
            const name = faker.music.genre()

            return {
                id,
                name,
            }
        }),
    ]

    const result = await client.category.createMany({
        data: records,
        skipDuplicates: true,
    })

    if (result) {
        console.log(`Categories: ${result.count}`)
    }

    return records
}

async function seedPublishers(client, quantity) {
    const records = [
        ...Array(quantity).map((value, index) => {
            const id = index + 1

            const name = faker.name.jobDescriptor()

            return {
                id,
                name,
            }
        }),
    ]
}

async function seedBooks(client, quantity, authors, categories, publishers) {
    const records = [
        ...Array(quantity).map((value, index) => {
            const id = index + 1

            const title = faker.music.songName()
            const description = faker.lorem.paragraph()
            const price = faker.datatype.number({
                min: 0,
                max: 255,
                precision: 0.01,
            })
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

            const categoriesIds = getNumberOfArrays(
                faker.datatype.number({ min: 1, max: 5 }),
                1,
                categories.length,
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
                publishedAt,
                coverImageUrl,
                authorId: {
                    connect: authorsIds,
                },
                categoryId: {
                    connect: categoriesIds,
                },
                publisherId,
            }
        }),
    ]

    const result = await client.book.createMany({
        data: records,
        skipDuplicates: true,
    })

    if (result) {
        console.log(`Authors: ${result.count}`)
    }

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
