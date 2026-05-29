import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import { useSiteData } from "@/context/SiteDataContext";
import { getIconComponent } from "@/components/ui/icon-helper";



const Header = () => {
  const { services, settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navServices = [...(services || [])];
  const hasFullStack = navServices.some((s) => s.path === "/services/full-stack-development");
  if (!hasFullStack) {
    navServices.push({
      icon: "Layers",
      name: "Full Stack Development",
      desc: "End-to-end custom software and enterprise web applications.",
      bullets: ["Custom Web Apps", "API Integrations", "Database Architecture"],
      path: "/services/full-stack-development"
    });
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services", children: navServices },
    { name: "Solutions", path: "/solutions" },
    { name: "SaaS Products", path: "/saas-products" },
    { name: "Contact", path: "/contact" },
  ];

  const displaySiteName = settings?.siteName || "ScaleXWeb";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-zinc-200/40"
          : "bg-transparent"
      }`}
    >
      <div className="container-tight flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={settings?.logoUrl || logoImg} alt="ScaleXWeb Logo" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:glow-sm transition-all duration-300" />
          <span className="font-heading font-bold text-xl text-foreground">
            {displaySiteName.includes("ScaleXWeb") ? (
              <>Scale<span className="gradient-text">X</span>Web</>
            ) : (
              displaySiteName
            )}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-muted/60 ${
                    location.pathname.startsWith("/services")
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-card/90 backdrop-blur-xl rounded-xl shadow-lg border border-border/50 p-2 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-xl pointer-events-none" />
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-muted/60 ${
                            location.pathname === child.path ? "bg-primary/10" : ""
                          }`}
                        >
                          {(() => {
                            const Icon = getIconComponent(child.icon);
                            return (
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                                <Icon className="w-4 h-4" />
                              </div>
                            );
                          })()}
                          <div>
                            <p className={`text-sm font-medium ${location.pathname === child.path ? "text-primary" : "text-foreground"}`}>
                              {child.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{child.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-muted/60 ${
                  isActive(link.path) ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <Link to="/contact" className="hidden lg:block">
            <Button variant="nav" size="sm">Get Free Quote</Button>
          </Link>
          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/50 overflow-hidden"
          >
            <div className="container-tight py-4 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name}>
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/60 text-foreground/80"
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/60"
                            >
                              {(() => {
                                const Icon = getIconComponent(child.icon);
                                return <Icon className="w-4 h-4 text-primary" />;
                              })()}
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/60 ${
                      isActive(link.path) ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <Link to="/contact" className="mt-2">
                <Button variant="hero" className="w-full">Get a Free Quote</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
