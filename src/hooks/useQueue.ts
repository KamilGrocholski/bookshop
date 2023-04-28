import { useCallback, useState } from 'react'

export default function useQueue<T>() {
    const [queue, setQueue] = useState<T[]>([])

    const enqueue = useCallback((value: T) => {
        setQueue((prev) => {
            return [...prev, value]
        })
    }, [])

    const dequeue = useCallback(() => {
        const removedValue = queue.pop()

        if (!removedValue) {
            return
        }

        setQueue((prev) => {
            return [...prev]
        })

        return removedValue
    }, [])

    const clear = useCallback(() => {
        setQueue([])
    }, [])

    return {
        queue,
        enqueue,
        dequeue,
        clear,
    }
}
