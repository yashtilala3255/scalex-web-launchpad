import { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoImg from "@/assets/logo.png";
import { useSiteData } from "@/context/SiteDataContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Solutions", path: "/solutions" },
  { name: "SaaS Products", path: "/saas-products" },
  { name: "Contact", path: "/contact" },
  { name: "Verify Certificate", path: "/verify" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms-of-service" },
  { name: "Cookie Policy", path: "/cookie-policy" },
];

const Footer = () => {
  const { services, settings } = useSiteData();
  const [footerEmail, setFooterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const displaySiteName = settings?.siteName || "ScaleXWeb";
  const contactEmail = settings?.contactEmail || "scalexwebsolution@gmail.com";
  const contactPhone = settings?.contactPhone || "+91 98765 43210";
  const contactAddress = settings?.contactAddress || "Ahmedabad, Gujarat, India";

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail.trim()) return;

    try {
      setSubmitting(true);
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.functions.invoke("newsletter-emails", {
          body: {
            action: "subscribe",
            email: footerEmail.trim().toLowerCase(),
            topics: ["development", "saas", "ecommerce", "news"],
            frequency: "weekly"
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast.success("Subscribed successfully! Check your inbox for the welcome email.");
        setFooterEmail("");
      } else {
        setTimeout(() => {
          toast.success("Subscribed successfully! (Mock)");
          setFooterEmail("");
        }, 1000);
      }
    } catch (err: any) {
      console.error("Footer subscribe error:", err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const serviceLinks = navServices;

  const socialLinks = [
    { icon: Linkedin, href: settings?.socialLinkedin || "https://www.linkedin.com/company/scale-x-web-solution", label: "LinkedIn" },
    { icon: Twitter, href: settings?.socialTwitter || "https://twitter.com", label: "X (Twitter)" },
    { icon: Instagram, href: settings?.socialInstagram || "https://www.instagram.com/scalexwebsolution/", label: "Instagram" },
  ];

  return (
  <footer className="relative bg-navy border-t border-border/30 overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
    <div className="orb w-96 h-96 bg-primary/8 -bottom-32 -left-32 animate-pulse-glow" />
    <div className="orb w-64 h-64 bg-accent/8 -top-20 right-20 animate-pulse-glow" style={{ animationDelay: "2.5s" }} />

    {/* Main Footer */}
    <div className="relative container-tight py-14">
      {/* Newsletter Signup CTA Bar */}
      <div className="relative border-b border-border/30 pb-10 mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <h3 className="font-heading font-extrabold text-sm text-foreground flex items-center gap-2 justify-center lg:justify-start">
              <Mail className="w-4 h-4 text-primary" /> Join Our Newsletter
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Actionable software architecture guidelines and SaaS business tactics. Weekly digest.
            </p>
          </div>
          <form onSubmit={handleFooterSubscribe} className="flex gap-2 w-full max-w-md">
            <Input
              required
              type="email"
              placeholder="Enter your email address"
              value={footerEmail}
              onChange={(e) => setFooterEmail(e.target.value)}
              className="bg-navy-dark border-border/50 text-xs h-10 rounded-xl"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/95 text-white font-bold h-10 px-6 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
            >
              {submitting ? "..." : "Subscribe"} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-5">
            <img src={settings?.logoUrl || logoImg} alt="ScaleXWeb Logo" className="w-9 h-9 object-contain rounded-xl shadow-md" />
            <span className="font-heading font-bold text-xl text-foreground">
              {displaySiteName.includes("ScaleXWeb") ? (
                <>Scale<span className="gradient-text">X</span>Web</>
              ) : (
                displaySiteName
              )}
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
              { icon: Mail, value: contactEmail },
              { icon: MapPin, value: contactAddress },
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
          © {new Date().getFullYear()} {displaySiteName}. All rights reserved.
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
};

export default Footer;
