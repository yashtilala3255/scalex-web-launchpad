import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy text-primary-foreground">
    <div className="container-tight section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="ScaleXWeb Logo" className="w-9 h-9 rounded-lg" />
            <span className="font-heading font-bold text-xl text-primary-foreground">
              ScaleXWeb
            </span>
          </Link>
          <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
            Scale Smarter. Build Better.<br />
            Full-stack digital agency delivering custom websites, apps, SaaS platforms & e-commerce solutions.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/company/scale-x-web-solution/" },
              { icon: Twitter, href: "https://x.com/ScaleXWeb" },
              { icon: Instagram, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/60 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-primary-foreground/80">Company</h4>
          <ul className="space-y-2.5">
            {[{ name: "About Us", path: "/about" }, { name: "Contact", path: "/contact" }, { name: "Solutions", path: "/solutions" }, { name: "SaaS Products", path: "/saas-products" }].map(l => (
              <li key={l.path}><Link to={l.path} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{l.name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-primary-foreground/80">Services</h4>
          <ul className="space-y-2.5">
            {[
              { name: "Website Development", path: "/services/website-development" },
              { name: "App Development", path: "/services/app-development" },
              { name: "SaaS Development", path: "/services/saas-development" },
              { name: "E-Commerce", path: "/services/ecommerce" },
              { name: "UI/UX Design", path: "/services/ui-ux-design" },
            ].map(l => (
              <li key={l.path}><Link to={l.path} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{l.name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-sm mb-4 text-primary-foreground/80">Contact</h4>
          <ul className="space-y-2.5 text-sm text-primary-foreground/50">
            <li>scalexwebsolution@gmail.com</li>
            
            <li>Ahmedabad, Gujarat, India</li>
            <li>Mon–Fri: 9:00 AM – 6:00 PM IST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} ScaleXWeb Solution. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-primary-foreground/40">
          <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
