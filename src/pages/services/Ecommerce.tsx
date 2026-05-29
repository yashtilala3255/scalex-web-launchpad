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
  ShoppingCart, Shield, CreditCard, ChevronDown, Check,
  Send, ArrowRight, Zap, RefreshCw,
  Gift, Heart, Star, ShoppingBag, Plus, Trash2, Award
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const ecommerceFeatures = [
  { icon: Zap, title: "Blazing Fast Checkout", desc: "Reduce cart abandonment with a 1-click checkout flow optimized for mobile buyers." },
  { icon: CreditCard, title: "Secure Payment Routing", desc: "Integrations with Stripe, Razorpay, PayPal, and PayU, support EMI, UPI, and wallets." },
  { icon: RefreshCw, title: "ERP & Inventory Sync", desc: "Real-time automated inventory updates synced directly with SAP, Tally, or custom ERP systems." },
  { icon: Gift, title: "Discounts & Referrals", desc: "Tiered coupon engines, active abandoned-cart recovery emails, and loyalty points platforms." }
];

const comparisons = [
  { feature: "Transaction Fees", custom: "0% (Only pay gateway fees)", shopify: "2% + Gateway fees (Unless using Shopify Payments)" },
  { feature: "Page Speed Score", custom: "95+ (Guaranteed fast core web vitals)", shopify: "40 - 65 (Heavily degraded by app plugins)" },
  { feature: "Checkout Controls", custom: "100% Customizable design & flow", shopify: "Locked (Limited design controls)" },
  { feature: "Database & Scaling", custom: "Scale to millions of users with SQL database", shopify: "Restricted by platform API throttle rates" }
];

const steps = [
  { title: "Store Wireframing", desc: "Optimizing conversion funnels, product listings, category filters, and checkouts." },
  { title: "Theme Customization", desc: "Developing a tailored frontend design focused on brand aesthetics and mobile UI gesture speeds." },
  { title: "Backend Systems", desc: "Structuring databases, admin panels, security tokens, and inventory endpoints." },
  { title: "API Gateway Sync", desc: "Configuring logistics providers, ERP sync scripts, SMS gateways, and payment routing." }
];

const faqs = [
  { q: "Why should we build a custom store instead of Shopify?", a: "Shopify is great to start, but as you scale, transaction fees (up to 2% extra) cut into margins, bloated apps make the site slow, and you cannot customize the checkout flow. A custom store has zero platform fees, loads under 1 second, and gives you complete control over your customer checkout journey." },
  { q: "Do you build custom Shopify or WooCommerce themes?", a: "Yes. While we build headless ecommerce setups using React/Node, we also develop lightweight, custom Shopify and WooCommerce themes that do not use heavy page builders, maintaining high page speeds." },
  { q: "Which payment gateways do you support?", a: "We support all major payment providers, including Stripe, Razorpay, Paytm, PayU, and PayPal. We also integrate COD (Cash on Delivery) validation check via OTP systems." },
  { q: "Can we connect our local store inventory ERP?", a: "Yes. We design backend automation scripts that sync with your ERP (SAP, Tally, Zoho) to update pricing and inventory counts automatically." }
];

