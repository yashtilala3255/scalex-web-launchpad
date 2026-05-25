import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SiteDataProvider, useSiteData } from "@/context/SiteDataContext";

// Route-based code splitting for optimized loading
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SaasProducts = lazy(() => import("./pages/SaasProducts"));
const WebsiteDevelopment = lazy(() => import("./pages/services/WebsiteDevelopment"));
const AppDevelopment = lazy(() => import("./pages/services/AppDevelopment"));
const SaasDevelopment = lazy(() => import("./pages/services/SaasDevelopment"));
const Ecommerce = lazy(() => import("./pages/services/Ecommerce"));
const UiUxDesign = lazy(() => import("./pages/services/UiUxDesign"));
const FullStackDevelopment = lazy(() => import("./pages/services/FullStackDevelopment"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#03040b]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const { settings, loading, trackPageView } = useSiteData();
  const location = useLocation();
  const isAdminPath = location.pathname.toLowerCase().startsWith("/admin");

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  if (loading && !isAdminPath) {
    return <PageLoader />;
  }

  if (settings?.isMaintenanceMode && !isAdminPath) {
    return <MaintenancePage />;
  }

  if (settings?.isComingSoonMode && !isAdminPath) {
    return <ComingSoonPage />;
  }

  return <>{children}</>;
};

const App = () => (
  <SiteDataProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MaintenanceGuard>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/saas-products" element={<SaasProducts />} />
              <Route path="/services/website-development" element={<WebsiteDevelopment />} />
              <Route path="/services/app-development" element={<AppDevelopment />} />
              <Route path="/services/saas-development" element={<SaasDevelopment />} />
              <Route path="/services/ecommerce" element={<Ecommerce />} />
              <Route path="/services/ui-ux-design" element={<UiUxDesign />} />
              <Route path="/services/full-stack-development" element={<FullStackDevelopment />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MaintenanceGuard>
      </BrowserRouter>
    </TooltipProvider>
  </SiteDataProvider>
);

export default App;
