import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe, Smartphone, Cloud, ShoppingCart, Palette, Shield, Lightbulb, Heart, Star, Linkedin,
  Users, Zap, Award, ChevronRight,
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Industries Served" },
];

const values = [
  { icon: Shield, title: "Integrity", desc: "Honest communication, ethical practices, and zero compromise on quality." },
  { icon: Lightbulb, title: "Innovation", desc: "We explore emerging tech and creative approaches to solve real problems." },
  { icon: Heart, title: "Client-First", desc: "Your success is our success. We measure our wins by your outcomes." },
  { icon: Star, title: "Excellence", desc: "Every pixel, every line of code, every interaction is crafted with care." },
];

const serviceCards = [
  { icon: Globe, name: "Website Development", path: "/services/website-development" },
  { icon: Smartphone, name: "App Development", path: "/services/app-development" },
  { icon: Cloud, name: "SaaS Development", path: "/services/saas-development" },
  { icon: ShoppingCart, name: "E-Commerce Solutions", path: "/services/ecommerce" },
  { icon: Palette, name: "UI/UX Design", path: "/services/ui-ux-design" },
];

const techStack: Record<string, string[]> = {
  Frontend: ["React.js", "Next.js", "Vue.js", "Tailwind CSS", "TypeScript"],
  Backend: ["Node.js", "Express.js", "Laravel", "Python / Django", "GraphQL"],
  Mobile: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
  "Cloud & DevOps": ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD"],
  Design: ["Figma", "Adobe XD", "Framer"],
};

const About = () => (
  <Layout>
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]}
      headline="Building the Future of Digital — One Solution at a Time."
      subheadline="ScaleXWeb Solution is a full-stack digital agency headquartered in Ahmedabad, delivering world-class digital products."
      ctaText="Get in Touch"
      ctaLink="/contact"
    />

    {/* Company Intro */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">About ScaleXWeb Solution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded with a vision to bridge the gap between business ambition and technology execution, ScaleXWeb Solution has grown into a trusted digital partner for startups and enterprises alike. Headquartered in Ahmedabad, Gujarat, we combine deep technical expertise with creative design thinking to deliver digital products that drive measurable business outcomes.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our team of engineers, designers, and strategists works collaboratively with clients across India and globally, bringing ideas to life through innovative web and mobile solutions. We believe in building technology that scales — not just in code, but in impact.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={s.label} className={`p-6 rounded-2xl text-center ${i % 2 === 0 ? "gradient-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  <div className="text-3xl font-heading font-bold mb-1">{s.value}</div>
                  <div className={`text-sm ${i % 2 === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Vision & Mission */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...fadeUp} className="p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be India's most trusted digital transformation partner — empowering businesses of all sizes to compete in the digital economy with world-class technology solutions.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="p-8 rounded-2xl gradient-primary text-primary-foreground">
            <h3 className="text-xl font-heading font-bold mb-4">Our Mission</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              To deliver innovative, scalable, and reliable digital products that drive measurable business outcomes — through expert engineering, design thinking, and relentless customer focus.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Founder */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Leadership</p>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
            <Users className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">Yash Tilala</h3>
          <p className="text-sm text-muted-foreground mb-4">Founder & CEO, ScaleXWeb Solution</p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Yash Tilala founded ScaleXWeb Solution with a vision to bridge the gap between business ambition and technology execution. With deep expertise in software architecture and product strategy, he leads a passionate team of engineers and designers committed to delivering digital excellence. Under his leadership, ScaleXWeb has delivered 50+ successful projects across 10+ industries.
          </p>
          <blockquote className="text-lg italic text-foreground/80 mb-6 border-l-4 border-primary pl-4 text-left">
            "We don't just build websites — we build growth engines for ambitious businesses."
          </blockquote>
          <a href="#" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
            <Linkedin className="w-4 h-4" /> Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>

    {/* Values */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Values</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">The Principles That Drive Everything We Do</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div key={v.title} {...stagger} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border text-center">
              <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-heading font-semibold text-foreground mb-2">{v.title}</h4>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Services Overview */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From concept to code, from wireframes to deployment — we handle the full lifecycle of your digital product.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {serviceCards.map((svc, i) => (
            <motion.div key={svc.name} {...stagger} transition={{ delay: i * 0.05 }}>
              <Link to={svc.path} className="block p-5 rounded-2xl bg-card border border-border text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <svc.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-heading font-semibold text-foreground">{svc.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="section-padding bg-navy">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Technology</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Technology Expertise</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(techStack).map(([category, techs], i) => (
            <motion.div key={category} {...stagger} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
              <h4 className="font-heading font-semibold text-primary-foreground mb-3">{category}</h4>
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
      headline="Ready to Work Together?"
      subheadline="Let's discuss how ScaleXWeb can help you achieve your digital goals."
      primaryCTA="Start Your Project"
      primaryLink="/contact"
      secondaryCTA="View Our Services"
      secondaryLink="/services/website-development"
    />
  </Layout>
);

export default About;
