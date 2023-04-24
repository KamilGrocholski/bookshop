import { useAtom } from 'jotai'
import Image from 'next/image'
import { useRef } from 'react'
import { isCartOpenAtom } from '~/atoms'
import ShouldRender from './ShouldRender'
import Cart from './Cart/Cart'
import useOnClickOutside from '~/hooks/useOnClickOutside'
import BooksSearch from './BooksSearch'

const Logo = () => {
    return <Image src={''} alt="logo" className="h-2" />
}

const menuLinks = [
    { label: 'Choose a Bookstore', href: '', icon: '' },
    { label: 'Choose', href: '', icon: '' },
    { label: 'IC', href: '', icon: '' },
] as const

const fastLinks = [
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
    { label: 'Offers', href: '' },
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
        <header className="flex flex-col w-full static top-0 px-5 py-1">
            <div className="relative h-16 w-full flex flex-wrap justify-between items-center">
                <div className="order-1 md:order-none">First</div>
                <div className="w-full flex flex-row gap-3 order-3 md:w-auto md:order-2">
                    <button className="md:hidden">MENU</button>
                    <BooksSearch />
                </div>
                <div className="order-2 md:order-3">
                    <button onClick={() => setIsCartOpen(true)}>Cart</button>
                </div>
                <ShouldRender if={isCartOpen}>
                    <Cart ref={cartRef} />
                </ShouldRender>
            </div>
            <div className="hidden md:flex">
                <FastMenu />
            </div>
        </header>
    )
}

export default Header
