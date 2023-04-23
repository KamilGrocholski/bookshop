import { useAtom } from 'jotai'
import Image from 'next/image'
import { useState } from 'react'
import { isSidebarOpenAtom } from '~/atoms'
import ShouldRender from './ShouldRender'

const Logo = () => {
    return <Image src={''} alt="logo" className="h-2" />
}

const SearchBar = () => {
    const [query, setQuery] = useState<string>('')

    return (
        <div>
            <input
                className="bg-gray-500 rounded-xl px-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    )
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
        <ul className="flex items-center justify-between w-full">
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
    const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom)

    return (
        <header className="flex flex-col w-full static top-0">
            <div className="h-24 w-full flex flex-wrap justify-between items-center">
                <div className="order-1 md:order-none">First</div>
                <div className="w-full flex flex-row gap-3 order-3 md:w-auto md:order-2">
                    <button
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        MENU
                    </button>
                    <input
                        type="search"
                        placeholder="Search"
                        className="w-full md:w-auto"
                    />
                </div>
                <div className="order-2 md:order-3">Third</div>
            </div>
            <div className="hidden md:flex">
                <FastMenu />
            </div>
        </header>
    )
}

export default Header
