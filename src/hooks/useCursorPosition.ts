import { useCallback, useState } from 'react'

import useEventListener from './useEventListener'

export default function useCursorPosition() {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    })

    const handleMouseMove = useCallback((event: MouseEvent) => {
        setPosition({
            x: event.clientX,
            y: event.clientY,
        })
    }, [])

    useEventListener('mousemove', handleMouseMove)

    return position
}
