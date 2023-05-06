import { useMemo } from 'react'

import clsx from 'clsx'

import ShouldRender from './ShouldRender'

export type PaginationProps = {
    totalPages: number
    currentPageIndex: number
    goTo(page: number): void
    numberOfSideButtons?: number
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPageIndex,
    goTo,
    numberOfSideButtons = 3,
}) => {
    const pagesNumbersArray = useMemo(() => {
        const currentPageNumber = currentPageIndex + 1

        const lowDiff = currentPageNumber - numberOfSideButtons
        const low = lowDiff < 1 ? 1 : lowDiff
        const highDiff = currentPageNumber + numberOfSideButtons
        const high = highDiff > totalPages ? totalPages : highDiff

        const array = new Array(high - low + 1)

        for (let i = low; i <= high; ++i) {
            array[i] = i
        }

        return array
    }, [currentPageIndex, totalPages, numberOfSideButtons])

    return (
        <div className="flex flex-row items-center gap-1">
            <PaginationButton
                onClick={() => {
                    goTo(0)
                }}
                isActive={currentPageIndex === 0}
            >{`<<`}</PaginationButton>

            {pagesNumbersArray.map((pageNumber) => {
                const pageIndex = pageNumber - 1

                return (
                    <PaginationButton
                        key={pageNumber}
                        onClick={() => goTo(pageIndex)}
                        isActive={currentPageIndex === pageIndex}
                    >
                        {pageNumber}
                    </PaginationButton>
                )
            })}

            <ShouldRender
                if={
                    pagesNumbersArray[pagesNumbersArray.length - 1] !==
                    totalPages
                }
            >
                <ShouldRender
                    if={
                        pagesNumbersArray[pagesNumbersArray.length - 1] !==
                        totalPages - 1
                    }
                >
                    <span>...</span>
                </ShouldRender>
                <PaginationButton
                    isActive={currentPageIndex === totalPages - 1}
                    onClick={() => goTo(totalPages - 1)}
                >
                    {totalPages}
                </PaginationButton>
            </ShouldRender>

            <PaginationButton
                isActive={currentPageIndex === totalPages - 1}
                onClick={() => goTo(totalPages - 1)}
            >{`>>`}</PaginationButton>
        </div>
    )
}

const PaginationButton: React.FC<{
    onClick: () => void
    isActive: boolean
    children: React.ReactNode
}> = ({ onClick, children, isActive }) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'px-3 py-2 rounded-lg border font-semibold',
                isActive && 'bg-red-500',
                'border-red-500',
            )}
        >
            {children}
        </button>
    )
}

export default Pagination
