import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, CheckCircle, ArrowRight } from "lucide-react";
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

/* ─── Custom Interactive SaaS Architecture Blueprint ─ */
const ArchitectureBlueprint = () => {
  return (
    <div className="w-full relative rounded-3xl border border-border/40 bg-card/60 p-6 md:p-8 overflow-hidden glow-sm flex items-center justify-center min-h-[340px]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 left-1/3 w-36 h-36 bg-primary/10 rounded-full blur-3xl" />
      
      <svg viewBox="0 0 500 350" className="w-full max-w-md relative z-10 filter drop-shadow-md">
        {/* Connection Paths */}
        {/* User to Load Balancer */}
        <path d="M 50,175 Q 150,175 150,175" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.6" />
        {/* LB to API Gateway */}
        <path d="M 210,175 Q 260,175 260,175" stroke="#818cf8" strokeWidth="2" fill="none" opacity="0.6" />
        {/* Gateway to Microservices */}
        <path d="M 320,175 Q 360,110 380,110" stroke="#a78bfa" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 320,175 Q 360,175 380,175" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M 320,175 Q 360,240 380,240" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.6" />

        {/* Pulse Animations along paths */}
        <motion.circle r="3.5" fill="#818cf8"
          animate={{ cx: [50, 150], cy: [175, 175] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
        />
        <motion.circle r="3.5" fill="#c084fc"
          animate={{ cx: [210, 260], cy: [175, 175] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.3 }}
        />
        <motion.circle r="3.5" fill="#f472b6"
          animate={{
            cx: [320, 360, 380],
            cy: [175, 110, 110]
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.6 }}
        />
        <motion.circle r="3.5" fill="#38bdf8"
          animate={{
            cx: [320, 360, 380],
            cy: [175, 240, 240]
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear", delay: 0.8 }}
        />

        {/* Nodes */}
        {/* Node: Users */}
        <rect x="10" y="145" width="50" height="60" rx="8" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
        <text x="35" y="170" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">Global</text>
        <text x="35" y="185" fill="#818cf8" fontSize="8" fontWeight="bold" textAnchor="middle">Users</text>

        {/* Node: Load Balancer */}
        <rect x="140" y="145" width="70" height="60" rx="8" fill="#0f172a" stroke="#4f46e5" strokeWidth="2" />
        <text x="175" y="170" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">Nginx</text>
        <text x="175" y="185" fill="#818cf8" fontSize="7" fontWeight="semibold" textAnchor="middle">Load Balancer</text>

        {/* Node: API Gateway */}
        <rect x="250" y="145" width="70" height="60" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
        <text x="285" y="170" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">FastAPI</text>
        <text x="285" y="185" fill="#a78bfa" fontSize="7" fontWeight="semibold" textAnchor="middle">API Gateway</text>

        {/* Microservice Node 1 */}
        <rect x="380" y="85" width="90" height="50" rx="6" fill="#020617" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="425" y="110" fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="middle">Auth &amp; Users</text>
        <text x="425" y="122" fill="#a78bfa" fontSize="6.5" fontStyle="italic" textAnchor="middle">clerk.js service</text>

        {/* Microservice Node 2 */}
        <rect x="380" y="150" width="90" height="50" rx="6" fill="#020617" stroke="#f472b6" strokeWidth="1.5" />
        <text x="425" y="175" fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="middle">Billing API</text>
        <text x="425" y="187" fill="#f472b6" fontSize="6.5" fontStyle="italic" textAnchor="middle">stripe webhooks</text>

        {/* Microservice Node 3 */}
        <rect x="380" y="215" width="90" height="50" rx="6" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="425" y="240" fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="middle">Analytics DB</text>
        <text x="425" y="252" fill="#38bdf8" fontSize="6.5" fontStyle="italic" textAnchor="middle">isolated DB schemas</text>
      </svg>
    </div>
  );
};

export default function SaasProducts() {
  const { saasArchitecture, saasFeatures, saasWhyUs } = useSiteData();
  return (
    <Layout>
      <SEO
        title="SaaS Products & Custom SaaS Development | ScaleXWeb"
        description="Proprietary SaaS offerings and custom platform development from MVP to enterprise. Multi-tenancy, microservices, billing, auth, and more — built by ScaleXWeb."
        path="/saas-products"
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
              "name": "SaaS Products",
              "item": "https://scalexweb.lovable.app/saas-products"
            }
          ]
        }}
      />

      <PageHero
        badge="SaaS Products"
        headline="Modern SaaS Products Built for Scale"
        subheadline="Proprietary SaaS offerings and custom platform development from MVP to enterprise."
      />

      {/* ── 1. Architecture Section ──────────────────────── */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-background to-background" />

        <div className="container-tight relative z-10">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">Under the Hood</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Modern SaaS <span className="gradient-text">Architecture</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Diagram */}
            <motion.div className="lg:col-span-2" {...fadeUp}>
              <ArchitectureBlueprint />
            </motion.div>

            {/* Right Details Grid */}
            <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
              {(saasArchitecture || []).map((item, i) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <motion.div
                    key={i}
                    {...stagger(i)}
                    className="gradient-border rounded-xl p-5 bg-card/60 group hover:glow-sm transition-all duration-500"
                  >
                    <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mb-3.5 group-hover:glow-sm transition-all">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-foreground mb-1.5">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Features Grid ─────────────────────────────── */}
      <section className="section-padding bg-secondary/35 border-y border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="pill-badge mb-4 inline-block">Full Feature Set</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              SaaS Features <span className="gradient-text">We Build</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
              Every building block your SaaS needs to go from concept to a product customers love — and pay for.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(saasFeatures || []).map((feat, i) => {
              const Icon = getIconComponent(feat.icon);
              return (
                <motion.div
                  key={i}
                  {...stagger(i)}
                  className="gradient-border bg-card rounded-2xl p-5 flex items-center gap-3 hover:glow-sm transition-all duration-500 group"
                >
                  <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:glow-sm transition-all">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-foreground leading-tight">
                    {feat.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Why Build SaaS with Us ────────────────────── */}
      <section className="section-padding bg-slate-950 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-accent/8 -bottom-32 -left-32 absolute" />
        <div className="orb w-64 h-64 bg-primary/10 top-10 right-10 absolute" />

        <div className="container-tight relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="pill-badge mb-4 inline-block">Why ScaleXWeb</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Why Build Your SaaS <span className="gradient-text">with Us?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {(saasWhyUs || []).map((point, i) => (
              <motion.div
                key={i}
                {...stagger(i)}
                className="relative flex flex-col"
              >
                <span className="gradient-text font-heading text-6xl font-black leading-none mb-5 select-none font-mono">
                  {point.number}
                </span>
                <div className="h-px w-12 bg-primary/40 mb-5" />
                <h3 className="font-heading font-bold text-lg text-foreground mb-3">
                  {point.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {point.body}
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Proven &amp; delivered
                </div>
              </motion.div>
            ))}
          </div>

          {/* Highlight strip */}
          <motion.div
            {...fadeUp}
            className="mt-16 glass rounded-2xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center glow-primary flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-sm">
                  Ready to go from idea to launch in weeks?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  We scope, architect, and ship — so you can focus on growth.
                </p>
              </div>
            </div>
            <Button variant="glow" asChild className="flex-shrink-0">
              <Link to="/contact">
                Start Your SaaS <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <SectionCTA headline="Have a SaaS Idea? Let's Build It Together." />
    </Layout>
  );
}
