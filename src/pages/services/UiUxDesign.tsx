import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import uiuxMockup from "@/assets/uiux_mockup.png";
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
  Palette, Eye, MousePointer, Layers, ChevronDown, Check,
  Send, ArrowRight, Sparkles, Layout as LayoutIcon,
  Award, Heart, PenTool, CheckCircle, Figma
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const designFeatures = [
  { icon: Figma, title: "Figma Component Systems", desc: "We structure clean design tokens, reusable components, and variants following auto-layout standards." },
  { icon: Sparkles, title: "Interactive Prototypes", desc: "High-fidelity clickable previews detailing transitions, hover states, and onboarding flows." },
  { icon: Layers, title: "UI Brand Assets", desc: "Cohesive color palettes, typography systems, illustration kits, and custom icon sets." },
  { icon: Eye, title: "Accessibility (WCAG)", desc: "Optimized color contrast ratios and readable font-sizing scales matching AAA compliance guidelines." }
];

const designSteps = [
  { title: "Discovery & UX Audit", desc: "Analyzing user behavior, mapping competitors, and reviewing existing product friction points." },
  { title: "Wireframes & Mapping", desc: "Constructing layout blueprints focusing on user flow efficiency and call-to-actions placement." },
  { title: "Visual Designing", desc: "Styling layout assets in Figma using typography systems, colors, and mesh gradient highlights." },
  { title: "Prototype & Hand-Off", desc: "Delivering clickable flows, CSS layout specifications, and exported SVG assets to developers." }
];

const faqs = [
  { q: "What design software do you use?", a: "We design exclusively in Figma. This allows our clients to view real-time design progress, leave comments, and gives developers direct access to CSS specs and SVG export assets." },
  { q: "What is the difference between UI and UX?", a: "UX (User Experience) focuses on how the site works, wireframes, user journeys, and structuring content to reduce friction. UI (User Interface) is the visual styling — the colors, fonts, glow effects, illustrations, and animations that make the design look premium." },
  { q: "How do we collaborate during the design phase?", a: "We share a Figma view-only link where you can watch active artboard creation and leave comments directly on specific modules. We also schedule review meetings to align on updates." },
  { q: "Do you supply the development code too?", a: "Yes. As a full-stack digital agency, we can seamlessly translate the finalized Figma UI designs into highly optimized React, Tailwind, Next.js, or HTML/CSS codebases." }
];

