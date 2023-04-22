import Image from 'next/image'

const UserAvatar: React.FC<{ image: string }> = ({ image }) => {
    return <Image src={image} alt="user-avatar" />
}

export default UserAvatar
