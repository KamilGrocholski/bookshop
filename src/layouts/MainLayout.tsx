import Footer from '~/components/Footer'
import Header from '~/components/Header'
import Hero from '~/components/Hero'
import ShouldRender from '~/components/ShouldRender'

const MainLayout: React.FC<{
    children: JSX.Element | React.ReactNode | JSX.Element[]
    heroImage?: boolean
}> = ({ children, heroImage = false }) => {
    return (
        <div className="flex flex-col">
            <Header />
            <ShouldRender if={heroImage}>
                <Hero />
            </ShouldRender>
            <main className="min-h-screen max-h-full py-32 px-5 max-w-base mx-auto">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
