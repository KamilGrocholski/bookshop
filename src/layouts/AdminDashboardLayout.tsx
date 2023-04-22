import Sidebar from '~/components/Sidebar'

const AdminDashboardLayout = ({
    children,
}: {
    children: React.ReactElement
}) => {
    return (
        <div className="flex h-full md:flex-row flex-col">
            <Sidebar />
            <main className="flex flex-col min-h-screen max-h-full overflo-y-scroll">
                {children}
            </main>
        </div>
    )
}

export default AdminDashboardLayout
