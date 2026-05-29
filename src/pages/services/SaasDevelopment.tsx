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
  Cloud, Cpu, Shield, Key, ChevronDown, Check, Send,
  ArrowRight, Layers,
  Terminal, Database, BarChart3, Users, DollarSign, Activity
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const saasFeatures = [
  { icon: Layers, title: "Multi-Tenant Architecture", desc: "Isolate client databases and configure custom subdomain / custom domain mappings dynamically." },
  { icon: Shield, title: "Subscription Billing Models", desc: "Direct integration with Stripe / Razorpay to handle tiered plans, usage-based billing, and coupons." },
  { icon: Key, title: "SSO & Identity Access", desc: "Integrate SSO, OAuth login protocols (Google, Github), and secure role-based permissions." },
  { icon: Database, title: "Scale-Ready Database Design", desc: "Optimized indexing, data sharding, and caching layers to guarantee fast response times." }
];

const capabilities = [
  { title: "SaaS MVP Development", desc: "Get to market quickly. We design and build a clean, functional product focusing on core value within 4 to 8 weeks." },
  { title: "Subscription Systems", desc: "Integration of full billing APIs, coupon code logic, automated receipt systems, and invoice dashboards." },
  { title: "API Custom Development", desc: "Develop secure RESTful and GraphQL API servers that allow external applications to connect to your service." },
  { title: "Cloud Scale Scaling", desc: "Setup Docker container orchestrations, automatic load balancers, and monitoring tools to maintain high uptime." }
];

const pricingTiers = [
  { name: "Starter MVP", best: "SaaS Startups", desc: "A robust MVP to validate your concept with real users and secure funding.", features: ["Single Database Setup", "Stripe Billing Integrations", "Auth0 / Clerk Auth Setup", "Core Dashboard Layout", "4-6 Weeks Delivery"] },
  { name: "Scale SaaS", best: "Growing Products", desc: "Advanced multi-tenant platform built for enterprise clients and scaling traffic.", features: ["Multi-Tenant DB Isolation", "Custom Subdomain Setup", "Role-Based Access Management", "Interactive Analytics Dashboard", "Full API Documentation", "9-12 Weeks Delivery"] }
];

const faqs = [
  { q: "What is Multi-Tenant Architecture?", a: "Multi-tenant architecture means a single software application serves multiple distinct client organizations (tenants). Each client's data is isolated and secure, but they share the same underlying system codebase and servers. This makes the product easy to scale, maintain, and upgrade." },
  { q: "How do you handle client data security?", a: "We apply database-level isolation where each tenant has its own database schemas, or column-level tenant ID scoping. We also encrypt data at rest, enforce secure JWT or session token auth, and follow OWASP security guidelines strictly." },
  { q: "Can we migrate users from our existing legacy system?", a: "Yes. We design custom ETL (Extract, Transform, Load) data scripts to safely migrate user accounts, transaction histories, and configurations from your old system into the new SaaS platform." },
  { q: "Do you integrate third-party APIs?", a: "Yes, we handle any API integrations: payment systems (Stripe, Razorpay, PayPal), CRM systems (Salesforce, HubSpot), communications (Twilio, SendGrid), and analytic trackers (Google Analytics, Mixpanel)." }
];

