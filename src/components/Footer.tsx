import Link from 'next/link'
import { BsInstagram, BsTwitter, BsFacebook } from 'react-icons/bs'

const links = [
    { label: 'About', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Contact', href: '/contact' },
]

const socialLinks = [
    { label: 'Twitter', href: 'twitter', icon: BsTwitter },
    { label: 'Facebook', href: 'facebook', icon: BsFacebook },
    { label: 'Instagram', href: 'instagram', icon: BsInstagram },
]

const Footer = () => {
    return (
        <footer className="justify-center flex flex-col gap-12 h-fit px-5 pb-3 pt-24 bg-purple-900 text-white">
            <div className="grid lg:grid-cols-3 grid-cols-1 w-full max-w-base mx-auto items-center lg:items-start lg:justify-between gap-12">
                <section className="flex flex-col gap-2 items-center justify-center">
                    <h3>Cos</h3>
                </section>
                <section className="flex items-center flex-col">
                    <h3>Page links</h3>
                    <ul className="flex flex-col gap-2 items-center justify-center">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="hover:underline"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="flex flex-col gap-2 items-center justify-center">
                    <h3>Follow us</h3>
                    <ul className="flex flex-row gap-3">
                        {socialLinks.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href}>
                                    {
                                        <link.icon className="text-4xl hover:text-red-500" />
                                    }
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <nav className="w-fit mx-auto flex flex-row justifty-between text-sm">
                <Link href="/">
                    {new Date().getFullYear()} &copy; All Rights Reserved
                </Link>
            </nav>
        </footer>
    )
}

export default Footer
