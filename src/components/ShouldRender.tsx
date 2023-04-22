type ShouldRenderProps = {
    if: boolean
    children: React.ReactNode
}

const ShouldRender: React.FC<ShouldRenderProps> = ({
    if: condition,
    children,
}) => {
    return <>{condition ? children : null}</>
}

export default ShouldRender
