import Image from 'next/image'

// placeholder
import HeroImage from '../../public/assets/hero-image.webp'

const Hero = () => {
    return (
        <div className="w-full">
            <Image src={HeroImage} alt="" className="w-full" />
        </div>
    )
}

export default Hero