/* ─── Contact Form Validation ───────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your E-commerce project (min 15 chars)"),
});
type LeadData = z.infer<typeof leadSchema>;

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

import ecommerceMockup from "@/assets/ecommerce_mockup.png";

/* ─── Interactive Product Catalog Showcase ────────── */
const EcomSimulator = () => {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);

  const products = [
    { id: 1, name: "Minimalist Smart Watch", price: 199, rating: 4.8 },
    { id: 2, name: "Active Noise-Cancelling Buds", price: 149, rating: 4.9 }
  ];

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  return (
    <div className="w-full relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Browser Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground text-xs">Aesthetic Store</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-muted-foreground select-none">SSL Encrypted</span>
        </div>
      </div>

      {/* Hero Banner Mockup */}
      <div className="relative h-28 overflow-hidden border-b border-border bg-slate-950">
        <img src={ecommerceMockup} alt="Ecommerce Mockup Banner" loading="lazy" decoding="async" width={600} height={112} className="w-full h-full object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent flex items-center px-6">
          <div className="space-y-0.5">
            <span className="text-[8px] bg-primary/20 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Summer Sale</span>
            <h4 className="text-sm font-heading font-black text-white">Up to 30% Off Gadgets</h4>
          </div>
        </div>
      </div>

      {/* Simulator Content */}
      <div className="p-4 bg-background/60 grid sm:grid-cols-2 gap-4 min-h-[220px]">
        {/* Products Grid */}
        <div className="space-y-2">
          <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-1">Featured Tech</h5>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="p-3 border border-border rounded-xl bg-card/60 flex items-center justify-between hover:border-primary/40 transition-colors">
                <div>
                  <div className="text-xs font-bold text-foreground">{p.name}</div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                    <span className="text-primary font-semibold">${p.price}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-yellow-500 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-yellow-500" /> {p.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="w-7 h-7 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Drawer Mock */}
        <div className="p-4 border border-border/40 rounded-xl bg-card/40 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center border-b border-border/30 pb-2 mb-3">
              <span className="text-xs font-bold text-foreground">Checkout Cart</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                {cart.reduce((a, c) => a + c.qty, 0)} Items
              </span>
            </div>

            <div className="space-y-2.5 max-h-[100px] overflow-y-auto pr-1">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-muted-foreground text-center py-4">
                    Your shopping cart is empty
                  </motion.p>
                ) : (
                  cart.map(item => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-between items-center text-xs">
                      <div className="truncate max-w-[100px]">
                        <span className="text-[10px] text-muted-foreground font-mono mr-1">{item.qty}x</span>
                        <span className="text-foreground/90 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-foreground/80">${item.price * item.qty}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-destructive/80 hover:text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3 mt-3">
            <div className="flex justify-between items-center text-xs font-bold text-foreground mb-3">
              <span>Cart Total:</span>
              <span className="text-primary font-mono">${total}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={() => { toast.success("🛒 Simulated Checkout Flow Init!"); setCart([]); }}
              className="w-full py-1.5 rounded-lg bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold text-[10px] uppercase tracking-wider transition-colors"
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Ecommerce = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "E-Commerce Inquiry" }) });
      if (res.ok) { toast.success("🚀 Store request received! Team will connect within 24h."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };

  return (
    <Layout>
      <SEO
        title="Custom E-Commerce Web Design Services | ScaleXWeb"
        description="High-converting custom E-commerce website design. We construct fast checkout funnels, payment integrations, and automated inventory sync networks."
        keywords="e-commerce website development, Shopify experts Ahmedabad, custom online stores, B2B wholesale platform, payment gateway integrations, WooCommerce theme design"
        path="/services/ecommerce"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "E-Commerce Solutions",
            "description": "High-converting custom E-commerce website design. We construct fast checkout funnels, payment integrations, and automated inventory sync networks.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "ScaleXWeb Solutions",
              "url": "https://scalexweb.tech"
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
                "name": "E-Commerce Solutions",
                "item": "https://scalexweb.tech/services/ecommerce"
              }
            ]
          }
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Background styling - specific to Ecom */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[550px] h-[550px] bg-amber-500/8 -bottom-40 left-20 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-muted-foreground">Services</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80 font-medium">E-Commerce Solutions</span>
              </nav>
              <div className="pill-badge mb-6"><ShoppingCart className="w-3.5 h-3.5" />High-Converting Stores</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Faster Page Loading.</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">More Transactions.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                We engineer customized shopping platforms built for lightning checkout speeds, zero-friction filtering, and absolute sync integrity with your backend systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href="#quote-form">Launch Your Store <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <a href="#comparison" className="px-6 py-3 rounded-xl border border-border/50 text-sm font-semibold hover:bg-muted/50 text-foreground flex items-center justify-center">Custom vs Shopify</a>
              </div>
            </motion.div>

            {/* Right: Mockup Image */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="w-full flex justify-center">
              <img src={ecommerceMockup} alt="E-Commerce Solutions Mockup" className="w-full max-w-[500px] h-auto object-contain rounded-xl border border-border bg-card shadow-sm" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. Services Grid ───────────────────────────── */}
      <section className="section-padding bg-background border-t border-border/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Offerings</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">E-Commerce Platforms</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">We Construct.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ecommerceFeatures.map((feat, i) => {
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

      {/* ── 3. Tech Stack / Comparison ─────────────────── */}
      <section id="comparison" className="section-padding bg-secondary/20">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Margins Matter</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Scale Profitably with</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Custom E-Commerce.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most template engines charge monthly licensing and transaction rates that scale as your business grows. We deliver complete project codebases allowing you to host without hidden charges and customize your user metrics freely.
              </p>
              <div className="space-y-3.5">
                {["Zero monthly platform transaction fees", "Custom cart discount coupon code logic", "Secure admin portals with real-time reports", "Optimized database structures avoiding throttling"].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-xs text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Comparison Block */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl overflow-hidden p-6 md:p-8">
                <h3 className="font-heading font-bold text-lg text-foreground mb-6">Custom vs Template Store</h3>
                <div className="space-y-4">
                  {comparisons.map(c => (
                    <div key={c.feature} className="pb-4 border-b border-border/40 last:border-none last:pb-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{c.feature}</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">ScaleXWeb Code</div>
                          <div className="text-xs font-semibold text-primary">{c.custom}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-0.5">Shopify Tiers</div>
                          <div className="text-xs font-semibold text-foreground/60">{c.shopify}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. Process Steps ───────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Our Roadmap</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5">
              <span className="font-heading font-extrabold text-foreground block">How We Deliver</span>
              <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">Your Store.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <motion.div key={st.title} {...stagger(i)} className="border border-border bg-card rounded-xl p-6 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold text-primary/50">STAGE 0{i + 1}</span>
                <h3 className="font-heading font-semibold text-sm text-foreground mb-2 mt-4">{st.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Project Quote Form ──────────────────────── */}
      <section id="quote-form" className="section-padding bg-secondary/30 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <div className="pill-badge mb-6"><Award className="w-3.5 h-3.5" />High Conversions</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">
                <span className="font-heading font-extrabold text-foreground block">Build a Stronger</span>
                <span className="font-serif italic font-normal text-primary block mt-2 ml-4 sm:ml-8">E-Commerce Brand.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Request an online discovery call. We will review layout specs, database structures, inventory integrations, and payment routing methods.
              </p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="border border-border bg-card rounded-xl p-8 md:p-10">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Request Store Estimate</h3>
                <p className="text-xs text-muted-foreground mb-6">Describe pages, expected transaction volumes, and custom features.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="ecom-contact-form">
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
                    <Textarea {...register("requirement")} placeholder="List products type, payment gateway integrations, and logistics details..." rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] mb-4">
              <span className="font-heading font-extrabold text-foreground block">E-Commerce</span>
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

export default Ecommerce;
