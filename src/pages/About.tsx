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

/* ─── Animated Custom Company SVG Illustration ───────── */
const CompanyIllustration = () => {
  return (
    <div className="w-full relative rounded-2xl border border-border/40 bg-card/60 p-6 md:p-8 overflow-hidden glow-sm flex items-center justify-center min-h-[300px]">
      {/* Glow Orbs behind SVG */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

      <svg viewBox="0 0 400 300" className="w-full max-w-sm relative z-10 filter drop-shadow-md">
        {/* Animated Connection Lines */}
        <motion.path
          d="M 200,150 L 80,80 M 200,150 L 320,80 M 200,150 L 100,220 M 200,150 L 300,220"
          stroke="rgba(99, 102, 241, 0.25)"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Pulse flow lights */}
        <motion.circle r="3" fill="#818cf8"
          animate={{
            cx: [200, 80],
            cy: [150, 80],
            opacity: [1, 0]
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.circle r="3" fill="#a78bfa"
          animate={{
            cx: [200, 320],
            cy: [150, 80],
            opacity: [1, 0]
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle r="3" fill="#38bdf8"
          animate={{
            cx: [200, 100],
            cy: [150, 220],
            opacity: [1, 0]
          }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle r="3" fill="#f472b6"
          animate={{
            cx: [200, 300],
            cy: [150, 220],
            opacity: [1, 0]
          }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Nodes */}
        {/* Central Hub: Ahmedabad HQ */}
        <circle cx="200" cy="150" r="16" fill="url(#hqGrad)" />
        <circle cx="200" cy="150" r="24" stroke="#818cf8" strokeWidth="1" fill="none" className="animate-ping opacity-30" />
        <text x="200" y="185" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">Ahmedabad HQ</text>

        {/* Node 1: North America */}
        <circle cx="80" cy="80" r="8" fill="url(#nodeGrad)" />
        <text x="80" y="60" fill="#94a3b8" fontSize="8" fontWeight="semibold" textAnchor="middle">North America</text>

        {/* Node 2: Europe */}
        <circle cx="320" cy="80" r="8" fill="url(#nodeGrad)" />
        <text x="320" y="60" fill="#94a3b8" fontSize="8" fontWeight="semibold" textAnchor="middle">Europe</text>

        {/* Node 3: UAE */}
        <circle cx="100" cy="220" r="8" fill="url(#nodeGrad)" />
        <text x="100" y="242" fill="#94a3b8" fontSize="8" fontWeight="semibold" textAnchor="middle">Middle East</text>

        {/* Node 4: Asia Pacific */}
        <circle cx="300" cy="220" r="8" fill="url(#nodeGrad)" />
        <text x="300" y="242" fill="#94a3b8" fontSize="8" fontWeight="semibold" textAnchor="middle">Asia Pacific</text>

        {/* Gradients */}
        <defs>
          <radialGradient id="hqGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </radialGradient>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const About = () => {
  const { values, techStack, services } = useSiteData();

  return (
    <Layout>
    <SEO
      title="About ScaleXWeb — Our Digital Agency Vision"
      description="Meet ScaleXWeb Solution: an Ahmedabad-based digital agency led by Yash Patel, building scalable websites, apps, and SaaS for clients across India and globally."
      path="/about"
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
            "name": "About",
            "item": "https://scalexweb.lovable.app/about"
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

    {/* ── 1. Company Intro with SVG Map ───────────────── */}
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background radial layer specific to About */}
      <div className="absolute inset-0 bg-radial-gradient from-secondary/40 via-background to-background" />

      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Story</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
              About <span className="gradient-text">ScaleXWeb Solution</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded with a vision to bridge the gap between business ambition and technology execution, ScaleXWeb Solution has grown into a trusted digital partner for startups and enterprises alike. Headquartered in Ahmedabad, Gujarat, we combine deep technical expertise with creative design thinking.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our team of engineers, designers, and strategists works collaboratively with clients across India and globally, bringing ideas to life through innovative web and mobile solutions. We believe in building technology that scales — not just in code, but in impact.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
            <CompanyIllustration />
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── 2. Vision & Mission ────────────────────────── */}
    <section className="section-padding bg-secondary/35 border-y border-border/30">
      <div className="container-tight">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div {...fadeUp} className="gradient-border bg-card rounded-2xl p-10">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be India's most trusted digital transformation partner — empowering businesses of all sizes to compete in the digital economy with world-class technology solutions.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="gradient-primary rounded-2xl p-10 glow-sm">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-white mb-4">Our Mission</h3>
            <p className="text-white/80 leading-relaxed">
              To deliver innovative, scalable, and reliable digital products that drive measurable business outcomes — through expert engineering, design thinking, and relentless customer focus.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── 3. Founder Spotlight ────────────────────────── */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-8">Leadership</p>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center glow-sm relative overflow-hidden group">
            {/* Custom vector portrait/silhouette mockup to replace generic icons */}
            <Users className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-foreground mb-1">Yash Patel</h3>
          <p className="text-sm text-muted-foreground mb-6">Founder &amp; CEO, ScaleXWeb Solution</p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Yash Patel founded ScaleXWeb Solution with a vision to bridge the gap between business ambition and technology execution. With deep expertise in software architecture and product strategy, he leads a passionate team committed to delivering digital excellence. Under his leadership, ScaleXWeb has delivered 50+ successful projects across 10+ industries.
          </p>

          <blockquote className="gradient-border bg-card rounded-2xl p-8 text-left relative overflow-hidden mb-6">
            <p className="text-lg italic text-foreground/90 leading-relaxed relative z-10">
              &ldquo;We don't just build websites — we build growth engines for ambitious businesses.&rdquo;
            </p>
            <cite className="text-sm text-muted-foreground mt-4 block not-italic relative z-10">— Yash Patel, Founder &amp; CEO</cite>
          </blockquote>

          
        </motion.div>
      </div>
    </section>

    {/* ── 4. Values ──────────────────────────────────── */}
    <section className="section-padding bg-secondary/35 border-t border-border/30">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Values</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Principles That Drive <span className="gradient-text">Everything</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => {
            const Icon = getIconComponent(v.icon);
            return (
              <motion.div key={v.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7 text-center group hover:glow-sm transition-all duration-500">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:glow-sm transition-all">
                  <Icon className="w-6 h-6 text-white" />
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
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From concept to code, from wireframes to deployment — we handle the full lifecycle of your digital product.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((svc, i) => {
            const Icon = getIconComponent(svc.icon);
            return (
              <motion.div key={svc.name} {...stagger(i)}>
                <Link to={svc.path} className="block h-full gradient-border bg-card rounded-2xl p-6 text-center hover:glow-sm transition-all duration-500 group">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:glow-sm transition-all">
                    <Icon className="w-6 h-6 text-white" />
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
    <section className="section-padding bg-slate-950 border-t border-border/30 relative">
      {/* Grid line background overlay specific to tech stack block */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container-tight relative z-10">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Technology</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Technology <span className="gradient-text">Expertise</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div key={category} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7">
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
