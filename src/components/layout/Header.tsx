import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Globe, Smartphone, Cloud, ShoppingCart, Palette, Code } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const serviceLinks = [
  { name: "Website Development", path: "/services/website-development", icon: Globe, desc: "Custom, high-performance websites" },
  { name: "App Development", path: "/services/app-development", icon: Smartphone, desc: "iOS, Android & cross-platform apps" },
  { name: "SaaS Development", path: "/services/saas-development", icon: Cloud, desc: "End-to-end SaaS platforms" },
  { name: "E-Commerce Solutions", path: "/services/ecommerce", icon: ShoppingCart, desc: "High-converting online stores" },
  { name: "UI/UX Design", path: "/services/ui-ux-design", icon: Palette, desc: "Human-centered design" },
  { name: "Full Stack Development", path: "/services/full-stack-development", icon: Code, desc: "End-to-end web app development" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services", children: serviceLinks },
  { name: "Solutions", path: "/solutions" },
  { name: "SaaS Products", path: "/saas-products" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

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
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container-tight flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logoImg} alt="ScaleXWeb Logo" className="w-9 h-9 object-contain rounded-xl shadow-md group-hover:glow-sm transition-all duration-300" />
          <span className="font-heading font-bold text-xl text-foreground">
            Scale<span className="gradient-text">X</span>Web
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/60 p-2 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl pointer-events-none" />
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-muted/60 ${
                            location.pathname === child.path ? "bg-primary/10" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:glow-sm transition-all">
                            <child.icon className="w-4 h-4 text-white" />
                          </div>
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
                              <child.icon className="w-4 h-4 text-primary" />
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
