import { useState } from 'react'

import useCursorPosition from './useCursorPosition'
import useWindowSize from './useWindowSize'
import useElementSize from './useElementSize'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export default function useKeepElementInView() {
    const [elementSizeRef, elementSize] = useElementSize()

    const [elementPosition, setElementPosition] = useState({
        x: 0,
        y: 0,
    })

    const cursorPosition = useCursorPosition()

    const windowSize = useWindowSize()

    useIsomorphicLayoutEffect(() => {
        let x = cursorPosition.x + 10
        let y = cursorPosition.y + 10

        if (x + elementSize.width > windowSize.width) {
            x = windowSize.width - elementSize.width - 10
        }

        if (y + elementSize.height > windowSize.height) {
            y = windowSize.height - elementSize.height - 10
        }

        setElementPosition({
            x,
            y,
        })
    }, [elementSizeRef, cursorPosition])

    return [elementSizeRef, elementPosition]
}

import { useEffect, useRef, useCallback } from 'react'

interface TooltipPosition {
    x: number
    y: number
}

export function useTooltipPosition(): [
    TooltipPosition,
    React.RefObject<HTMLDivElement>,
] {
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
        x: 0,
        y: 0,
    })
    const tooltipRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = useCallback((event: MouseEvent) => {
        const tooltipWidth = tooltipRef.current?.offsetWidth ?? 0
        const tooltipHeight = tooltipRef.current?.offsetHeight ?? 0
        const pageWidth = window.innerWidth
        const pageHeight = window.innerHeight

        let x = event.clientX + 10
        let y = event.clientY + 10

        if (x + tooltipWidth > pageWidth) {
            x = pageWidth - tooltipWidth - 10
        }

        if (y + tooltipHeight > pageHeight) {
            y = pageHeight - tooltipHeight - 10
        }

        tooltipRef.current!.style.left = x + 'px'
        tooltipRef.current!.style.top = y + 'px'
    }, [])

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [handleMouseMove])

    return [tooltipPosition, tooltipRef]
}
