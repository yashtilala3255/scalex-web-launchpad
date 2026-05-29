import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ArrowRight, CheckCircle, Globe, Layout as LayoutIcon,
  Zap, Shield, Database, Code, Cpu, Sparkles, AlertCircle,
  FileCode, Search, Smartphone, Award, Settings, Layers,
  ChevronDown, Send, Check
} from "lucide-react";

/* ─── Page Data ──────────────────────────────────────── */

const benefits = [
  {
    title: "100% Tailored Design",
    desc: "No templates, no drag-and-drop constraints. Every pixel is customized to reflect your brand's unique identity and convert your specific target audience."
  },
  {
    title: "Performance & Core Web Vitals",
    desc: "Built with speed in mind. Blazing-fast page loads that keep users engaged and help your site rank higher in Google search results."
  },
  {
    title: "SEO-Ready Architecture",
    desc: "Clean semantic markup, optimized schema tags, fast loading speeds, and responsive structure designed for high-ranking visibility."
  },
  {
    title: "Secure & Scalable Infrastructure",
    desc: "Robust codebases protected against security exploits, and clean structures that allow your site to grow seamlessly alongside your business."
  }
];

const webServices = [
  { icon: LayoutIcon, title: "Corporate Websites", desc: "Premium brand showcases designed to establish industry authority, educate prospects, and generate high-quality leads." },
  { icon: Sparkles, title: "High-Converting Landing Pages", desc: "Ultra-optimized pages built for single-focused campaigns, combining copywriting hooks with fast page load speeds." },
  { icon: Globe, title: "Web Portals & Custom Dashboards", desc: "Secure portal development with member access, admin panels, client dashboards, and custom business integrations." },
  { icon: Database, title: "CMS Custom Development", desc: "Easy-to-manage sites built on headless CMS frameworks (Sanity, Strapi, Webflow, WordPress) for seamless content updates." }
];

const comparisons = [
  {
    feature: "Page Load Speed",
    custom: "0.8s - Blazing Fast",
    template: "3.5s+ - Heavy & Bloated",
    customBetter: true
  },
  {
    feature: "Google Lighthouse Score",
    custom: "98 - 100 (Excellent)",
    template: "45 - 60 (Poor to Average)",
    customBetter: true
  },
  {
    feature: "Security Risks",
    custom: "Extremely Low (Custom code)",
    template: "High (Vulnerable plugins)",
    customBetter: true
  },
  {
    feature: "Design Flexibility",
    custom: "Unlimited (Any design is possible)",
    template: "Highly Restrained (Grid limits)",
    customBetter: true
  },
  {
    feature: "Scalability & Features",
    custom: "Modular (Add anything anytime)",
    template: "Complex (Breaks templates)",
    customBetter: true
  }
];

const faqs = [
  { q: "What's the difference between custom and template websites?", a: "Template websites (like basic WordPress or Wix templates) use pre-written code meant for thousands of sites, which makes them heavy, slow, and insecure. Custom development means building from scratch tailored to your exact needs, leading to superior speeds, high security, and unique designs that represent your brand." },
  { q: "Do you build on CMS platforms like WordPress or Webflow?", a: "Yes, we build custom themes for Webflow, Shopify, Headless CMSs, and WordPress. We do not use bloated pre-made templates; instead, we design a custom interface in Figma and develop it as a lightweight, optimized theme." },
  { q: "How long does it take to develop a custom website?", a: "A professional landing page takes about 1-2 weeks. A complete corporate site with 5-10 pages takes 3-5 weeks. Complex web portals or custom platforms can take 6-12 weeks." },
  { q: "Will my website be mobile-friendly and SEO-optimized?", a: "Absolutely. Every website we build is 100% responsive (fits all phones, tablets, and laptops) and follows standard technical SEO practices (meta tags, fast loading speeds, clean semantic code, and schema markup) to help you rank." },
  { q: "Do you offer post-launch support and hosting guidance?", a: "Yes, we assist with server setup, custom domain mapping, and email hosting setup. We also provide ongoing monthly support and maintenance packages to keep your website secure and updated." }
];

