import clsx from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
    icon?: React.ReactNode
    variant?: keyof typeof VARIANT
    size?: keyof typeof SIZE
    shape?: keyof typeof SHAPE
    disabled?: boolean
    isLoading?: boolean
    className?: string
    tooltip?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        variant = 'primary',
        size = 'base',
        shape = 'rounded',
        children,
        isLoading,
        disabled,
        icon,
        className,
        type,
        tooltip,
        ...rest
    } = props

    return (
        <button
            ref={ref}
            type={type ?? 'button'}
            disabled={disabled || isLoading}
            aria-disabled={disabled || isLoading}
            className={clsx(
                (disabled || isLoading) && 'opacity-50',
                SIZE[size],
                VARIANT[variant],
                SHAPE[shape],
                'transition-all delay-50 easy-in-out flex items-center justify-center group',
                className,
            )}
            {...rest}
        >
            {isLoading ? (
                <div className="h-5 w-5 border-4 border-dashed rounded-full flex items-center animate-spin border-white"></div>
            ) : (
                <span
                    className={clsx(
                        icon && 'gap-3',
                        'flex items-center flex-row',
                    )}
                >
                    {icon ? <span>{icon}</span> : null}
                    <span>{children}</span>
                </span>
            )}
        </button>
    )
})

const SHAPE = {
    square: '',
    rounded: 'rounded-3xl',
} as const

const VARIANT = {
    primary:
        'text-white hover:text-red-500 bg-red-500 border hover:border-red-500 hover:bg-transparent',
    secondary:
        'bg-green-500 border hover:border-green-500 hover:bg-transparent',
} as const

const SIZE = {
    sm: 'px-2 py-1 text-sm',
    base: 'px-3 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
} as const

export default Button
