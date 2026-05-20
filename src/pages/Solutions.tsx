import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Globe, Smartphone, Cloud, ShoppingCart, Building2,
  Palette, XCircle, CheckCircle, ArrowRight, ChevronDown, Check, Zap
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const challenges = [
  {
    challenge: "Outdated website hurting credibility",
    solution: "Modern, fast, conversion-optimized website",
    detail: "We rebuild older websites using high-performance code, improving Google Lighthouse speeds, user conversions, and customer trust signals."
  },
  {
    challenge: "Manual processes costing time and money",
    solution: "Custom automation portal or ERP integration",
    detail: "We build tailored web applications and portals to automate lead capture, invoicing, client ticketing, and database synchronization."
  },
  {
    challenge: "No mobile presence",
    solution: "Cross-platform mobile application",
    detail: "We engineer React Native or Flutter mobile apps allowing you to reach both iOS and Android users with a single codebase framework."
  },
  {
    challenge: "Failed SaaS product idea",
    solution: "Validated MVP with scalable architecture",
    detail: "We launch revenue-ready MVPs with Clerk auth, Stripe billing integration, and admin dashboards in under 8 weeks."
  },
  {
    challenge: "Low online sales",
    solution: "High-converting e-commerce store with SEO & UX",
    detail: "We design custom Shopify or headless storefronts focused on loading speed, single-click checkouts, and easy product filters."
  },
  {
    challenge: "Poor user experience driving churn",
    solution: "UX audit + complete redesign",
    detail: "We review your site's current heatmaps and user flow patterns to design clean, visual layouts that improve user onboarding."
  }
];

const categories = [
  { icon: Globe, name: "Website Solutions", desc: "Modern, responsive websites that convert visitors into customers." },
  { icon: Smartphone, name: "Application Solutions", desc: "Native and cross-platform apps for iOS, Android, and web." },
  { icon: Cloud, name: "SaaS & Platform Solutions", desc: "Multi-tenant SaaS platforms built for scale." },
  { icon: ShoppingCart, name: "E-Commerce Solutions", desc: "End-to-end online stores with payment and inventory." },
  { icon: Building2, name: "Industry-Specific Solutions", desc: "Tailored solutions for healthcare, education, fintech, and more." },
  { icon: Palette, name: "Custom Enterprise Solutions", desc: "Enterprise portals, ERPs, and custom dashboards." }
];

const caseStudies = [
  { industry: "E-Commerce", tag: "Revenue Growth", challenge: "Low conversion rates on existing store.", solution: "Rebuilt with optimized UX, fast checkout, and mobile-first design.", result: "Faster checkout flow drove a meaningful lift in conversion and repeat purchases." },
  { industry: "SaaS Startup", tag: "MVP Launch", challenge: "Needed to validate MVP and reach first 1,000 users.", solution: "Built scalable MVP with auth, billing, and analytics.", result: "Shipped production-ready MVP in weeks, helping land early customers and close seed round." },
  { industry: "Healthcare", tag: "Compliance", challenge: "Compliance requirements + poor patient UX.", solution: "HIPAA-compliant portal with intuitive patient dashboard.", result: "Delivered compliant portal with cleaner dashboard, reducing support tickets by 40." }
];

/* ─── Animations ─────────────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 }
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.08, duration: 0.45 }
});

export default function Solutions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Layout>
      <SEO
        title="Solutions | ScaleXWeb — Smart Solutions for Modern Businesses"
        description="From outdated websites to complex SaaS platforms, ScaleXWeb solves your business challenges with the right technology. Explore our solution categories and real-world impact."
      />

      <PageHero
        badge="Solutions"
        headline="Smart Solutions for Modern Businesses"
        subheadline="We don't just write code — we solve business problems with the right technology."
      />

      {/* ── 1. Interactive Problem → Solution Accordion ──── */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Background design dots */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container-tight relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">Problem → Solution</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Business Challenges <span className="gradient-text">We Solve</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
              Select a common business hurdle below to see how our engineering team delivers structural solutions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Challenge List Accordion */}
            <div className="lg:col-span-3 space-y-3">
              {challenges.map((item, i) => (
                <div
                  key={i}
                  className={`gradient-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${openIndex === i ? "bg-card/80 border-primary/40 shadow-sm" : "bg-card/40 hover:bg-card/65 border-border/40"}`}
                  onClick={() => toggleIndex(i)}
                >
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${openIndex === i ? "bg-primary/20 text-primary" : "bg-destructive/15 text-destructive"}`}>
                        {openIndex === i ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <span className={`text-sm font-semibold leading-snug transition-colors ${openIndex === i ? "text-primary" : "text-foreground/90"}`}>{item.challenge}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${openIndex === i ? "rotate-180 text-primary" : ""}`} />
                  </div>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground border-t border-border/20 leading-relaxed">
                          <p className="font-semibold text-foreground/80 mb-2">Mapped Solution: <span className="text-primary font-bold">{item.solution}</span></p>
                          <p>{item.detail}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Summary Graphic Visual */}
            <div className="lg:col-span-2">
              <div className="gradient-border bg-card rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[360px] glow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs uppercase font-bold text-muted-foreground">Architect Strategy</span>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-heading font-bold text-foreground">Custom-Built Code Engine</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We map your functional business specs directly into code. Every product we build undergoes rigorous speed testing, database security protocols, and visual QA checkups.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      "Complete code hand-off at completion",
                      "Database columns securely optimized",
                      "Google SEO guidelines followed",
                      "Responsive UI mobile interfaces"
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-foreground/90 font-medium">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border/30">
                  <a href="/contact"><Button variant="hero" className="w-full h-10 text-xs">Request Discovery Call</Button></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Solution Categories ──────────────────────── */}
      <section className="section-padding bg-secondary/35 border-y border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">What We Offer</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Our <span className="gradient-text">Solution Categories</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={i}
                  {...stagger(i)}
                  className="gradient-border rounded-2xl p-6 bg-card group hover:glow-sm transition-all duration-500"
                >
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:glow-sm transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...fadeUp} className="text-center mt-12">
            <Button variant="glow" asChild>
              <Link to="/services/website-development">
                Explore All Services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Case Studies ────────────────────────────── */}
      <section className="section-padding bg-slate-950 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb w-96 h-96 bg-primary/10 -top-32 -left-32 absolute" />
        <div className="orb w-72 h-72 bg-accent/10 -bottom-20 -right-20 absolute" />

        <div className="container-tight relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">Case Studies</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Real-World <span className="gradient-text">Impact</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
              We measure success by the outcomes we help clients achieve — not just the code we ship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                {...stagger(i)}
                className="glass rounded-2xl p-7 border border-white/10 flex flex-col gap-5 group hover:border-primary/30 transition-all duration-500"
              >
                {/* Industry badge */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="pill-badge text-xs">{cs.industry}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">
                    {cs.tag}
                  </span>
                </div>

                {/* Challenge */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Challenge
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {cs.challenge}
                  </p>
                </div>

                {/* Solution */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Solution
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {cs.solution}
                  </p>
                </div>

                {/* Result */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                    Result
                  </p>
                  <p className="text-xs text-primary/90 font-medium leading-relaxed">
                    {cs.result}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionCTA />
    </Layout>
  );
}
