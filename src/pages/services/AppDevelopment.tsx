import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Smartphone, Code, Cpu, Shield, Zap, RefreshCw,
  Bell, ChevronDown, Check, Send, MessageSquare, AppWindow, ArrowRight
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const appFeatures = [
  { icon: Shield, title: "Biometric Security", desc: "Native FaceID and Fingerprint API integrations for bulletproof authentication." },
  { icon: Bell, title: "Push Notifications", desc: "Targeted push notifications via Firebase Cloud Messaging (FCM) to drive user retention." },
  { icon: RefreshCw, title: "Offline-First Syncing", desc: "Data caching and sync capabilities using SQLite/WatermelonDB for uninterrupted offline usage." },
  { icon: Cpu, title: "Device Sensor Access", desc: "Smooth access to native APIs: Camera, Bluetooth, GPS/Location, and Accelerometer." }
];

const mobileServices = [
  { title: "React Native Development", desc: "Cross-platform app development delivering native look and feel on both iOS and Android with single codebase efficiency." },
  { title: "Flutter Application Development", desc: "Sleek, high-performance hybrid applications built with Google's canvas render framework for pixel-perfect UI execution." },
  { title: "Native iOS Applications", desc: "Custom iPhone and iPad products built using Swift and SwiftUI, fully aligned with Apple Human Interface Guidelines." },
  { title: "Native Android Applications", desc: "Reliable Kotlin apps optimized for Android devices, ensuring performance across diverse vendor hardware specs." }
];

const steps = [
  { title: "Wireframes & Mapping", desc: "Structuring user onboarding flows, interface maps, and clickable interactive prototypes." },
  { title: "UI/UX Styling", desc: "High-fidelity mockups designed for mobile gesture accessibility, thumb zones, and dark system preferences." },
  { title: "Agile Development", desc: "Agile sprints deploying React Native / Flutter components with regular builds hosted on TestFlight & App Center." },
  { title: "App Store Publishing", desc: "Full metadata set up, icon styling, submission, and compliance management on Google Play and Apple App Stores." }
];

const faqs = [
  { q: "Do you build cross-platform apps or native apps?", a: "We build both. For most startups and businesses, we recommend cross-platform frameworks like React Native or Flutter because they cut development time and budget in half by using a single codebase while delivering native performance. For hardware-intensive apps, we build natively in Swift and Kotlin." },
  { q: "How long does it take to publish an app?", a: "App development usually takes 6 to 12 weeks. Apple's review process takes 1-3 business days, while Google's Play Store review takes between 3-7 days." },
  { q: "Can the app operate without internet connectivity?", a: "Yes. We can design an offline-first architecture. The application saves data locally in an encrypted database (like SQLite or Realm) and automatically syncs it to the cloud server when connectivity is restored." },
  { q: "How do you handle post-launch application updates?", a: "We provide monthly maintenance services to monitor app performance, fix system bugs, and ensure the app remains compatible with new iOS and Android OS releases." }
];

