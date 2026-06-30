import Header from "./Header";
import Footer from "./Footer";
import CookieBanner from "./CookieBanner";
import { PolicyReacceptanceModal } from "./PolicyReacceptanceModal";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <CookieBanner />
      <PolicyReacceptanceModal />
    </div>
  );
};

export default Layout;
