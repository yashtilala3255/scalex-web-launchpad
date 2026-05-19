import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Cloud, ShoppingCart, Palette, Heart, GraduationCap, Building2, ShoppingBag,
  Landmark, Truck, Factory, Plane, Scale, Rocket, Clock, MessageSquare, Layers, HeartHandshake,
  Target, Search, Lightbulb, PenTool, Code, TestTube, Send, Star, ChevronRight, ArrowRight,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const services = [
  { icon: Globe, name: "Website Development", desc: "Custom, high-performance websites built for results.", bullets: ["Responsive Design", "SEO Optimized", "Fast Loading"], path: "/services/website-development" },
  { icon: Smartphone, name: "App Development", desc: "Native and cross-platform mobile & web applications.", bullets: ["iOS & Android", "React Native", "Progressive Web Apps"], path: "/services/app-development" },
  { icon: Cloud, name: "SaaS Development", desc: "End-to-end SaaS platform architecture and development.", bullets: ["Multi-Tenancy", "Scalable APIs", "Subscription Billing"], path: "/services/saas-development" },
  { icon: ShoppingCart, name: "E-Commerce Solutions", desc: "High-converting online stores that grow your revenue.", bullets: ["Shopify & Custom", "Payment Integration", "Inventory Management"], path: "/services/ecommerce" },
  { icon: Palette, name: "UI/UX Design", desc: "Human-centered design backed by research and data.", bullets: ["User Research", "Wireframing", "Design Systems"], path: "/services/ui-ux-design" },
];

const industries = [
  { icon: Heart, name: "Healthcare" },
  { icon: GraduationCap, name: "Education & EdTech" },
  { icon: Building2, name: "Real Estate" },
  { icon: ShoppingBag, name: "Retail & E-Commerce" },
  { icon: Landmark, name: "Finance & FinTech" },
  { icon: Truck, name: "Logistics" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Plane, name: "Hospitality & Travel" },
  { icon: Scale, name: "Legal Services" },
  { icon: Rocket, name: "SaaS Startups" },
];

const trustPoints = [
  { icon: Clock, title: "On-Time Delivery", desc: "We respect deadlines as much as you do." },
  { icon: MessageSquare, title: "Transparent Communication", desc: "Weekly updates, no surprises, full visibility." },
  { icon: Layers, title: "Scalable Architecture", desc: "Built to grow with your business, not against it." },
  { icon: HeartHandshake, title: "Post-Launch Support", desc: "We don't disappear after go-live." },
  { icon: Target, title: "Agile Methodology", desc: "Iterative sprints that adapt to your evolving needs." },
  { icon: Rocket, title: "ROI-Focused", desc: "Every decision driven by business impact, not vanity metrics." },
];

const processSteps = [
  { icon: Search, title: "Discovery & Analysis", desc: "Deep-dive sessions to understand your goals." },
  { icon: Lightbulb, title: "Strategy & Planning", desc: "Roadmap, tech stack selection, project scoping." },
  { icon: PenTool, title: "UI/UX Design", desc: "Wireframes, design system, and clickable prototypes." },
  { icon: Code, title: "Development", desc: "Agile sprints, clean code, scalable architecture." },
  { icon: TestTube, title: "Testing & QA", desc: "Thorough functional, performance, and security testing." },
  { icon: Send, title: "Launch & Support", desc: "Deployment, monitoring, and growth support." },
];

const testimonials = [
  { quote: "ScaleXWeb transformed our outdated website into a modern, lead-generating machine. The results exceeded our expectations.", name: "Rajesh Patel", role: "CEO", company: "TechVentures India" },
  { quote: "Their team delivered our SaaS platform on time and within budget. The attention to detail in both design and code was remarkable.", name: "Priya Sharma", role: "CTO", company: "FinFlow Solutions" },
  { quote: "Working with ScaleXWeb felt like having an extended team. Their communication and commitment to quality are unmatched.", name: "Amit Desai", role: "Founder", company: "EduLeap" },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Industries Served" },
  { value: "98%", label: "Client Satisfaction" },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-navy/70" />
      </div>
      <div className="container-tight relative z-10 pt-24 pb-16">
        <motion.div {...fadeUp} className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary-foreground leading-tight mb-6">
            Scale Smarter.<br />
            <span className="gradient-text">Build Better.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl">
            ScaleXWeb Solution delivers custom websites, applications, SaaS platforms, and e-commerce solutions for modern businesses — from startup to enterprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/contact">
              <Button variant="hero" size="lg" className="text-base px-8">Start Your Project <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
            <a href="#services">
              <Button variant="hero-outline" size="lg" className="text-base px-8">Explore Our Services</Button>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap gap-6 md:gap-10"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{s.value}</div>
              <div className="text-xs md:text-sm text-primary-foreground/50">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* About ScaleXWeb */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">About ScaleXWeb</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Digital Solutions for <span className="gradient-text">Modern Businesses</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ScaleXWeb Solution is a full-service digital agency headquartered in Ahmedabad, India. We specialize in building custom digital products that drive real business growth — from responsive websites to complex SaaS platforms.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Tailored Solutions", desc: "Custom-built for your unique needs" },
                { title: "End-to-End Delivery", desc: "From concept to launch and beyond" },
                { title: "Scalable Architecture", desc: "Built to grow with your business" },
              ].map((item) => (
                <div key={item.title} className="text-center sm:text-left">
                  <h3 className="font-heading font-semibold text-foreground mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Learn More About Us <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((s, i) => (
                <div key={s.label} className={`p-6 rounded-2xl ${i % 2 === 0 ? "gradient-primary text-primary-foreground" : "bg-card border border-border"}`}>
                  <div className="text-3xl font-heading font-bold mb-1">{s.value}</div>
                  <div className={`text-sm ${i % 2 === 0 ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Services */}
    <section id="services" className="section-padding bg-secondary/50">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Solutions & Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">From concept to code, we deliver end-to-end digital solutions tailored to your business goals.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div key={svc.name} {...stagger} transition={{ delay: i * 0.1 }}>
              <Link
                to={svc.path}
                className="block bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <svc.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{svc.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{svc.desc}</p>
                <ul className="space-y-1.5">
                  {svc.bullets.map((b) => (
                    <li key={b} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full gradient-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Industries */}
    <section className="section-padding bg-navy">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Industries</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Industry-Ready Digital Platforms</h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto">We deliver tailored solutions across diverse industries, understanding the unique challenges each sector faces.</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map((ind, i) => (
            <motion.div key={ind.name} {...stagger} transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-4 text-center hover:bg-primary-foreground/10 transition-colors cursor-default"
            >
              <ind.icon className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-foreground/80">{ind.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Trust Us */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Why 30+ Businesses Choose ScaleXWeb</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((tp, i) => (
            <motion.div key={tp.title} {...stagger} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <tp.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading font-semibold text-foreground mb-2">{tp.title}</h3>
              <p className="text-sm text-muted-foreground">{tp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="section-padding bg-secondary/50">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Process</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">From Strategy to Launch</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <motion.div key={step.title} {...stagger} transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                  {i + 1}
                </div>
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">What Our Clients Say</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...stagger} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="gradient-primary section-padding">
      <motion.div {...fadeUp} className="container-tight text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">Ready to Build Something Amazing?</h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">Let's talk about your project. Free consultation, no commitment.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button variant="hero-outline" size="lg" className="text-base px-8">Start Your Project</Button>
          </Link>
          <Link to="/services/website-development">
            <Button variant="ghost" size="lg" className="text-primary-foreground/80 hover:text-primary-foreground text-base">View Our Services</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  </Layout>
);

export default Index;
