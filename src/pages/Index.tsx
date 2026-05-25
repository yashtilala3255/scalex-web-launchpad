import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import SectionCTA from "@/components/sections/SectionCTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Globe, Smartphone, Cloud, ShoppingCart, Palette,
  Heart, GraduationCap, Building2, ShoppingBag, Landmark,
  Truck, Factory, Plane, Scale, Rocket, Clock, MessageSquare,
  Layers, HeartHandshake, Target, Search, Lightbulb, PenTool,
  Code, TestTube, Send, Star, ArrowRight, CheckCircle,
  Brain, Zap, ShieldCheck, Users, Phone, Mail, User,
} from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import { getIconComponent } from "@/components/ui/icon-helper";

// ── AI Enterprise Form ──────────────────────────
const aiFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid work email"),
  phone: z.string().min(7, "Phone number is required"),
  requirement: z.string().min(20, "Please describe your requirement (min 20 chars)"),
});
type AIFormData = z.infer<typeof aiFormSchema>;

const aiPerks = [
  { icon: Brain, title: "AI-First Architecture", desc: "LLM integrations, vector search, RAG pipelines, and intelligent automation built into your core product." },
  { icon: Zap, title: "Rapid MVP Delivery", desc: "From concept to production-ready AI product in weeks, not months — without cutting corners." },
  { icon: ShieldCheck, title: "Enterprise-Grade Security", desc: "SOC 2-ready, role-based access, audit logs, and end-to-end encryption built in from day one." },
  { icon: Users, title: "Dedicated Expert Team", desc: "Your own pod of engineers, designers, and AI specialists who live and breathe your product." },
];

