import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

interface ServiceSection {
  title: string;
  description: string;
  bullets?: string[];
}

interface ServicePageProps {
  breadcrumbName: string;
  path: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
  serviceName?: string;
  sections: ServiceSection[];
  processSteps: { title: string; desc: string }[];
  techStack: Record<string, string[]>;
  ctaHeadline: string;
  ctaSubheadline: string;
}

const ServicePageTemplate = ({
  breadcrumbName, path, headline, subheadline, ctaText,
  seoTitle, seoDescription, serviceName,
  sections, processSteps, techStack, ctaHeadline, ctaSubheadline,
}: ServicePageProps) => (
  <Layout>
    <SEO
      title={seoTitle}
      description={seoDescription}
      path={path}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceName || breadcrumbName,
        "provider": { "@type": "Organization", "name": "ScaleXWeb Solution", "url": "https://scalexweb.lovable.app" },
        "areaServed": "Worldwide",
        "url": `https://scalexweb.lovable.app${path}`,
        "description": seoDescription,
      }}
    />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services/website-development" }, { name: breadcrumbName, path }]}
      headline={headline}
      subheadline={subheadline}
      ctaText={ctaText}
      ctaLink="/contact"
    />


    {/* Content Sections */}
    {sections.map((section, i) => (
      <section key={i} className={`section-padding ${i % 2 === 0 ? "bg-background" : "bg-secondary/50"}`}>
        <div className="container-tight">
          <motion.div {...fadeUp} className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">{section.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{section.description}</p>
            {section.bullets && (
              <ul className="space-y-2">
                {section.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full gradient-primary mt-2 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </section>
    ))}

    {/* Process */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Our Proven Process</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <motion.div key={step.title} {...stagger} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm mb-4">
                {i + 1}
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="section-padding bg-navy">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Technology Stack</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div key={category} {...stagger} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-primary-foreground mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs bg-primary-foreground/10 text-primary-foreground/80">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <SectionCTA
      headline={ctaHeadline}
      subheadline={ctaSubheadline}
      primaryCTA="Start Your Project"
      primaryLink="/contact"
      secondaryCTA="View Our Portfolio"
      secondaryLink="/solutions"
    />
  </Layout>
);

export default ServicePageTemplate;
