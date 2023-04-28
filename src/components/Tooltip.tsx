import { forwardRef } from 'react'

export type TooltipProps = {
    children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) => {
    const { children, ...rest } = props

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    )
})

export default Tooltip
