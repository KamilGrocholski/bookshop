import { InputHTMLAttributes, forwardRef } from 'react'
import ShouldRender from './ShouldRender'

export type TextInputProps = {
    label?: string
    id?: string
} & InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const { label, id, ...rest } = props

    return (
        <fieldset className="flex flex-col gap-1">
            <ShouldRender if={!!label}>
                <label className="text-xs text-gray-500" htmlFor={id}>
                    {label}
                </label>
            </ShouldRender>
            <input
                name={id}
                className="border boder-black"
                type="text"
                ref={ref}
                {...rest}
            />
        </fieldset>
    )
})

export default TextInput
