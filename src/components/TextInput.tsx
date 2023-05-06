import { type InputHTMLAttributes, forwardRef } from 'react'

import clsx from 'clsx'

import ShouldRender from './ShouldRender'

export type TextInputProps = {
    label?: string
    id?: string
    inputClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const { label, id, inputClassName, ...rest } = props

    return (
        <fieldset className="flex flex-col gap-1">
            <ShouldRender if={!!label}>
                <label className="text-xs text-gray-500" htmlFor={id}>
                    {label}
                </label>
            </ShouldRender>
            <input
                id={id}
                className={clsx('border border-gray-100 px-2', inputClassName)}
                type="text"
                {...rest}
                ref={ref}
            />
        </fieldset>
    )
})

export default TextInput
