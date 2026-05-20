import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const serviceLinks = [
  { name: "Website Development", path: "/services/website-development" },
  { name: "App Development", path: "/services/app-development" },
  { name: "SaaS Development", path: "/services/saas-development" },
  { name: "E-Commerce Solutions", path: "/services/ecommerce" },
  { name: "UI/UX Design", path: "/services/ui-ux-design" },
  { name: "Full Stack Development", path: "/services/full-stack-development" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Solutions", path: "/solutions" },
  { name: "SaaS Products", path: "/saas-products" },
  { name: "Contact", path: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
];

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/scale-x-web-solution/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/ScaleXWeb", label: "X (Twitter)" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const Footer = () => (
  <footer className="relative bg-navy border-t border-border/30 overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
    <div className="orb w-96 h-96 bg-primary/8 -bottom-32 -left-32 animate-pulse-glow" />
    <div className="orb w-64 h-64 bg-accent/8 -top-20 right-20 animate-pulse-glow" style={{ animationDelay: "2.5s" }} />

    {/* Newsletter CTA strip */}
    <div className="relative border-b border-border/30">
      <div className="container-tight py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-1">Start Today</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">
              Have a project in mind?{" "}
              <span className="gradient-text">Let's build it.</span>
            </h3>
          </div>
          <Link to="/contact" className="flex-shrink-0">
            <Button variant="hero" size="lg" className="gap-2">
              Start Free Consultation <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>

    {/* Main Footer */}
    <div className="relative container-tight py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <img src={logoImg} alt="ScaleXWeb Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <span className="font-heading font-bold text-xl text-foreground">
              Scale<span className="gradient-text">X</span>Web
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Scale Smarter. Build Better.<br />
            Full-stack digital agency delivering custom websites, apps, SaaS platforms & e-commerce solutions.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl glass border-0 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.15em] text-muted-foreground mb-5">Services</h4>
          <ul className="space-y-3">
            {serviceLinks.map((l) => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className="text-sm text-foreground/60 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.15em] text-muted-foreground mb-5">Company</h4>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className="text-sm text-foreground/60 hover:text-primary transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.15em] text-muted-foreground mb-5">Contact</h4>
          <ul className="space-y-4">
            {[
              { icon: Mail, value: "scalexwebsolution@gmail.com" },
              { icon: MapPin, value: "Ahmedabad, Gujarat, India" },
              { icon: Clock, value: "Mon–Fri: 9 AM – 6 PM IST" },
            ].map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground/60">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ScaleXWeb Solution. All rights reserved.
        </p>
        <div className="flex gap-6">
          {legalLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
