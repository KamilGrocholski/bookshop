import Link from 'next/link'
import { forwardRef, useRef, useState } from 'react'

import { FiShoppingCart } from 'react-icons/fi'
import { useAtom } from 'jotai'

import BooksSearch from './BooksSearch'
import Cart from './Cart/Cart'
import SessionStateWrapper from './SessionStateWrapper'
import Button from './Button'
import { isCartOpenAtom } from '~/atoms'
import ShouldRender from './ShouldRender'
import useOnClickOutside from '~/hooks/useOnClickOutside'
import { Session } from 'next-auth'

const Logo = () => {
    return (
        <Link href="/" className="text-lg font-semibold italic">
            Bookshop
        </Link>
    )
}

const accountMenuLinks = [{ label: 'My orders', href: '/my-orders' }] as const

const AccountMenu = forwardRef<
    HTMLDivElement,
    {
        sessionData: Session
        logout: () => void
    }
>((props, ref) => {
    return (
        <div
            ref={ref}
            className="absolute top-10 right-0 min-w-[200px] bg-white shadow-lg shadow-gray-500 border borded-gray-500 divide-y divide-gray-300"
        >
            <ul className="flex flex-col gap-1 text-lg">
                {accountMenuLinks.map((link) => (
                    <Link key={link.label} href={link.href}>
                        <li className="text-start p-2 hover:text-red-500">
                            {link.label}
                        </li>
                    </Link>
                ))}
            </ul>
            <div>
                <Button
                    shape="square"
                    className="w-full"
                    onClick={props.logout}
                >
                    Logout
                </Button>
            </div>
        </div>
    )
})

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useAtom(isCartOpenAtom)
    const cartRef = useRef<HTMLDivElement | null>(null)

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const accountMenuRef = useRef<HTMLDivElement | null>(null)

    useOnClickOutside(cartRef, () => setIsCartOpen(false))
    useOnClickOutside(accountMenuRef, () => setIsMenuOpen(false))

    return (
        <header className="flex bg-white flex-col w-full sticky z-30 top-0 px-5 py-1 border-b">
            <div className="relative gap-5 h-16 w-full flex flex-wrap justify-between items-center">
                <div className="order-1 md:order-none">
                    <Logo />
                </div>
                <div className="w-full flex flex-row gap-3 order-3 md:w-auto md:order-2">
                    <BooksSearch />
                </div>
                <div className="order-2 md:order-3">
                    <SessionStateWrapper
                        Guest={(signIn) => (
                            <Button onClick={signIn}>Sign in</Button>
                        )}
                        LoggedIn={(signOut, sessionData) => (
                            <div className="flex flex-row gap-2 items-center">
                                <div
                                    onClick={() =>
                                        setIsMenuOpen((prev) => !prev)
                                    }
                                    className="relative cursor-pointer"
                                >
                                    Menu
                                    <ShouldRender if={isMenuOpen}>
                                        <AccountMenu
                                            ref={accountMenuRef}
                                            sessionData={sessionData}
                                            logout={signOut}
                                        />
                                    </ShouldRender>
                                </div>
                                <Button
                                    onClick={() =>
                                        setIsCartOpen((prev) => !prev)
                                    }
                                    tooltip="Shopping cart"
                                >
                                    <FiShoppingCart />
                                </Button>
                                <ShouldRender if={isCartOpen}>
                                    <Cart ref={cartRef} />
                                </ShouldRender>
                            </div>
                        )}
                    />
                </div>
            </div>
        </header>
    )
}

export default Header