const AIEnterpriseForm = () => {
  const { addInquiry } = useSiteData();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AIFormData>({
    resolver: zodResolver(aiFormSchema),
  });

  const onSubmit = async (data: AIFormData) => {
    try {
      await addInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        requirement: data.requirement,
        service: "AI Enterprise Development"
      });

      const res = await fetch("https://formspree.io/f/mykdbezz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _subject: "AI Enterprise Inquiry from Homepage" }),
      });
      if (res.ok) {
        toast.success("🚀 Request received! We'll reach out within 24 hours.");
        reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 mesh-bg opacity-60" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Orbs */}
      <div className="orb w-[600px] h-[600px] bg-primary/12 -top-40 -right-40 animate-pulse-glow" />
      <div className="orb w-[400px] h-[400px] bg-accent/10 -bottom-20 -left-20 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-50" />

      <div className="relative z-10 container-tight">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow */}
            <div className="pill-badge mb-6">
              <Brain className="w-3.5 h-3.5" />
              AI-First Development
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground leading-tight mb-6">
              Ready to Build{" "}
              <span className="gradient-text">AI-First</span>{" "}
              Enterprise Software?
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Stop duct-taping AI onto legacy systems. We help ambitious companies architect intelligent, scalable enterprise platforms — where AI is the foundation, not an afterthought.
            </p>

            {/* Perks */}
            <div className="grid sm:grid-cols-2 gap-5 mb-10">
              {aiPerks.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 glow-sm">
                    <perk.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{perk.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {["Free Consultation", "Response in 24h", "No Lock-in", "NDA Available"].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">
                  <CheckCircle className="w-3 h-3" /> {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative gradient-border bg-card rounded-3xl p-8 md:p-10 glow-sm">
              {/* Card glow orb */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Start the Conversation</h3>
                <p className="text-sm text-muted-foreground">Fill in the form — our team will review and reach out within <span className="text-primary font-medium">24 business hours</span>.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="ai-enterprise-form">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" /> Your Name
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-11"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                {/* Work Email */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Work Email
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@company.com"
                    className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-11"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                  </label>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-11"
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                {/* Requirement */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Describe Your Requirement
                  </label>
                  <Textarea
                    {...register("requirement")}
                    placeholder="Tell us about your project — What problem are you solving? What features do you need? What's your timeline and scale?"
                    rows={5}
                    className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl resize-none"
                  />
                  {errors.requirement && <p className="text-xs text-destructive mt-1">{errors.requirement.message}</p>}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full gap-2 text-base h-12"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send My Requirement"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                  No spam, ever.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

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

const Index = () => {
  const {
    stats, services, industries, trustPoints,
    processSteps, testimonials, techMarqueeItems, settings
  } = useSiteData();

  if (!services || services.length < 5) return null;

  return (
    <Layout>
    <SEO
      title="ScaleXWeb Solutions — Digital Agency for Web & App Development"
      description="ScaleXWeb Solution is a premium digital agency building custom websites, mobile apps, SaaS platforms, and e-commerce stores for ambitious businesses."
      path="/"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings?.siteName || "ScaleXWeb Solutions",
          "url": "https://scalexweb.lovable.app",
          "logo": settings?.logoUrl || "https://scalexweb.lovable.app/logo.png",
          "email": settings?.contactEmail || "scalexwebsolution@gmail.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ahmedabad",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
          },
          "sameAs": [
            settings?.socialLinkedin || "https://www.linkedin.com/company/scale-x-web-solution/",
            settings?.socialTwitter || "https://x.com/ScaleXWeb",
            settings?.socialInstagram || "https://www.instagram.com/scalexwebsolution/"
          ].filter(Boolean)
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": settings?.siteName || "ScaleXWeb Solutions",
          "url": "https://scalexweb.lovable.app"
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": settings?.siteName || "ScaleXWeb Solutions",
          "image": settings?.logoUrl || "https://scalexweb.lovable.app/logo.png",
          "@id": "https://scalexweb.lovable.app/#localbusiness",
          "url": "https://scalexweb.lovable.app",
          "telephone": settings?.contactPhone || "+919876543210",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": settings?.contactAddress || "Ahmedabad, Gujarat",
            "addressLocality": "Ahmedabad",
            "addressRegion": "Gujarat",
            "postalCode": "380001",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 23.0225,
            "longitude": 72.5714
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        }
      ]}
    />

    {/* ── Hero ──────────────────────────────────────── */}
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/70" />
      {/* Mesh + dot grid on top */}
      <div className="absolute inset-0 mesh-bg opacity-80" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] bg-primary/15 -top-40 -left-40 animate-pulse-glow" />
      <div className="orb w-[450px] h-[450px] bg-accent/12 -bottom-20 right-0 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-70" />

      <div className="container-tight relative z-10 pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill-badge mb-8 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Trusted by 30+ businesses across India &amp; globally
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl md:text-8xl font-heading font-extrabold leading-[0.9] tracking-tight mb-6 max-w-5xl"
        >
          Scale Smarter.
          <br />
          <span className="gradient-text">Build Better.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          ScaleXWeb Solution builds custom websites, applications, SaaS platforms, and e-commerce solutions that drive real business growth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Button variant="hero" size="lg" className="gap-2 text-base px-8" asChild>
            <Link to="/contact">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 border-border/50 hover:bg-muted/40" asChild>
            <a href="#services">
              Explore Services
            </a>
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap gap-8 md:gap-12"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-heading font-extrabold gradient-text">{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Tech Marquee ─────────────────────────────── */}
    <div className="border-y border-border/40 bg-card/50 py-5">
      <div className="marquee">
        <div className="marquee-inner gap-10 px-5">
          {[...techMarqueeItems, ...techMarqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full gradient-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* ── About Snippet ────────────────────────────── */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">About ScaleXWeb</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
              Digital Solutions for <br />
              <span className="gradient-text">Modern Businesses</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ScaleXWeb Solution is a full-service digital agency headquartered in Ahmedabad, India. We specialize in building custom digital products that drive real business growth — from responsive websites to complex SaaS platforms.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 mb-8">
              {[
                { title: "Tailored Solutions", desc: "Custom-built for your unique needs" },
                { title: "End-to-End Delivery", desc: "From concept to launch and beyond" },
                { title: "Scalable Architecture", desc: "Built to grow with your business" },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-primary/40 pl-4">
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-200">
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right: Stats Grid */}
          <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((s, i) => (
                <div
                  key={s.label}
                  className={`p-8 rounded-2xl text-center ${
                    i % 2 === 0
                      ? "gradient-primary glow-sm"
                      : "gradient-border bg-card"
                  }`}
                >
                  <div className={`text-4xl font-heading font-extrabold mb-2 ${i % 2 === 0 ? "text-white" : "gradient-text"}`}>{s.value}</div>
                  <div className={`text-sm ${i % 2 === 0 ? "text-white/70" : "text-muted-foreground"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Services Bento Grid ───────────────────────── */}
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Solutions That <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From concept to code — end-to-end digital solutions tailored to your business goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured - Website Dev */}
          <motion.div
            {...stagger}
            transition={{ delay: 0 }}
            className="md:col-span-2 gradient-border rounded-2xl p-8 md:p-10 bg-card group hover:glow-sm transition-all duration-500"
          >
            {(() => {
              const Icon = getIconComponent(services[0]?.icon);
              return (
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:glow-primary transition-all duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
              );
            })()}
            <h3 className="text-2xl font-heading font-bold text-foreground mb-3">{services[0].name}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">{services[0].desc} Every project is tailored to convert visitors into paying customers.</p>
            <ul className="space-y-2.5 mb-8">
              {services[0].bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <Link to={services[0].path} className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all duration-200">
              Explore Service <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* App Dev */}
          <motion.div {...stagger} transition={{ delay: 0.1 }} className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500">
            {(() => {
              const Icon = getIconComponent(services[1]?.icon);
              return (
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })()}
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">{services[1].name}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{services[1].desc}</p>
            <Link to={services[1].path} className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* SaaS Dev */}
          <motion.div {...stagger} transition={{ delay: 0.2 }} className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500">
            {(() => {
              const Icon = getIconComponent(services[2]?.icon);
              return (
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })()}
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">{services[2].name}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{services[2].desc}</p>
            <Link to={services[2].path} className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* E-Commerce */}
          <motion.div {...stagger} transition={{ delay: 0.3 }} className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500">
            {(() => {
              const Icon = getIconComponent(services[3]?.icon);
              return (
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })()}
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">{services[3].name}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{services[3].desc}</p>
            <Link to={services[3].path} className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* UI/UX card */}
          <motion.div {...stagger} transition={{ delay: 0.35 }} className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500">
            {(() => {
              const Icon = getIconComponent(services[4]?.icon);
              return (
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              );
            })()}
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">{services[4].name}</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{services[4].desc}</p>
            <Link to={services[4].path} className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Full Stack Development */}
          {services[5] && (
            <motion.div {...stagger} transition={{ delay: 0.38 }} className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500">
              {(() => {
                const Icon = getIconComponent(services[5]?.icon);
                return (
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                );
              })()}
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">{services[5].name}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{services[5].desc}</p>
              <Link to={services[5].path} className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold group-hover:gap-2.5 transition-all">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}

          {/* CTA card */}
          <motion.div {...stagger} transition={{ delay: 0.4 }} className={`gradient-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:glow-primary transition-all duration-500 cursor-pointer text-center md:text-left ${services[5] ? "md:col-span-2" : ""}`}>
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-1">Ready to Scale Your Business?</h3>
                <p className="text-sm text-white/80">Get a free consultation and project plan.</p>
              </div>
            </div>
            <Button variant="hero-outline" size="sm" className="gap-1.5 bg-white text-primary hover:bg-white/95 border-none shadow-lg px-6 py-2.5 flex-shrink-0" asChild>
              <Link to="/contact">
                Get Free Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Industries Marquee ───────────────────────── */}
    <section className="section-padding bg-navy overflow-hidden">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Industries</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Built for Your <span className="gradient-text">Industry</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We deliver tailored solutions across diverse industries, understanding the unique challenges each sector faces.
          </p>
        </motion.div>
      </div>

      {/* Row 1 */}
      <div className="marquee py-3 mb-3">
        <div className="marquee-inner gap-4 px-2">
          {[...industries, ...industries].map((ind, i) => {
            const Icon = getIconComponent(ind.icon);
            return (
              <div key={i} className="glass rounded-full px-5 py-3 flex items-center gap-3 whitespace-nowrap flex-shrink-0">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground/80">{ind.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2 — reverse */}
      <div className="marquee py-3">
        <div className="marquee-inner gap-4 px-2" style={{ animationDirection: "reverse" }}>
          {[...industries, ...industries].map((ind, i) => {
            const Icon = getIconComponent(ind.icon);
            return (
              <div key={i} className="glass-light rounded-full px-5 py-3 flex items-center gap-3 whitespace-nowrap flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/60">{ind.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Why Trust Us ─────────────────────────────── */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Why 30+ Businesses Choose{" "}
            <span className="gradient-text">ScaleXWeb</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustPoints.map((tp, i) => {
            const Icon = getIconComponent(tp.icon);
            return (
              <motion.div
                key={tp.title}
                {...stagger}
                transition={{ delay: i * 0.08 }}
                className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{tp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tp.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Process ──────────────────────────────────── */}
    <section className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Process</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            From Strategy to <span className="gradient-text">Launch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A proven, repeatable process that delivers quality on time, every time.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processSteps.map((step, i) => {
            const Icon = getIconComponent(step.icon);
            return (
              <motion.div
                key={step.title}
                {...stagger}
                transition={{ delay: i * 0.1 }}
                className="gradient-border rounded-2xl p-7 bg-card group hover:glow-sm transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0 group-hover:glow-sm transition-all">
                    {step.step}
                  </div>
                  <Icon className="w-5 h-5 text-primary/70" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Testimonials ─────────────────────────────── */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            What Our Clients <span className="gradient-text">Say</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              {...stagger}
              transition={{ delay: i * 0.1 }}
              className="gradient-border rounded-2xl p-7 bg-card flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-heading font-bold text-xs flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── AI Enterprise Form ───────────────────────── */}
    <AIEnterpriseForm />

    {/* ── CTA ──────────────────────────────────────── */}
    <SectionCTA
      headline="Ready to Build Something Amazing?"
      subheadline="Free consultation, no commitment. Let's discuss your project today."
      primaryCTA="Start Your Project"
      primaryLink="/contact"
      secondaryCTA="View Our Services"
      secondaryLink="/services/website-development"
    />
  </Layout>
  );
};

export default Index;