/* ─── Contact Form Validation ───────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your project (min 15 chars)"),
});
type LeadData = z.infer<typeof leadSchema>;

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

import websiteMockup from "@/assets/website_mockup.png";

/* ─── Interactive Web Mockup Component ────────────── */
const InteractiveBrowser = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [copied, setCopied] = useState(false);

  return (
    <div className="w-full relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-destructive/80" />
          <span className="w-3 h-3 rounded-full bg-warning/80" />
          <span className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <div className="flex-1 max-w-md mx-auto h-7 bg-background/50 rounded-lg border border-border px-3 flex items-center justify-between text-xs text-muted-foreground select-none">
          <span>scalexweb.com/{activeTab}</span>
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="w-12" />
      </div>

      {/* Browser Content */}
      <div className="p-4 bg-background/60 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
        {/* Floating tech nodes */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-4 border-b border-border/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">Active Dev</span>
              <span className="text-xs text-muted-foreground">React + Tailwind v4</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold font-mono tracking-wider">{activeTab} preview</span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-border shadow-sm group bg-slate-950">
                  <img src={websiteMockup} alt="ScaleXWeb Website Design" loading="lazy" decoding="async" width={600} height={176} className="w-full h-44 object-cover object-top hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <p className="text-[11px] font-bold text-white">High-Fidelity Custom Layout</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-card/60 p-2.5 rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground">Designed in Figma, coded in React</span>
                  <div className="flex gap-1.5">
                    <div className="px-3 py-1 bg-primary rounded-lg text-white font-semibold text-[10px] shadow-sm">View Demo</div>
                    <div className="px-3 py-1 border border-border hover:bg-muted/50 rounded-lg text-foreground text-[10px] font-semibold">Pricing</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "speed" && (
              <motion.div key="speed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <h4 className="text-2xl md:text-3xl font-heading font-black text-foreground">Speed Optimization</h4>
                <p className="text-sm text-muted-foreground">Lighthouse Performance: <span className="text-success font-bold">100%</span>. Built for instant responsiveness and absolute zero layout shifts.</p>
                {/* Score indicators */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { label: "Performance", score: "99+", color: "text-success bg-success/10 border-success/20" },
                    { label: "SEO", score: "100", color: "text-success bg-success/10 border-success/20" },
                    { label: "Accessibility", score: "98+", color: "text-success bg-success/10 border-success/20" },
                    { label: "Best Practice", score: "100", color: "text-success bg-success/10 border-success/20" }
                  ].map((s) => (
                    <div key={s.label} className={`p-2 rounded-xl border text-center ${s.color}`}>
                      <div className="text-base font-extrabold font-heading">{s.score}</div>
                      <div className="text-[9px] text-muted-foreground font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "features" && (
              <motion.div key="features" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                <h4 className="text-xl font-bold text-foreground">Advanced Layout Components</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Responsive Grids", "GSAP Scroll Animations", "Headless CMS Synced", "Interactive Canvas", "GDPR Cookie Protection", "Dark/Light Native Support"].map(f => (
                    <div key={f} className="p-2 border border-border rounded-lg bg-card flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab triggers */}
        <div className="mt-8 pt-4 border-t border-border flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: "home", name: "Homepage Wireframe" },
            { id: "speed", name: "Lighthouse Audit" },
            { id: "features", name: "Code Features" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === t.id ? "bg-primary text-white" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useSiteData } from "@/context/SiteDataContext";

const WebsiteDevelopment = () => {
  const { addInquiry } = useSiteData();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      await addInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        requirement: data.requirement,
        service: "Website Development"
      });

      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "Website Dev Inquiry" }) });
      if (res.ok) { toast.success("🚀 Request received! We'll reach out within 24 hours."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };

  return (
    <Layout>
      <SEO
        title="Custom Website Development Ahmedabad | ScaleXWeb"
        description="Premium custom web development services in Ahmedabad. We design fast, secure, SEO-optimized corporate websites and custom portals that scale your business."
        keywords="custom website development Ahmedabad, corporate web design agency, headless CMS developers, high converting landing page creation, Shopify custom themes"
        path="/services/website-development"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Website Development Services",
            "description": "Premium custom web development services in Ahmedabad. We design fast, secure, SEO-optimized corporate websites and custom portals that scale your business.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ScaleXWeb Solutions",
              "url": "https://scalexweb.tech"
            },
            "areaServed": "IN"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://scalexweb.tech"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Website Development",
                "item": "https://scalexweb.tech/services/website-development"
              }
            ]
          }
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background styling - specific to web dev */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[550px] h-[550px] bg-primary/12 -top-40 -left-20 animate-pulse-glow" />

        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-muted-foreground">Services</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80 font-medium">Website Development</span>
              </nav>
              <div className="pill-badge mb-6"><Globe className="w-3.5 h-3.5" />Web Design &amp; Development</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Websites That Load Instantly.</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Built to Convert.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                From fast-loading landing pages to high-performance corporate platforms — we engineer clean, custom code architectures that drive real-world business results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href="#quote-form">Get a Custom Quote <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <a href="#capabilities" className="px-6 py-3 rounded-xl border border-border/50 text-sm font-semibold hover:bg-muted/50 text-foreground flex items-center justify-center">Explore Core Tech</a>
              </div>
            </motion.div>

            {/* Right: Mockup Image */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex justify-center">
              <img src={websiteMockup} alt="Website Development Mockup" className="w-full max-w-[500px] h-auto object-contain rounded-xl border border-border bg-card shadow-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Services Grid ───────────────────────────── */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Offerings</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">Custom Web Solutions</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Built From Scratch.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We do not use generic, slow template setups. We analyze your requirements and write custom web solutions designed for high performance.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {webServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div key={svc.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-7 group hover:border-primary/30 transition-all duration-300">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-2.5">{svc.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Performance & Design Benefits ────────────── */}
      <section className="section-padding bg-secondary/20">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Quality First</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">How Custom Code Differs</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">From Templates.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Most template engines insert massive, unused libraries, code packages, and styling files, making your website crawl and dropping your conversions by up to 40%. We code clean HTML, CSS, React, and TypeScript directly to guarantee quick interaction speeds.
              </p>

              <div className="space-y-4">
                {benefits.map(b => (
                  <div key={b.title} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-foreground text-sm mb-1">{b.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Technical stats table */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl overflow-hidden p-6 md:p-8">
                <h3 className="font-heading font-bold text-lg text-foreground mb-6">Technical Comparison</h3>
                <div className="space-y-4">
                  {comparisons.map((c, i) => (
                    <div key={c.feature} className="pb-4 border-b border-border/40 last:border-none last:pb-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{c.feature}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">ScaleXWeb Code</div>
                          <div className="text-xs font-semibold text-primary">{c.custom}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">Template Builders</div>
                          <div className="text-xs font-semibold text-foreground/60">{c.template}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Tech Stack Showcase ─────────────────────── */}
      <section id="capabilities" className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Modular Stack</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">Modern Technologies</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">We Work With.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We select frameworks that load rapidly and offer high reliability for enterprise scaling.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { cat: "Frontend UI", items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Framer Motion"], color: "border-primary/20 bg-primary/5 text-primary" },
              { cat: "Backend API", items: ["Node.js", "Express.js", "Python / Django", "Laravel / PHP", "GraphQL", "RESTful APIs"], color: "border-accent/20 bg-accent/5 text-accent" },
              { cat: "Databases & Storage", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis Cache", "Supabase", "Prisma ORM"], color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
              { cat: "Hosting & DevOps", items: ["AWS Cloud", "Docker Containers", "Vercel / Netlify", "GitHub Actions", "Cloudflare DNS", "CI/CD Pipelines"], color: "border-warning/20 bg-warning/5 text-warning" }
            ].map((st, i) => (
              <motion.div key={st.cat} {...stagger(i)} className="border border-border bg-card rounded-xl p-6">
                <h3 className="font-heading font-bold text-sm text-foreground mb-4 uppercase tracking-wider">{st.cat}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {st.items.map(item => (
                    <span key={item} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${st.color}`}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Project Quote Form ──────────────────────── */}
      <section id="quote-form" className="section-padding bg-secondary/30 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <div className="pill-badge mb-6"><Award className="w-3.5 h-3.5" />Award-Winning Delivery</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Start Your Web</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Project Today.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Fill in the design brief and describe your specific requirements. We will organize a discovery meeting to plan out wireframes, scope details, and budget estimates.
              </p>
              <div className="space-y-4">
                {[
                  "Complete IP ownership (you own the code)",
                  "90 days post-launch support and debugging warranty",
                  "Fast milestone-based delivery updates",
                  "Direct integration with payment systems & custom databases"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl p-8 md:p-10">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Request Web Estimate</h3>
                <p className="text-xs text-muted-foreground mb-6">Describe features (pages, backend portals, Shopify etc.)</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="webdev-contact-form">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Name</label>
                      <Input {...register("name")} placeholder="Your Name" className="bg-background/60 border-border/50 rounded-xl" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Email</label>
                      <Input {...register("email")} type="email" placeholder="you@company.com" className="bg-background/60 border-border/50 rounded-xl" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Phone Number</label>
                    <Input {...register("phone")} placeholder="+91 XXXXX XXXXX" className="bg-background/60 border-border/50 rounded-xl" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Requirement Description</label>
                    <Textarea {...register("requirement")} placeholder="Describe the layout, pages, and any custom features needed..." rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
                    {errors.requirement && <p className="text-xs text-destructive mt-1">{errors.requirement.message}</p>}
                  </div>
                  <Button type="submit" variant="hero" className="w-full gap-2 h-11" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />{isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ Accordion ────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
              <span className="font-heading font-extrabold text-foreground block">Web Development</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">FAQs.</span>
            </h2>
            <p className="text-muted-foreground text-sm">Answers to common questions about budget, timeline, and tech specs.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="border border-border bg-card rounded-xl overflow-hidden group">
                <summary className="px-6 py-4 font-semibold text-sm text-foreground/90 flex items-center justify-between cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 pt-2 text-xs text-muted-foreground border-t border-border/30 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebsiteDevelopment;
