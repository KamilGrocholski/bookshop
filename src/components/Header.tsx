import BooksSearch from './BooksSearch'
import Link from 'next/link'
import Cart from './Cart/Cart'
import SessionStateWrapper from './SessionStateWrapper'
import Button from './Button'
import { FiShoppingCart } from 'react-icons/fi'
import { useAtom } from 'jotai'
import { isCartOpenAtom } from '~/atoms'
import ShouldRender from './ShouldRender'
import { useRef } from 'react'
import useOnClickOutside from '~/hooks/useOnClickOutside'

const Logo = () => {
    return <Link href="/">Bookshop</Link>
}

const menuLinks = [
    { label: 'Choose a Bookstore', href: '', icon: '' },
    { label: 'Choose', href: '', icon: '' },
    { label: 'IC', href: '', icon: '' },
] as const

const fastLinks = [
    { label: 'Offers1', href: '' },
    { label: 'Offers2', href: '' },
    { label: 'Offers3', href: '' },
    { label: 'Offers4', href: '' },
    { label: 'Offers5', href: '' },
    { label: 'Offers6', href: '' },
    { label: 'Offers7', href: '' },
    { label: 'Offers8', href: '' },
    { label: 'Offers9', href: '' },
    { label: 'Offers', href: '' },
]

const FastMenu = () => {
    return (
        <ul className="flex items-center justify-around container mx-auto">
            {fastLinks.map((link) => (
                <li key={link.label}>{link.label}</li>
            ))}
        </ul>
    )
}

const Menu = () => {
    return (
        <div>
            <ul className="flex items-center">
                {menuLinks.map((link) => (
                    <li key={link.label}>{link.label}</li>
                ))}
            </ul>
        </div>
    )
}

const Sidebar = () => {
    return (
        <aside>
            <ul className="flex flex-col items-center gap-3 w-full">
                {fastLinks.map((link) => (
                    <li key={link.label}>{link.label}</li>
                ))}
            </ul>
        </aside>
    )
}

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useAtom(isCartOpenAtom)
    const cartRef = useRef<HTMLDivElement | null>(null)

    useOnClickOutside(cartRef, () => setIsCartOpen(false))

    return (
        <header className="flex bg-white flex-col w-full sticky z-30 top-0 px-5 py-1 border-b">
            <div className="relative h-16 w-full flex flex-wrap justify-between items-center">
                <div className="order-1 md:order-none">
                    <Logo />
                </div>
                <div className="w-full flex flex-row gap-3 order-3 md:w-auto md:order-2">
                    <button className="md:hidden">MENU</button>
                    <BooksSearch />
                </div>
                <div className="order-2 md:order-3">
                    <SessionStateWrapper
                        Guest={(signIn) => (
                            <Button onClick={signIn}>Sign in</Button>
                        )}
                        LoggedIn={(signOut) => (
                            <div className="flex flex-row gap-2 items-center">
                                <button onClick={() => signOut()}>
                                    Sign out
                                </button>
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
            <div className="hidden md:flex">
                <FastMenu />
            </div>
        </header>
    )
}

export default Header
