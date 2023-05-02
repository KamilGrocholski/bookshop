import { useState } from 'react'
import Link from 'next/link'
import {
    useForm,
    Controller,
    type SubmitHandler,
    type SubmitErrorHandler,
} from 'react-hook-form'
import { type z } from 'zod'
import { BsFillCheckCircleFill } from 'react-icons/bs'

import { makeOrderSchema } from '~/server/api/routers/order'
import { api } from '~/utils/api'
import TextInput from '../TextInput'
import Button from '../Button'
import { COUNTRIES } from '~/schemes/base/orderBase.scheme'

const MakeOrderForm = () => {
    const [isPaid, setIsPaid] = useState<boolean>(false)

    const makeOrderMutation = api.order.make.useMutation({
        onSuccess() {
            setIsPaid(true)
        },
        onError() {},
    })

    const onValid: SubmitHandler<z.output<typeof makeOrderSchema>> = async (
        data,
        e,
    ) => {
        e?.preventDefault()
        console.log(data)
        await makeOrderMutation.mutateAsync(data)
    }

    const onError: SubmitErrorHandler<z.output<typeof makeOrderSchema>> = (
        data,
        e,
    ) => {
        e?.preventDefault()
        console.error(data)
    }

    const { control, register, handleSubmit } = useForm<
        z.input<typeof makeOrderSchema>
    >({})

    return (
        <div className="border p-5 min-w-[30vw]">
            {isPaid ? (
                <div className="flex justify-center flex-col items-center gap-5">
                    <div className="text-3xl flex flex-row gap-2 items-center">
                        <BsFillCheckCircleFill className="text-green-500" />
                        <span>Success</span>
                    </div>
                    <div>
                        <Button>
                            <Link href="/">Continue shopping</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onValid, onError)}
                    className="flex flex-col gap-2"
                >
                    <TextInput label="Name" {...register('person.name')} />
                    <TextInput
                        label="Surname"
                        {...register('person.surname')}
                    />
                    <TextInput
                        label="Address e-mail"
                        {...register('person.email')}
                    />
                    <TextInput
                        label="Phone number"
                        {...register('person.phone')}
                    />

                    <TextInput label="City" {...register('address.city')} />
                    <TextInput label="Street" {...register('address.street')} />
                    <TextInput label="State" {...register('address.state')} />
                    <TextInput label="Zip code" {...register('address.zip')} />

                    <Controller
                        render={({ field }) => (
                            <fieldset className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500">
                                    Country
                                </label>
                                <select
                                    className="text-gray-500"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {COUNTRIES.map((country) => (
                                        <option key={country}>{country}</option>
                                    ))}
                                </select>
                            </fieldset>
                        )}
                        name="address.country"
                        control={control}
                        defaultValue={COUNTRIES[0]}
                    />

                    <Button type="submit" className="mt-8 w-full">
                        Confirm
                    </Button>
                </form>
            )}
        </div>
    )
}

export default MakeOrderForm