/* ─── Contact Form Validation ───────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your SaaS concept (min 15 chars)"),
});
type LeadData = z.infer<typeof leadSchema>;

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

import saasMockup from "@/assets/saas_mockup.png";

/* ─── Interactive SaaS Dashboard Preview ───────────── */
const SaasPreview = () => {
  const [metricTab, setMetricTab] = useState("overview");
  const [usersCount, setUsersCount] = useState(1280);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsersCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative rounded-2xl border border-border/40 bg-card overflow-hidden glow-sm">
      {/* SaaS Admin Header */}
      <div className="px-4 py-3 bg-secondary/40 border-b border-border/40 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">SaaS Portal</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-success/15 border border-success/20 text-success text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" /> Live: {usersCount}
          </span>
        </div>
      </div>

      {/* Main SaaS Interface */}
      <div className="p-4 bg-background/60 space-y-4">
        {/* Render Mockup Image */}
        <div className="relative rounded-xl overflow-hidden border border-border/40 bg-slate-950 shadow-md">
          <img src={saasMockup} alt="SaaS Dashboard Mockup" loading="lazy" decoding="async" width={600} height={176} className="w-full h-44 object-cover object-top hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <p className="text-[11px] font-bold text-white">Multi-Tenant Management Console</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {metricTab === "overview" && (
            <motion.div key="over" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Active Tenants", val: "48", icon: Users },
                  { label: "MRR Growth", val: "+24%", icon: DollarSign },
                  { label: "API Calls", val: "1.2M", icon: Activity }
                ].map(metric => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="p-2 border border-border/40 rounded-xl bg-card/60">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-muted-foreground uppercase">{metric.label}</span>
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-base font-bold text-foreground">{metric.val}</div>
                    </div>
                  );
                })}
              </div>

              {/* Tenant Isolation Graph Mock */}
              <div className="p-4 border border-border/40 rounded-xl bg-card/40">
                <span className="text-[10px] text-muted-foreground block mb-3 font-semibold">Isolated Database Allocations</span>
                <div className="space-y-2">
                  {[
                    { name: "tenant_alpha_prod", space: 78, color: "bg-primary" },
                    { name: "tenant_beta_prod", space: 54, color: "bg-accent" },
                    { name: "tenant_gamma_prod", space: 32, color: "bg-emerald-400" }
                  ].map(ten => (
                    <div key={ten.name} className="flex items-center justify-between text-xs">
                      <span className="text-[10px] text-foreground/80 font-mono">{ten.name}</span>
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden ml-4">
                        <div className={`h-full ${ten.color}`} style={{ width: `${ten.space}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {metricTab === "billing" && (
            <motion.div key="bill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <h5 className="text-xs font-bold text-foreground mb-2">Billing Integrations</h5>
              <div className="p-3 border border-border/30 rounded-xl bg-card/60 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Webhook Status</span>
                  <span className="text-[11px] text-success font-semibold flex items-center gap-1.5 mt-0.5">
                    <Check className="w-3 h-3" /> stripe_payment_intent_succeeded
                  </span>
                </div>
                <span className="text-xs font-bold text-foreground">$149.00</span>
              </div>
              <div className="p-3 border border-border/30 rounded-xl bg-card/60 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-muted-foreground block">New subscription mapped</span>
                  <span className="text-[11px] text-foreground/80 mt-0.5">Plan: Scale Enterprise</span>
                </div>
                <span className="text-xs font-bold text-foreground">Pending Sync</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="mt-8 pt-4 border-t border-border/30 flex gap-2">
          {["overview", "billing"].map(tab => (
            <button
              key={tab}
              onClick={() => setMetricTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${metricTab === tab ? "bg-primary text-white" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SaasDevelopment = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "SaaS Dev Inquiry" }) });
      if (res.ok) { toast.success("🚀 SaaS inquiry received! We will reach out within 24h."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };

  return (
    <Layout>
      <SEO
        title="SaaS Platform Development Company | ScaleXWeb"
        description="Launch your multi-tenant SaaS application with ScaleXWeb. We design subscription architectures, custom subdomains, Stripe billing integration, and secure backends."
        keywords="SaaS software company, SaaS platform builder, multi tenant SaaS developers, build a SaaS startup MVP, Stripe billing integration"
        path="/services/saas-development"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SaaS Development Services",
            "description": "Launch your multi-tenant SaaS application with ScaleXWeb. We design subscription architectures, custom subdomains, Stripe billing integration, and secure backends.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ScaleXWeb Solutions",
              "url": "https://scalexweb.tech",
              "telephone": "+919876543210",
              "priceRange": "$$",
              "image": "https://scalexweb.tech/logo.png",
              "hasMap": "https://www.google.com/maps?q=ScaleXWeb+Solution+Ahmedabad+Gujarat+India",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ahmedabad, Gujarat",
                "addressLocality": "Ahmedabad",
                "addressRegion": "Gujarat",
                "postalCode": "380001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 23.0225,
                "longitude": 72.5714
              }
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
                "name": "SaaS Development",
                "item": "https://scalexweb.tech/services/saas-development"
              }
            ]
          }
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background styling - specific to SaaS */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-radial-gradient from-violet-500/10 via-transparent to-transparent opacity-60" />
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
                <span className="text-foreground/80 font-medium">SaaS Development</span>
              </nav>
              <div className="pill-badge mb-6"><Cloud className="w-3.5 h-3.5" />Multi-Tenant Products</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">SaaS Platforms Built</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">For Worldwide Scale.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                We design and engineer secure, multi-tenant digital platforms from the ground up, incorporating automated billing, data isolation, and user controls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href="#saas-estimate">Build Your SaaS <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <a href="#packages" className="px-6 py-3 rounded-xl border border-border/50 text-sm font-semibold hover:bg-muted/50 text-foreground flex items-center justify-center">Compare Plans</a>
              </div>
            </motion.div>

            {/* Right: Mockup Image */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex justify-center">
              <img src={saasMockup} alt="SaaS Development Mockup" className="w-full max-w-[500px] h-auto object-contain rounded-xl border border-border bg-card shadow-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Capabilities ────────────────────────────── */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Workscope</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">SaaS Development</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Solutions.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => (
              <motion.div key={cap.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-7 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-3">{cap.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Features section ────────────────────────── */}
      <section className="section-padding bg-secondary/20">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Infrastructure</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">Enterprise Features</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Ready to Launch.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {saasFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-6 flex gap-4 hover:border-primary/20 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground text-sm mb-1">{feat.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Packages Section ────────────────────────── */}
      <section id="packages" className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Pricing Models</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">Flexible Development</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Frameworks.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <motion.div key={tier.name} {...stagger(i)} className="border border-border bg-card rounded-xl p-8 relative flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-2">{tier.best}</span>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-3">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{tier.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-xs text-foreground/80">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="hero" className="w-full" asChild>
                  <a href="#saas-estimate">Get Cost Estimate</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Project Quote Form ──────────────────────── */}
      <section id="saas-estimate" className="section-padding bg-secondary/30 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Architect Your SaaS</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Product.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Send details about your SaaS concept. Our senior database engineers and system architects will prepare design briefs, structure blueprints, and pricing.
              </p>
              <div className="space-y-4">
                {["Encrypted database structure setup", "Seamless subscription mapping", "Clean, document-backed REST/GraphQL APIs", "CI/CD automated deployment structures"].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl p-8 md:p-10">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Request SaaS Estimate</h3>
                <p className="text-xs text-muted-foreground mb-6">Describe user flows, tiers, and technical details</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="saasdev-contact-form">
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
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Describe SaaS Concept</label>
                    <Textarea {...register("requirement")} placeholder="Describe the dashboard, monetization model, and tenant controls needed..." rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
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
              <span className="font-heading font-extrabold text-foreground block">SaaS Development</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">FAQs.</span>
            </h2>
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

export default SaasDevelopment;
