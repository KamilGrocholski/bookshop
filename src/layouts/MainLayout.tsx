import Footer from "~/components/Footer";
import Header from "~/components/Header";

const MainLayout: React.FC<{
  children: JSX.Element | React.ReactNode | JSX.Element[];
}> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="min-h-screen max-h-full py-24 px-5 container mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
