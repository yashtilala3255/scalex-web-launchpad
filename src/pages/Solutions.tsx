import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe, Smartphone, Cloud, ShoppingCart, Palette, Building2,
  AlertTriangle, CheckCircle, Clock, DollarSign, Layers, Shield, Users, BarChart3,
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const challenges = [
  { challenge: "Outdated website hurting credibility", solution: "Modern, fast, conversion-optimized website" },
  { challenge: "Manual processes costing time and money", solution: "Custom automation portal or ERP integration" },
  { challenge: "No mobile presence", solution: "Cross-platform mobile application" },
  { challenge: "Failed SaaS product idea", solution: "Validated MVP with scalable architecture" },
  { challenge: "Low online sales", solution: "High-converting e-commerce store with SEO & UX optimization" },
  { challenge: "Poor user experience driving churn", solution: "UX audit + redesign" },
];

const categories = [
  { icon: Globe, name: "Website Solutions", desc: "Modern, responsive websites that convert visitors into customers." },
  { icon: Smartphone, name: "Application Solutions", desc: "Native and cross-platform apps for iOS, Android, and web." },
  { icon: Cloud, name: "SaaS & Platform Solutions", desc: "Multi-tenant SaaS platforms built for scale." },
  { icon: ShoppingCart, name: "E-Commerce Solutions", desc: "End-to-end online stores with payment and inventory." },
  { icon: Building2, name: "Industry-Specific Solutions", desc: "Tailored solutions for healthcare, education, fintech, and more." },
  { icon: Palette, name: "Custom Enterprise Solutions", desc: "Enterprise portals, ERPs, and custom dashboards." },
];

const benefits = [
  { icon: Clock, name: "Reduced Time-to-Market" },
  { icon: DollarSign, name: "Lower Development Costs" },
  { icon: Layers, name: "Scalable from Day 1" },
  { icon: Shield, name: "Secure by Design" },
  { icon: Users, name: "User-Centric" },
  { icon: BarChart3, name: "Data-Driven Decisions" },
];

const caseStudies = [
  { industry: "E-Commerce", challenge: "Low conversion rates on existing store.", solution: "Rebuilt with optimized UX, fast checkout, and mobile-first design.", result: "[METRIC — TO BE CONFIRMED]" },
  { industry: "SaaS Startup", challenge: "Needed to validate MVP and reach first 1,000 users.", solution: "Built scalable MVP with auth, billing, and analytics.", result: "[METRIC — TO BE CONFIRMED]" },
  { industry: "Healthcare", challenge: "Compliance requirements + poor patient UX.", solution: "HIPAA-compliant portal with intuitive patient dashboard.", result: "[METRIC — TO BE CONFIRMED]" },
];

const Solutions = () => (
  <Layout>
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }]}
      headline="Smart Solutions for Modern Businesses"
      subheadline="We don't just write code — we solve business problems with the right technology."
      ctaText="Explore Solutions"
      ctaLink="#challenges"
    />

    {/* Challenges */}
    <section id="challenges" className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Problem → Solution</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Business Challenges We Solve</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {challenges.map((c, i) => (
            <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="w-px h-6 bg-border mx-auto" />
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-destructive/80 mb-2">{c.challenge}</p>
                <p className="text-sm font-medium text-primary">{c.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Solution Categories</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} {...stagger} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <cat.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading font-semibold text-foreground mb-2">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Benefits of Our Solutions</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <motion.div key={b.name} {...stagger} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl bg-card border border-border text-center">
              <b.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-sm font-heading font-semibold text-foreground">{b.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Case Studies */}
    <section className="section-padding bg-navy">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Real-World Use Cases</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((cs, i) => (
            <motion.div key={i} {...stagger} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{cs.industry}</span>
              <h4 className="font-heading font-semibold text-primary-foreground mt-3 mb-2">Challenge</h4>
              <p className="text-sm text-primary-foreground/70 mb-3">{cs.challenge}</p>
              <h4 className="font-heading font-semibold text-primary-foreground mb-2">Solution</h4>
              <p className="text-sm text-primary-foreground/70 mb-3">{cs.solution}</p>
              <h4 className="font-heading font-semibold text-primary-foreground mb-2">Result</h4>
              <p className="text-sm text-accent">{cs.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <SectionCTA
      headline="Ready to Build Your Solution?"
      subheadline="Book a free consultation and let's discuss how we can solve your business challenges."
      primaryCTA="Book a Free Consultation"
      primaryLink="/contact"
      secondaryCTA="View Our Services"
      secondaryLink="/services/website-development"
    />
  </Layout>
);

export default Solutions;
