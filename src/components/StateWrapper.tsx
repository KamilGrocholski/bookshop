export type StateWrapperProps<T> = {
    data: T
    isLoading: boolean
    isError?: boolean
    isEmpty?: boolean
    Error?: React.ReactElement
    Empty?: React.ReactElement
    Loading?: React.ReactElement
    NonEmpty: (data: NonNullable<T>) => React.ReactElement
}

function StateWrapper<T>({
    data,
    isLoading,
    isError,
    isEmpty,
    Error = DefaultError,
    Empty = DefaultEmpty,
    Loading = DefaultLoading,
    NonEmpty,
}: StateWrapperProps<T>) {
    if (isLoading) {
        return Loading
    }

    if (isError) {
        return Error
    }

    if (isEmpty) {
        return Empty
    }

    if (data === null || data === undefined) {
        return Empty
    }

    if (Array.isArray(data) && data.length === 0) {
        return Empty
    }

    return NonEmpty(data)
}

const DefaultError = <div>Error</div>
const DefaultLoading = <div>Loading</div>
const DefaultEmpty = <div>Empty</div>

export default StateWrapper
