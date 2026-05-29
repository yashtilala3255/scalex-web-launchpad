import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  XCircle, CheckCircle, ArrowRight, ChevronDown, Check, Zap
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { getIconComponent } from "@/components/ui/icon-helper";

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
  const { challenges, solutionCategories, caseStudies } = useSiteData();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Layout>
      <SEO
        title="Solutions | ScaleXWeb — Smart Solutions for Modern Businesses"
        description="From outdated websites to complex SaaS platforms, ScaleXWeb solves your business challenges with the right technology. Explore our solution categories and real-world impact."
        keywords="business process automation, custom ERP systems, custom web portals, corporate digital transformation, clinical healthcare portals, enterprise business solutions"
        path="/solutions"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://scalexweb.lovable.app"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Solutions",
              "item": "https://scalexweb.lovable.app/solutions"
            }
          ]
        }}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
              <span className="font-heading font-extrabold text-foreground block">Business Challenges</span>
              <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">We Solve.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
              Select a common business hurdle below to see how our engineering team delivers structural solutions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Challenge List Accordion */}
            <div className="lg:col-span-3 space-y-3">
              {(challenges || []).map((item, i) => (
                <div
                  key={i}
                  className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${openIndex === i ? "border-primary bg-card/80 shadow-sm" : "border-border bg-card/40 hover:bg-card/60"}`}
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
              <div className="border border-border bg-card rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
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
            <h2 className="text-4xl md:text-5xl tracking-tight mt-3">
              <span className="font-heading font-extrabold text-foreground block">Our Strategic</span>
              <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Solution Categories.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(solutionCategories || []).map((cat, i) => {
              const Icon = getIconComponent(cat.icon);
              return (
                <motion.div
                  key={i}
                  {...stagger(i)}
                  className="border border-border rounded-xl p-6 bg-card group hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
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
            <Button variant="default" asChild>
              <Link to="/services/website-development">
                Explore All Services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Case Studies ────────────────────────────── */}
      <section className="section-padding bg-secondary/30 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="orb w-96 h-96 bg-primary/10 -top-32 -left-32 absolute" />
        <div className="orb w-72 h-72 bg-accent/10 -bottom-20 -right-20 absolute" />

        <div className="container-tight relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">Case Studies</span>
            <h2 className="text-4xl md:text-5xl tracking-tight mt-3">
              <span className="font-heading font-extrabold text-foreground block">Real-World</span>
              <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Impact &amp; Results.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
              We measure success by the outcomes we help clients achieve — not just the code we ship.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {(caseStudies || []).map((cs, i) => (
              <motion.div
                key={i}
                {...stagger(i)}
                className="border border-border bg-card rounded-xl p-7 flex flex-col gap-5 group hover:border-primary/30 transition-all duration-300 shadow-sm"
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
                <div className="mt-auto pt-4 border-t border-border/50">
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

      <SectionCTA
        headline="Ready to Build Your Custom Solution?"
        subheadline="Let's discuss your business workflow challenges and architect a scalable solution together."
        primaryCTA="Schedule a Call"
        primaryLink="/contact"
        secondaryCTA="Explore SaaS Products"
        secondaryLink="/saas-products"
      />
    </Layout>
  );
}
