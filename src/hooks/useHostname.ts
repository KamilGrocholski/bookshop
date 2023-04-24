import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSsr from './useSsr'

export default function useHostname() {
    const [hostname, setHostname] = useState<string | undefined>()

    const { isBrowser } = useSsr()

    const router = useRouter()

    useEffect(() => {
        if (isBrowser) {
            setHostname(window.location.hostname)
        }
    }, [router.pathname])

    return { hostname }
}
