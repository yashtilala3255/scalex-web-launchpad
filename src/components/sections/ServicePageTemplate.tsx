import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import SectionCTA from "./SectionCTA";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Section {
  title: string;
  description: string;
  bullets?: string[];
}

interface ProcessStep {
  title: string;
  desc: string;
}

interface ServicePageTemplateProps {
  breadcrumbName: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  serviceName: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  sections: Section[];
  processSteps: ProcessStep[];
  techStack: Record<string, string[]>;
  ctaHeadline: string;
  ctaSubheadline: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const ServicePageTemplate = ({
  breadcrumbName,
  path,
  seoTitle,
  seoDescription,
  serviceName,
  headline,
  subheadline,
  ctaText,
  sections,
  processSteps,
  techStack,
  ctaHeadline,
  ctaSubheadline,
}: ServicePageTemplateProps) => (
  <Layout>
    <SEO title={seoTitle} description={seoDescription} path={path} />

    {/* Hero */}
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="orb w-[500px] h-[500px] bg-primary/15 -top-40 -left-40 animate-pulse-glow" />
      <div className="orb w-[300px] h-[300px] bg-accent/12 top-10 right-10 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-60" />

      <div className="container-tight relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <span className="text-muted-foreground">Services</span>
            <span className="opacity-40">/</span>
            <span className="text-foreground/80 font-medium">{breadcrumbName}</span>
          </nav>

          {/* Badge */}
          <div className="pill-badge mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {serviceName}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-tight mb-5 max-w-4xl">
            {headline}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">{subheadline}</p>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="gap-2">
              {ctaText} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Sections */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid gap-8 md:gap-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-8 md:p-10 bg-card"
            >
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">{section.description}</p>
              {section.bullets && (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">How We Work</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">
            Our <span className="gradient-text">Process</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.title}
              {...stagger}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-6 bg-card group hover:glow-sm transition-all duration-500"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-heading font-bold text-sm mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.2em]">Technology</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3">
            Our <span className="gradient-text">Tech Stack</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div
              key={category}
              {...stagger}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-6 bg-card"
            >
              <h3 className="font-heading font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <SectionCTA headline={ctaHeadline} subheadline={ctaSubheadline} primaryCTA={ctaText} primaryLink="/contact" secondaryCTA="View All Services" secondaryLink="/services/website-development" />
  </Layout>
);

export default ServicePageTemplate;
