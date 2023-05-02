import { InputHTMLAttributes, forwardRef } from 'react'

export type TextInputProps = {} & InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const { ...rest } = props

    return (
        <fieldset className="">
            <input
                className="border boder-black"
                type="text"
                ref={ref}
                {...rest}
            />
        </fieldset>
    )
})

export default TextInput
