import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SiteDataProvider, useSiteData } from "@/context/SiteDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";

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
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MaintenancePage = lazy(() => import("./pages/MaintenancePage"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));
const Demo = lazy(() => import("./pages/Demo"));
const JobsDirectory = lazy(() => import("./pages/JobsDirectory"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const AdminJobsList = lazy(() => import("./pages/admin/AdminJobsList"));
const AdminCompliance = lazy(() => import("./pages/admin/AdminCompliance"));
const AdminJobEdit = lazy(() => import("./pages/admin/AdminJobEdit"));
const AdminProgramEdit = lazy(() => import("./pages/admin/AdminProgramEdit"));
const JobApply = lazy(() => import("./pages/JobApply"));
const SeekerApplications = lazy(() => import("./pages/SeekerApplications"));
const AdminJobApplicants = lazy(() => import("./pages/admin/AdminJobApplicants"));
const AdminApplicantDetail = lazy(() => import("./pages/admin/AdminApplicantDetail"));
const SeekerSavedJobs = lazy(() => import("./pages/SeekerSavedJobs"));
const SeekerJobAlerts = lazy(() => import("./pages/SeekerJobAlerts"));
const CareersAuth = lazy(() => import("./pages/CareersAuth"));
const SeekerProfile = lazy(() => import("./pages/SeekerProfile"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
import ScrollToTop from "@/components/layout/ScrollToTop";


const LoaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber Grid Background
      ctx.strokeStyle = "rgba(48, 76, 230, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw and connect nodes
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 42, 255, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06;
            ctx.strokeStyle = `rgba(48, 76, 230, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        const mouseDist = Math.hypot(p1.x - mouseX, p1.y - mouseY);
        if (mouseDist < 180) {
          const alpha = (1 - mouseDist / 180) * 0.12;
          ctx.strokeStyle = `rgba(48, 76, 230, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const LOG_MESSAGES = [
  { threshold: 0, text: "INIT CORE ENGINE..." },
  { threshold: 12, text: "RESOLVING STYLING AGENT..." },
  { threshold: 25, text: "COMPILING TAILWIND SCHEMAS..." },
  { threshold: 38, text: "CONNECTING DATABASE SHIELD..." },
  { threshold: 50, text: "PULLING SITE CONTEXT SETTINGS..." },
  { threshold: 65, text: "INJECTING DYNAMIC SEO SCHEMA..." },
  { threshold: 78, text: "HYDRATING INTERACTIVE ROUTER..." },
  { threshold: 90, text: "FINALIZING CORE WEB VITALS..." },
  { threshold: 98, text: "LAUNCHING SCALEXWEB PLATFORM..." }
];

const PageLoader = ({ onComplete }: { onComplete?: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const isInitial = typeof onComplete === "function";

  useEffect(() => {
    if (!isInitial) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 600);
          return 100;
        }
        const diff = Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + diff, 100);
      });
    }, 60);
    return () => clearInterval(timer);
  }, [isInitial]);

  useEffect(() => {
    if (!isInitial) return;
    const newLogs = LOG_MESSAGES.filter(log => progress >= log.threshold).map(log => log.text);
    setActiveLogs(newLogs.slice(-3));
  }, [progress, isInitial]);

  const titleLetters = "ScaleXWeb".split("");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`w-full flex flex-col items-center justify-center bg-background text-foreground select-none overflow-hidden font-sans relative z-50 ${
        isInitial ? "min-h-screen fixed inset-0" : "h-[70vh] rounded-2xl my-8"
      }`}
    >
      {/* Background canvas grid system */}
      {isInitial && <LoaderCanvas />}

      {/* Cyber Grid Scanning overlay */}
      {isInitial && (
        <div className="absolute inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent bg-[size:100%_4px] opacity-30 animate-pulse" />
      )}

      {/* Radial ambient glow orbs */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#304ce6]/10 to-[#a72aff]/10 pointer-events-none filter blur-[80px]"
        animate={{
          scale: isInitial ? [0.9, 1.15, 0.9] : [0.95, 1.05, 0.95],
          opacity: isInitial ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center gap-8 max-w-[320px] w-full z-10 px-4">
        {/* SVG Drawing Circle Loader & Logo */}
        <motion.div 
          className="relative w-28 h-28 flex items-center justify-center"
          exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.35, ease: [0.36, 0, 0.66, -0.56] } }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              {/* Glow filter */}
              <filter id="svg-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Gradients */}
              <linearGradient id="circle-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#304ce6" />
                <stop offset="100%" stopColor="#a72aff" />
              </linearGradient>
              <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#304ce6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a72aff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* Background static circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-foreground/5"
              strokeWidth="1.5"
              fill="transparent"
            />

            {/* Rotating dashed outer ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="rgba(167, 42, 255, 0.15)"
              strokeWidth="0.8"
              fill="transparent"
              strokeDasharray="4 6"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Rotating segment middle ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(48, 76, 230, 0.25)"
              strokeWidth="1"
              fill="transparent"
              strokeDasharray="30 15 10 30"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner active progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="36"
              className="stroke-url(#circle-grad)"
              strokeWidth="2.5"
              fill="transparent"
              strokeLinecap="round"
              filter="url(#svg-glow)"
              animate={isInitial ? {
                strokeDasharray: "226",
                strokeDashoffset: 226 - (226 * progress) / 100,
              } : {
                strokeDasharray: ["40 186", "120 106", "40 186"],
                strokeDashoffset: [0, -80, -226]
              }}
              transition={isInitial ? { ease: "easeOut", duration: 0.1 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo vector paths drawing symmetrically */}
            {/* Purple shape (right-to-left bend, draws bottom-to-top) */}
            <motion.path
              d="M 68,70 C 47,60 47,40 68,30"
              stroke="url(#purple-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInitial ? {
                pathLength: progress / 100
              } : {
                pathLength: [0.1, 0.9, 0.1]
              }}
              transition={isInitial ? {
                ease: "easeOut",
                duration: 0.1
              } : {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Blue shape (left-to-right bend, draws top-to-bottom) */}
            <motion.path
              d="M 32,30 C 53,40 53,60 32,70"
              stroke="url(#blue-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              filter="url(#svg-glow)"
              initial={{ pathLength: 0 }}
              animate={isInitial ? {
                pathLength: progress / 100
              } : {
                pathLength: [0.1, 0.9, 0.1]
              }}
              transition={isInitial ? {
                ease: "easeOut",
                duration: 0.1
              } : {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>

        {/* Staggered Title Reveal & Subtext */}
        <motion.div 
          className="text-center space-y-2 w-full"
          exit={{ y: -20, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
        >
          <div className="flex justify-center items-center overflow-hidden h-8">
            {titleLetters.map((char, index) => (
              <motion.span
                key={index}
                className={`text-2xl font-heading font-extrabold tracking-tight ${
                  char === "X"
                    ? "bg-gradient-to-tr from-[#304ce6] to-[#a72aff] bg-clip-text text-transparent"
                    : "text-foreground"
                }`}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-[10px] font-mono text-[#71717A] uppercase tracking-[0.35em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Solutions
          </motion.p>
        </motion.div>

        {/* Console Logs Display */}
        {isInitial && (
          <motion.div 
            className="w-full flex flex-col gap-1.5 h-[56px] justify-end overflow-hidden font-mono text-[9px] text-[#71717A] text-left px-2 select-none border-l border-foreground/5 py-1"
            exit={{ opacity: 0, y: 15, transition: { duration: 0.25 } }}
          >
            <AnimatePresence mode="popLayout">
              {activeLogs.map((logText, idx) => {
                const isLatest = idx === activeLogs.length - 1;
                return (
                  <motion.div
                    key={logText}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isLatest ? 0.95 : 0.4, x: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center gap-1.5 ${isLatest ? "text-[#304ce6]" : "text-[#a1a1aa]"}`}
                  >
                    <span className="text-[#a72aff] font-bold">&gt;</span>
                    <span className="tracking-wider uppercase">{logText}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modern Percentage Indicator */}
        {isInitial && (
          <motion.div 
            className="w-full space-y-3"
            exit={{ y: 20, opacity: 0, transition: { duration: 0.25 } }}
          >
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#71717A] px-1 border-t border-foreground/5 pt-3">
              <span className="tracking-wider">SYSTEM LOADING</span>
              <span className="text-[#304ce6] font-bold tracking-widest">{String(progress).padStart(3, "0")}%</span>
            </div>

            {/* Mini progress line indicator */}
            <div className="w-full h-[1.5px] bg-foreground/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#304ce6] to-[#a72aff]"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

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

const App = () => {
  const [initialLoading, setInitialLoading] = useState(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return !/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    }
    return true;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SiteDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            {initialLoading ? (
              <PageLoader key="loader" onComplete={() => setInitialLoading(false)} />
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background min-h-screen"
              >
                <BrowserRouter>
                  <ScrollToTop />
                  <AnalyticsTracker />
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
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/jobs" element={<JobsDirectory />} />
                        <Route path="/jobs/:slug" element={<JobDetails />} />
                        <Route path="/jobs/:slug/apply" element={<JobApply />} />
                        <Route path="/verify-certificate/:id" element={<VerifyCertificate />} />
                        <Route path="/dashboard/applications" element={<SeekerApplications />} />
                        <Route path="/dashboard/saved-jobs" element={<SeekerSavedJobs />} />
                        <Route path="/dashboard/job-alerts" element={<SeekerJobAlerts />} />
                        <Route path="/dashboard/profile" element={<SeekerProfile />} />
                        <Route path="/careers/auth" element={<CareersAuth />} />
                        <Route path="/admin/jobs" element={<AdminJobsList />} />
                        <Route path="/admin/jobs/new" element={<AdminJobEdit />} />
                        <Route path="/admin/jobs/edit/:id" element={<AdminJobEdit />} />
                        <Route path="/admin/programs/new" element={<AdminProgramEdit />} />
                        <Route path="/admin/programs/edit/:id" element={<AdminProgramEdit />} />
                        <Route path="/admin/compliance" element={<AdminCompliance />} />
                        <Route path="/admin/jobs/:id/applicants" element={<AdminJobApplicants />} />
                        <Route path="/admin/applicants/:id" element={<AdminApplicantDetail />} />
                        <Route path="/adminloginog" element={<AdminDashboard />} />
                        <Route path="/adminloginfk" element={<AdminDashboard />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </MaintenanceGuard>
                </BrowserRouter>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </SiteDataProvider>
    </ThemeProvider>
  );
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-9KBGB4TYB1";
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        send_to: GA_MEASUREMENT_ID
      });
    }
  }, [location]);

  return null;
};

export default App;
