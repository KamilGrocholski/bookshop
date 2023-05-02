import { useRouter } from 'next/router'

import MainLayout from '~/layouts/MainLayout'

const PaymentPage = () => {
    const router = useRouter()
    const orderId = router.query.orderId as string

    return <MainLayout></MainLayout>
}

export default PaymentPage
