import Image from 'next/image'
import Link from 'next/link'
import { IoIosPeople } from 'react-icons/io'
import UserAvatar from './common/UserAvatar'

const Logo = () => {
    return <Image src="" alt="Logo" />
}

const menu = {
    links: [
        { Icon: IoIosPeople, href: '/' },
        { Icon: IoIosPeople, href: '/' },
        { Icon: IoIosPeople, href: '/' },
        { Icon: IoIosPeople, href: '/' },
    ],
}

const Sidebar = () => {
    return (
        <aside className="flex flex-col w-16 max-h-full min-h-screen bg-gray-800 divide-black divide-y">
            <div>
                <Link href="/">
                    <Logo />
                </Link>
            </div>
            <div className="grow">
                <ul className="flex flex-col space-y-3 items-center">
                    {menu.links.map((link) => (
                        <li>
                            <Link href={link.href}>
                                <link.Icon className="w-8 h-8" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <div>
                    <ul className="flex flex-col items-center space-y-3">
                        <li>
                            <button>
                                <IoIosPeople className="w-8 h-8" />
                            </button>
                        </li>
                        <li>
                            <button>
                                <IoIosPeople className="w-8 h-8" />
                            </button>
                        </li>
                        <li>
                            <button>
                                <IoIosPeople className="w-8 h-8" />
                            </button>
                        </li>
                    </ul>
                </div>
                <div>
                    <button className="rounded-full h-12 w-12">
                        <UserAvatar image=""></UserAvatar>
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
