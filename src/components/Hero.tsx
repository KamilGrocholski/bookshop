import Image from 'next/image'

const Hero = () => {
    return (
        <div>
            <Image
                src={
                    'https://images-production.bookshop.org/spree/promo_banner_slides/desktop_images/258/original/TheWager_Bookshop_herobanner_2048x600B.jpg?1681831229'
                }
                alt=""
                className="w-full"
            />
        </div>
    )
}

export default Hero
