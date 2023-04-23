import Head from 'next/head'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminDashboardLayout from '~/layouts/AdminDashboardLayout'
import { addBookSchema } from '~/server/api/routers/books'
import { api } from '~/utils/api'

const Library = () => {
    const addBooksMutation = api.book.addBooks.useMutation()

    return (
        <>
            <Head>
                <title>Admin dashboard</title>
            </Head>
            <AdminDashboardLayout>
                <div></div>
            </AdminDashboardLayout>
        </>
    )

}
const exampleBooks =  

const AddBookForm = () => {
    const { register, handleSubmit } = useForm<z.input<typeof addBookSchema>>({
        resolver: zodResolver(addBookSchema),
    })

    const onValid: SubmitHandler<z.input<typeof addBookSchema>> = (data, e) => {
        e?.preventDefault()
        console.log(data)
    }

    const onError: SubmitErrorHandler<z.input<typeof addBookSchema>> = (
        data,
        e,
    ) => {
        e?.preventDefault()
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onValid, onError)}>
            <input {...register('title')} />
            <input {...register('format')} />
            <input type='date' {...register('publishedAt', {
      })} />
            <input type='number' {...register('pages'), {
        min: 0
      }} />
            <input {...register('coverImageUrl')} />
            <input {...register('price'), {
        
      }} />
            <input {...register('title')} />
        </form>
    )
}

export default Library
