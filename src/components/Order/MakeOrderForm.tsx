import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'

import { makeOrderSchema } from '~/server/api/routers/order'
import { api } from '~/utils/api'
import TextInput from '../TextInput'
import { useRouter } from 'next/router'
import Button from '../Button'

export const COUNTRIES = ['Poland', 'Germany', 'Finland', 'USA'] as const

const MakeOrderForm = () => {
    const router = useRouter()

    const makeOrderMutation = api.order.make.useMutation({
        onSuccess(data) {
            router.push(`/order/${data.id}`)
        },
    })

    const { control, register, handleSubmit } = useForm<
        z.input<typeof makeOrderSchema>
    >({
        resolver: zodResolver(makeOrderSchema),
    })

    return (
        <form>
            <TextInput {...register('person.name')} />
            <TextInput {...register('person.surname')} />
            <TextInput {...register('person.email')} />
            <TextInput {...register('person.phone')} />

            <TextInput {...register('address.city')} />
            <TextInput {...register('address.street')} />
            <TextInput {...register('address.state')} />
            <TextInput {...register('address.zip')} />

            <Controller
                render={({ field }) => (
                    <select value={field.value} onChange={field.onChange}>
                        {COUNTRIES.map((country) => (
                            <option key={country}>{country}</option>
                        ))}
                    </select>
                )}
                name="address.country"
                control={control}
            />

            <Button type="submit">Confirm</Button>
        </form>
    )
}

export default MakeOrderForm