/* ─── Contact Form Validation ───────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your app concept (min 15 chars)"),
});
type LeadData = z.infer<typeof leadSchema>;

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

/* ─── Interactive Mobile Simulator Component ───────── */
const MobileSimulator = () => {
  const [activeScreen, setActiveScreen] = useState("dashboard");

  return (
    <div className="w-[300px] h-[600px] rounded-[42px] border-[10px] border-card bg-slate-950 p-3 shadow-2xl relative flex flex-col justify-between overflow-hidden outline outline-2 outline-border/20 mx-auto">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-card rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-black rounded-full mb-1" />
      </div>

      {/* Screen Content */}
      <div className="flex-1 rounded-[28px] overflow-hidden bg-background relative p-4 pt-8 flex flex-col justify-between">
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeScreen === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">Welcome back,</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-success" />
                </div>
                <h5 className="text-sm font-bold text-foreground">Yash Patel</h5>

                {/* Micro Wallet */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                  <span className="text-[9px] uppercase opacity-75">Available Balance</span>
                  <div className="text-xl font-bold font-heading mt-1">$45,210.89</div>
                  <div className="text-[8px] opacity-75 mt-3">•••• 4589</div>
                </div>

                {/* Small Chart Mockup */}
                <div className="p-3 border border-border/40 rounded-xl bg-card/60">
                  <span className="text-[9px] text-muted-foreground block mb-2">Weekly Activity</span>
                  <div className="flex items-end gap-2.5 h-14 pt-2 justify-between">
                    {[35, 60, 45, 80, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-secondary rounded-t-sm relative group overflow-hidden h-full">
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeScreen === "chat" && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="border-b border-border/40 pb-2">
                  <h5 className="text-xs font-bold text-foreground">Design Review Chat</h5>
                </div>
                <div className="space-y-2 text-[10px] overflow-y-auto max-h-[220px]">
                  <div className="p-2 bg-secondary/60 rounded-xl max-w-[80%] text-muted-foreground">
                    Hey Yash! Is the Flutter UI ready for the dashboard review?
                  </div>
                  <div className="p-2 bg-primary text-white rounded-xl max-w-[80%] ml-auto text-right">
                    Yes, custom charting widget is fully responsive. Check build on TestFlight!
                  </div>
                  <div className="p-2 bg-secondary/60 rounded-xl max-w-[80%] text-muted-foreground">
                    Awesome, speed test is blazing fast! Testing FaceID api now.
                  </div>
                </div>
              </motion.div>
            )}

            {activeScreen === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h5 className="text-xs font-bold text-foreground mb-3">App Configuration</h5>
                <div className="space-y-2 text-[10px]">
                  {[
                    { label: "Biometric Login", status: true },
                    { label: "Push Notifications", status: true },
                    { label: "Offline Sync Mode", status: false }
                  ].map(s => (
                    <div key={s.label} className="p-2.5 border border-border/40 rounded-xl bg-card/60 flex items-center justify-between">
                      <span className="text-foreground/80">{s.label}</span>
                      <div className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${s.status ? "bg-primary" : "bg-muted"}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${s.status ? "translate-x-3" : ""}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Nav Bar */}
        <div className="mt-4 pt-2 border-t border-border/30 flex justify-around text-muted-foreground select-none relative z-10">
          {[
            { id: "dashboard", label: "Wallet", icon: AppWindow },
            { id: "chat", label: "Feeds", icon: MessageSquare },
            { id: "settings", label: "Settings", icon: Smartphone }
          ].map(btn => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveScreen(btn.id)}
                className={`flex flex-col items-center gap-0.5 text-[8px] transition-colors ${activeScreen === btn.id ? "text-primary" : "hover:text-foreground"}`}
              >
                <Icon className="w-4 h-4" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="w-24 h-1 bg-card rounded-full mx-auto mt-2" />
    </div>
  );
};

const AppDevelopment = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "Mobile App Inquiry" }) });
      if (res.ok) { toast.success("🚀 App request logged! Team will reach out within 24h."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };

  return (
    <Layout>
      <SEO
        title="Mobile App Development Services | ScaleXWeb"
        description="Hybrid and native app development for iOS & Android. We construct high-performance mobile apps with offline support, biometrics and push alerts."
        path="/services/app-development"
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background styling - specific to App Dev */}
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-radial-gradient from-accent/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[550px] h-[550px] bg-accent/12 -bottom-40 right-20 animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-muted-foreground">Services</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80 font-medium">App Development</span>
              </nav>
              <div className="pill-badge mb-6"><Smartphone className="w-3.5 h-3.5" />iOS &amp; Android Apps</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-[0.95] mb-6">
                Native App Performance.<br />Built for <span className="gradient-text">Scalability.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Whether you need a cross-platform Flutter/React Native application or a specialized native Swift/Kotlin product, we deliver sleek layouts with absolute reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href="#app-quote">Build Your App <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <a href="#features" className="px-6 py-3 rounded-xl border border-border/50 text-sm font-semibold hover:bg-muted/50 text-foreground flex items-center justify-center">Features</a>
              </div>
            </motion.div>

            {/* Right: Phone Simulator */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex justify-center">
              <MobileSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Services Grid ───────────────────────────── */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Core Expertise</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Mobile App Development <span className="gradient-text">Platforms</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We use robust frameworks to construct highly responsive apps that integrate perfectly with your backend infrastructure.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {mobileServices.map((svc, i) => (
              <motion.div key={svc.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7 flex flex-col justify-between hover:glow-sm transition-all duration-500">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground mb-3">{svc.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Features Section ────────────────────────── */}
      <section id="features" className="section-padding bg-secondary/20">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Native Capabilities <span className="gradient-text">We Support</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {appFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground text-sm mb-1">{feat.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Process Steps ───────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Roadmap</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              How We Deliver <span className="gradient-text">Your App Idea</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <motion.div key={st.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-6 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold text-primary/50">STAGE 0{i + 1}</span>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-2 mt-4">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Project Quote Form ──────────────────────── */}
      <section id="app-quote" className="section-padding bg-secondary/30 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                Launch Your Mobile <span className="gradient-text">Product</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Send us your layout ideas and system requirements. Our expert mobile architects will prepare technical scopes, security structures, and estimate timelines.
              </p>
              <div className="space-y-4">
                {[
                  "Secure biometric integration setup",
                  "Compliance with App Store review rules",
                  "Admin dashboard with user stats access",
                  "Database setups optimized for low latency"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="gradient-border bg-card rounded-3xl p-8 md:p-10 glow-sm">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Request App Estimate</h3>
                <p className="text-xs text-muted-foreground mb-6">Describe the features, screens, and desired systems.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="appdev-contact-form">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Name</label>
                      <Input {...register("name")} placeholder="Your Name" className="bg-background/60 border-border/50 rounded-xl" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Email</label>
                      <Input {...register("email")} type="email" placeholder="you@company.com" className="bg-background/60 border-border/50 rounded-xl" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Phone Number</label>
                    <Input {...register("phone")} placeholder="+91 XXXXX XXXXX" className="bg-background/60 border-border/50 rounded-xl" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Describe App Functionality</label>
                    <Textarea {...register("requirement")} placeholder="Describe what the app does (e.g. ecommerce, social chat, booking...)" rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
                    {errors.requirement && <p className="text-xs text-destructive mt-1">{errors.requirement.message}</p>}
                  </div>
                  <Button type="submit" variant="hero" className="w-full gap-2 h-11" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />{isSubmitting ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ Accordion ────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-4">
              App Development <span className="gradient-text">FAQs</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="gradient-border bg-card rounded-xl overflow-hidden group">
                <summary className="px-6 py-4 font-semibold text-sm text-foreground/90 flex items-center justify-between cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 pt-2 text-xs text-muted-foreground border-t border-border/30 leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AppDevelopment;
