import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Globe, Smartphone, Cloud, ShoppingCart,
  Palette, Shield, Lightbulb, Heart, Star, Users, Award,
  CheckCircle, Linkedin, Twitter, Sparkles
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { getIconComponent } from "@/components/ui/icon-helper";
import { HeroSection } from "@/components/ui/hero-section-2";
import { GradientCard } from "@/components/ui/gradient-card";
import logoImg from "@/assets/logo.png";

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

const About = () => {
  const { values, techStack, services, settings } = useSiteData();

  return (
    <Layout>
    <SEO
      title="About ScaleXWeb — Our Digital Agency Vision"
      description="Meet ScaleXWeb Solution: an Ahmedabad-based digital agency led by Yash Patel, building scalable websites, apps, and SaaS for clients across India and globally."
      keywords="about ScaleXWeb, Yash Patel CEO, Ahmedabad digital agency, software engineering team, custom web developers, enterprise tech stack agency, web design company India"
      path="/about"
      jsonLd={{
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
            "name": "About",
            "item": "https://scalexweb.tech/about"
          }
        ]
      }}
    />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      headline="Building the Future of Digital — One Solution at a Time."
      subheadline="Full-stack digital agency headquartered in Ahmedabad, delivering world-class digital products."
      badge="Who We Are"
      ctaText="Get in Touch"
      ctaLink="/contact"
    />

    {/* ── 1. Company Intro / Our Story using HeroSection ── */}
    <HeroSection
      logo={{
        url: logoImg,
        alt: settings?.siteName || "ScaleXWeb Solutions",
        text: settings?.siteName || "ScaleXWeb"
      }}
      slogan="OUR STORY"
      title={
        <div className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] font-normal">
          <span className="font-heading font-extrabold text-foreground block">About</span>
          <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">ScaleXWeb Solution.</span>
        </div>
      }
      subtitle="Founded with a vision to bridge the gap between business ambition and technology execution, ScaleXWeb Solution has grown into a trusted digital partner for startups and enterprises alike. Headquartered in Ahmedabad, Gujarat, we combine deep technical expertise with creative design thinking. Our team of engineers, designers, and strategists works collaboratively with clients across India and globally, bringing ideas to life through innovative web and mobile solutions. We believe in building technology that scales — not just in code, but in impact."
      callToAction={{
        text: "START YOUR PROJECT",
        href: "/contact"
      }}
      backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
      contactInfo={{
        website: settings?.siteUrl || "scalexweb.tech",
        address: settings?.contactAddress || "Ahmedabad, Gujarat, India"
      }}
      className="border-b border-border/30"
    />

    {/* ── 2. Vision & Mission ────────────────────────── */}
    <section className="section-padding bg-secondary/35 border-y border-border/30">
      <div className="container-tight">
        <div className="grid md:grid-cols-2 gap-6">
          <GradientCard
            badgeText="Vision"
            badgeColor="#8B5CF6"
            title="Our Vision"
            description="To be India's most trusted digital transformation partner — empowering businesses of all sizes to compete in the digital economy with world-class technology solutions."
            ctaText="Explore Solutions"
            ctaHref="/solutions"
            gradient="purple"
          />
          <GradientCard
            badgeText="Mission"
            badgeColor="#10B981"
            title="Our Mission"
            description="To deliver innovative, scalable, and reliable digital products that drive measurable business outcomes — through expert engineering, design thinking, and relentless customer focus."
            ctaText="Start Your Project"
            ctaHref="/contact"
            gradient="green"
          />
        </div>
      </div>
    </section>


    {/* ── 4. Values ──────────────────────────────────── */}
    <section className="section-padding bg-secondary/35 border-t border-border/30">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Values</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">Principles That</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Drive Everything.</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => {
            const Icon = getIconComponent(v.icon);
            return (
              <motion.div key={v.title} {...stagger(i)} className="border border-border rounded-xl p-7 bg-card text-center group hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── 5. Services Grid ───────────────────────────── */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">What We Do</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">What We Do</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Our Core Services.</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">From concept to code, from wireframes to deployment — we handle the full lifecycle of your digital product.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((svc, i) => {
            const Icon = getIconComponent(svc.icon);
            return (
              <motion.div key={svc.name} {...stagger(i)}>
                <Link to={svc.path} className="block h-full border border-border rounded-xl p-6 bg-card text-center hover:border-primary/30 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-heading font-semibold text-foreground">{svc.name}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── 6. Tech Stack ──────────────────────────────── */}
    <section className="section-padding bg-secondary/30 border-t border-border/30 relative">
      {/* Grid line background overlay specific to tech stack block */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container-tight relative z-10">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Technology</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">Technology</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Expertise &amp; Stacks.</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div key={category} {...stagger(i)} className="border border-border rounded-xl p-7 bg-card hover:border-primary/20 transition-all duration-300">
              <h3 className="font-heading font-semibold text-foreground mb-4 text-xs uppercase tracking-wider">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <SectionCTA headline="Ready to Work Together?" subheadline="Let's discuss how ScaleXWeb can help you achieve your digital goals." primaryCTA="Start Your Project" primaryLink="/contact" secondaryCTA="View Our Services" secondaryLink="/services/website-development" />
  </Layout>
  );
};

export default About;