/* ─── Contact Form Validation ───────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your UI/UX design requirements (min 15 chars)"),
});
type LeadData = z.infer<typeof leadSchema>;

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

/* ─── Interactive Design Canvas Showcase ──────────── */
const DesignSimulator = () => {
  const [stage, setStage] = useState<"wireframe" | "styled">("styled");

  return (
    <div className="w-full relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Design Header */}
      <div className="px-4 py-3 bg-secondary/40 border-b border-border flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Figma Canvas</span>
        </div>
        <div className="flex items-center gap-1 bg-background/50 border border-border rounded-md p-0.5">
          <button
            onClick={() => setStage("wireframe")}
            className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-bold transition-all ${stage === "wireframe" ? "bg-primary text-white" : "text-muted-foreground"}`}
          >
            Wireframe
          </button>
          <button
            onClick={() => setStage("styled")}
            className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-bold transition-all ${stage === "styled" ? "bg-primary text-white" : "text-muted-foreground"}`}
          >
            UI Render
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="p-6 md:p-8 bg-background/60 min-h-[320px] flex items-center justify-center relative overflow-hidden">
        {/* Figma Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Floating Mouse Cursor Mock */}
        <div className="absolute top-[35%] right-[25%] z-20 flex items-center gap-1 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none">
          <MousePointer className="w-3.5 h-3.5 rotate-[-90deg] fill-white" />
          <span>Yash (Designer)</span>
        </div>

        <div className="w-full max-w-sm relative z-10 border border-border bg-card rounded-2xl overflow-hidden p-6 shadow-md">
          <AnimatePresence mode="wait">
            {stage === "wireframe" ? (
              <motion.div key="wire" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Wireframe Mode */}
                <div className="w-12 h-12 bg-secondary/80 border-2 border-dashed border-muted rounded-xl flex items-center justify-center text-muted-foreground text-xs font-bold font-mono">IMG</div>
                <div className="h-6 bg-secondary/80 border border-border rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-secondary/80 border border-border rounded" />
                  <div className="h-3 bg-secondary/80 border border-border rounded w-5/6" />
                </div>
                <div className="h-10 bg-secondary/80 border-2 border-dashed border-muted rounded-xl" />
              </motion.div>
            ) : (
              <motion.div key="style" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Styled Mode */}
                <div className="relative rounded-xl overflow-hidden border border-border shadow-sm">
                   <img src={uiuxMockup} alt="UI/UX Design Mockup" loading="lazy" decoding="async" width={300} height={128} className="w-full h-32 object-cover" />
                </div>
                <h5 className="text-xl font-heading font-extrabold text-foreground leading-tight">Interactive User Interfaces</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">We style high-end design assets in Figma using responsive auto-layouts, custom gradients and interactive components.</p>
                <div className="px-4 py-2.5 rounded-xl bg-primary text-white text-center font-bold text-xs shadow-sm hover:opacity-95 cursor-pointer">
                  Launch Live Demo
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const UiUxDesign = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "UI/UX Design Inquiry" }) });
      if (res.ok) { toast.success("🚀 Design project logged! Team will connect within 24h."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };

  return (
    <Layout>
      <SEO
        title="UI/UX Design Company | ScaleXWeb Ahmedabad"
        description="Premium Figma UI/UX design services. We craft structured design systems, user wireframes, interactive prototypes, and high-fidelity product layouts."
        keywords="Figma UI UX designers, premium interface design, wireframing prototyping, website user experience audit, custom brand styling, design systems builder"
        path="/services/ui-ux-design"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "UI/UX Design Services",
            "description": "Premium Figma UI/UX design services. We craft structured design systems, user wireframes, interactive prototypes, and high-fidelity product layouts.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ScaleXWeb Solutions",
              "url": "https://scalexweb.tech",
              "telephone": "+919876543210",
              "priceRange": "$$",
              "image": "https://scalexweb.tech/logo.png",
              "hasMap": "https://www.google.com/maps?q=ScaleXWeb+Solution+Ahmedabad+Gujarat+India",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Ahmedabad, Gujarat",
                "addressLocality": "Ahmedabad",
                "addressRegion": "Gujarat",
                "postalCode": "380001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 23.0225,
                "longitude": 72.5714
              }
            },
            "areaServed": "IN"
          },
          {
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
                "name": "UI/UX Design",
                "item": "https://scalexweb.tech/services/ui-ux-design"
              }
            ]
          }
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background styling - specific to UI/UX */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[550px] h-[550px] bg-primary/10 -bottom-40 right-20 animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-muted-foreground">Services</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80 font-medium">UI/UX Design</span>
              </nav>
              <div className="pill-badge mb-6"><Palette className="w-3.5 h-3.5" />Figma Interface Design</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Human-Centered.</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Visual Masterpieces.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                We craft clean design systems, mockups, and prototypes in Figma that optimize user conversion rates and align with your brand's style preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href="#quote-form">Start Design Project <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <a href="#process" className="px-6 py-3 rounded-xl border border-border/50 text-sm font-semibold hover:bg-muted/50 text-foreground flex items-center justify-center">Our Process</a>
              </div>
            </motion.div>

            {/* Right: Mockup Image */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex justify-center">
              <img src={uiuxMockup} alt="UI/UX Design Mockup" className="w-full max-w-[500px] h-auto object-contain rounded-xl border border-border bg-card shadow-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Services Grid ───────────────────────────── */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Core Assets</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">UI/UX Design</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Services.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {designFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={feat.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-7 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group">
                  <div>
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-2.5">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Design Process Steps ────────────────────── */}
      <section id="process" className="section-padding bg-secondary/20">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">UX Strategy</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">Our User Experience</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Workflow.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designSteps.map((st, i) => (
              <motion.div key={st.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-6 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold text-primary/50">STAGE 0{i + 1}</span>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-2 mt-4">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Project Quote Form ──────────────────────── */}
      <section id="quote-form" className="section-padding bg-background relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <div className="pill-badge mb-6"><Award className="w-3.5 h-3.5" />Figma Accredited</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Design Your Brand's</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Digital Presence.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Connect with our design lead. We will review branding assets, target user profiles, visual goals, and wireframe timelines.
              </p>
              <div className="space-y-4">
                {["100% vector-based layouts in Figma", "Fully documented global color & style tokens", "Access to interactive prototypes", "Direct collaboration with development team"].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl p-8 md:p-10">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Request Design Estimate</h3>
                <p className="text-xs text-muted-foreground mb-6">Describe user personas, visual directions, or custom features.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="uiux-contact-form">
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
                    <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Describe Requirements</label>
                    <Textarea {...register("requirement")} placeholder="Describe the app/website screens, reference styles, or brand specs..." rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
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

      {/* ── 5. FAQ Accordion ────────────────────────────── */}
      <section className="section-padding bg-secondary/10">
        <div className="container-tight max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
              <span className="font-heading font-extrabold text-foreground block">UI/UX Design</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">FAQs.</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="border border-border bg-card rounded-xl overflow-hidden group">
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

export default UiUxDesign;
