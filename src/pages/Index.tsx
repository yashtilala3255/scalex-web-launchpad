import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import SectionCTA from "@/components/sections/SectionCTA";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
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
  Brain, Zap, ShieldCheck, Users, Phone, Mail, User, X
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

// ── Hero Inquiry Form ────────────────────────────
const heroFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  requirement: z.string().min(15, "Please describe your requirement (min 15 chars)"),
});
type HeroFormData = z.infer<typeof heroFormSchema>;

const HeroInquiryForm = ({ onClose }: { onClose?: () => void }) => {
  const { addInquiry } = useSiteData();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<HeroFormData>({
    resolver: zodResolver(heroFormSchema),
  });

  const onSubmit = async (data: HeroFormData) => {
    try {
      await addInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        requirement: data.requirement,
        service: data.service
      });

      const res = await fetch("https://formspree.io/f/mykdbezz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _subject: `New Hero Inquiry: ${data.service}` }),
      });
      if (res.ok) {
        toast.success("🚀 Request received! Yash or team will contact you within 24 hours.");
        reset();
        if (onClose) onClose();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="relative border border-border bg-card rounded-xl p-6 sm:p-8 shadow-sm">
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors"
          aria-label="Close form"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-1">Get a Custom Proposal</h3>
        <p className="text-xs text-muted-foreground">Describe your project — we'll reply with options and estimates within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="hero-lead-form">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-foreground/80 mb-1 block">Your Name</label>
          <Input
            {...register("name")}
            placeholder="John Doe"
            className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-10 text-sm"
          />
          {errors.name && <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1 block">Work Email</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@company.com"
              className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-10 text-sm"
            />
            {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/80 mb-1 block">Phone Number</label>
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-10 text-sm"
            />
            {errors.phone && <p className="text-[11px] text-destructive mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Service dropdown */}
        <div>
          <label className="text-xs font-semibold text-foreground/80 mb-1 block">Interested In</label>
          <Select onValueChange={(v) => setValue("service", v)}>
            <SelectTrigger className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl h-10 text-sm">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Website Development">Website Development</SelectItem>
              <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
              <SelectItem value="SaaS Platform Development">SaaS Platform Development</SelectItem>
              <SelectItem value="E-Commerce Solutions">E-Commerce Solutions</SelectItem>
              <SelectItem value="UI/UX Interface Design">UI/UX Interface Design</SelectItem>
              <SelectItem value="Custom Enterprise Software">Custom Enterprise Software</SelectItem>
            </SelectContent>
          </Select>
          {errors.service && <p className="text-[11px] text-destructive mt-1">{errors.service.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-semibold text-foreground/80 mb-1 block">Describe Project & Timeline</label>
          <Textarea
            {...register("requirement")}
            placeholder="Tell us about the pages, features, timeline, etc."
            rows={3}
            className="bg-background/60 border-border/50 focus:border-primary/60 rounded-xl resize-none text-sm"
          />
          {errors.requirement && <p className="text-[11px] text-destructive mt-1">{errors.requirement.message}</p>}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full gap-2 text-sm h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold mt-2"
          disabled={isSubmitting}
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? "Sending..." : "Submit Proposal Request"}
        </Button>
      </form>
    </div>
  );
};


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
      <div className="orb w-[600px] h-[600px] bg-primary/8 -top-40 -right-40 animate-pulse-glow" />
      <div className="orb w-[400px] h-[400px] bg-accent/8 -bottom-20 -left-20 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px border-t border-border opacity-50" />

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

            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-heading font-extrabold text-foreground block">Ready to Build</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-6 sm:ml-10">AI-First Software.</span>
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
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <perk.icon className="w-5 h-5" />
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
            <div className="relative border border-border bg-card rounded-xl p-8 md:p-10">
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
                  variant="default"
                  size="lg"
                  className="w-full gap-2 text-base h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
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

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Automatically open the form popup on website load
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasClosed = sessionStorage.getItem("heroFormDismissed");
      if (!hasClosed) {
        setIsFormOpen(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    sessionStorage.setItem("heroFormDismissed", "true");
  };

  if (!services || services.length < 5) return null;

  return (
    <Layout>
    <SEO
      title="ScaleXWeb Solutions — Digital Agency for Web & App Development"
      description="ScaleXWeb Solution is a premium digital agency building custom websites, mobile apps, SaaS platforms, and e-commerce stores for ambitious businesses."
      keywords="web development agency, custom app development, SaaS solutions company, custom e-commerce stores, UI UX design Ahmedabad, web development services India, ScaleXWeb Solutions, Yash Patel Agency, digital agency Ahmedabad"
      path="/"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings?.siteName || "ScaleXWeb Solutions",
          "url": "https://scalexweb.tech",
          "logo": settings?.logoUrl || "https://scalexweb.tech/logo.png",
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
          "url": "https://scalexweb.tech"
        },
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": settings?.siteName || "ScaleXWeb Solutions",
          "image": settings?.logoUrl || "https://scalexweb.tech/logo.png",
          "@id": "https://scalexweb.tech/#localbusiness",
          "url": "https://scalexweb.tech",
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
        className="absolute inset-0 w-full h-full object-cover object-center opacity-10 dark:opacity-45"
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-background/90 dark:bg-background/70" />
      {/* Mesh + dot grid on top */}
      <div className="absolute inset-0 mesh-bg opacity-80" />
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Orbs */}
      <div className="orb w-[700px] h-[700px] bg-primary/15 -top-40 -left-40 animate-pulse-glow" />
      <div className="orb w-[450px] h-[450px] bg-accent/12 -bottom-20 right-0 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-70" />

      <div className="container-tight relative z-10 pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill-badge mb-8 w-fit font-mono uppercase tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Trusted globally &amp; across India
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.85] tracking-tight mb-8 max-w-5xl"
        >
          <span className="font-heading font-extrabold text-foreground block">Scale Smarter.</span>
          <span className="font-serif italic font-normal text-primary block mt-2 ml-8 sm:ml-16">Build Better.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          ScaleXWeb Solution builds custom websites, applications, SaaS platforms, and e-commerce solutions that drive real business growth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Button
            variant="hero"
            size="lg"
            className="gap-2 text-sm font-semibold px-8 rounded-xl h-12 shadow-sm"
            onClick={() => setIsFormOpen(true)}
          >
            Start Your Project <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="text-sm font-semibold px-8 border-border hover:bg-muted/40 rounded-xl h-12" asChild>
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
          className="grid grid-cols-2 md:flex md:flex-wrap gap-8 md:gap-14 border-t border-border pt-10 w-full"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l border-border pl-6 min-w-[120px]">
              <div className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-foreground">{s.value}</div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-2 leading-relaxed">{s.label}</div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-heading font-extrabold text-foreground block">Digital Solutions for</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Modern Businesses.</span>
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
              {stats.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="p-8 border border-border bg-card text-left flex flex-col justify-between h-full hover:border-primary/30 transition-colors"
                >
                  <div className="text-5xl font-mono font-bold tracking-tight text-foreground mb-4">{s.value}</div>
                  <div className="text-xs uppercase font-mono tracking-widest text-muted-foreground leading-snug">{s.label}</div>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">What We Do</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Services That Scale.</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From concept to code — end-to-end digital solutions tailored to your business goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured - Website Dev */}
          <motion.div
            {...stagger}
            transition={{ delay: 0 }}
            className="md:col-span-2 border border-border rounded-xl p-8 md:p-10 bg-card group hover:border-primary/30 transition-all duration-300"
          >
            {(() => {
              const Icon = getIconComponent(services[0]?.icon);
              return (
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-7 h-7" />
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
          <motion.div {...stagger} transition={{ delay: 0.1 }} className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300">
            {(() => {
              const Icon = getIconComponent(services[1]?.icon);
              return (
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
          <motion.div {...stagger} transition={{ delay: 0.2 }} className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300">
            {(() => {
              const Icon = getIconComponent(services[2]?.icon);
              return (
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
          <motion.div {...stagger} transition={{ delay: 0.3 }} className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300">
            {(() => {
              const Icon = getIconComponent(services[3]?.icon);
              return (
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
          <motion.div {...stagger} transition={{ delay: 0.35 }} className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300">
            {(() => {
              const Icon = getIconComponent(services[4]?.icon);
              return (
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
            <motion.div {...stagger} transition={{ delay: 0.38 }} className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300">
              {(() => {
                const Icon = getIconComponent(services[5]?.icon);
                return (
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
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
         
        </div>
      </div>
    </section>

    {/* ── Industries Marquee ───────────────────────── */}
    <section className="section-padding bg-navy overflow-hidden">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Industries</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">Industries We Serve</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Built for Your Domain.</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
              <div key={i} className="bg-card border border-border rounded-full px-6 py-3.5 flex items-center gap-3.5 whitespace-nowrap flex-shrink-0 shadow-[0_2px_8px_rgba(9,9,11,0.02)] hover:border-primary/30 transition-all duration-300">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground/80">{ind.name}</span>
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
              <div key={i} className="bg-card border border-border rounded-full px-6 py-3.5 flex items-center gap-3.5 whitespace-nowrap flex-shrink-0 shadow-[0_2px_8px_rgba(9,9,11,0.02)] hover:border-primary/30 transition-all duration-300">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground/80">{ind.name}</span>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">Why 30+ Businesses</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Choose ScaleXWeb.</span>
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
                className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">From Strategy</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">To Successful Launch.</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                className="border border-border rounded-xl p-7 bg-card group hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                    <Icon className="w-4 h-4" />
                  </div>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
            <span className="font-heading font-extrabold text-foreground block">What Our Clients</span>
            <span className="font-serif italic font-normal text-primary block mt-2 md:translate-x-8">Say About Us.</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              {...stagger}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl p-7 bg-card flex flex-col justify-between group hover:border-primary/30 transition-all duration-300"
            >
              <div>
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="border-l-2 border-primary/20 pl-4 mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed font-serif italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
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

    <AnimatePresence>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/40"
            onClick={handleCloseForm}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-lg"
          >
            <HeroInquiryForm onClose={handleCloseForm} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>

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
