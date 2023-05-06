import {
    useForm,
    type SubmitHandler,
    type SubmitErrorHandler,
    type Resolver,
} from 'react-hook-form'
import { z } from 'zod'

import TextInput from '~/components/TextInput'
import { subscribeSchema } from '~/server/api/routers/newsletter'
import Button from '~/components/Button'
import { api } from '~/utils/api'

const NewsletterSubcriptionForm = () => {
    const { mutate, isLoading } = api.newsletter.subscribe.useMutation({
        onSuccess() {
            console.log('success')
        },
        onError() {
            console.log('errror')
        },
    })
    const resolver: Resolver<z.input<typeof subscribeSchema>> = ({ email }) => {
        return {
            values: {
                email,
            },
            errors: {
                email: {},
            },
        }
    }

    const { register, handleSubmit } = useForm<z.input<typeof subscribeSchema>>(
        {
            resolver: resolver,
        },
    )

    const onValid: SubmitHandler<z.input<typeof subscribeSchema>> = (
        data,
        e,
    ) => {
        e?.preventDefault()
        mutate({
            email: data.email,
        })
    }

    const onError: SubmitErrorHandler<z.input<typeof subscribeSchema>> = (
        data,
        e,
    ) => {
        e?.preventDefault()
    }

    return (
        <div className="absolute -top-16 w-full left-0 right-0">
            <div className="container mx-auto flex flex-col gap-2 bg-purple-700 px-5 py-5 shadow-xl">
                <h1>Newsletter</h1>
                <p className="text-white">
                    Sign up to get out newsletters about new books and new
                    features!
                </p>
                <form
                    onSubmit={handleSubmit(onValid, onError)}
                    className="flex md:flex-row flex-col items-center gap-5"
                >
                    <TextInput
                        inputClassName="p-2 rounded-lg text-lg min-w-[300px]"
                        placeholder="Address e-mail"
                        {...register('email')}
                    />
                    <Button disabled={isLoading} type="submit">
                        Subscribe
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default NewsletterSubcriptionForm
