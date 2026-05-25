import React, { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { Clock, Mail, Phone, Lock, Calendar, Bell, MapPin } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";
import logoImg from "@/assets/logo.png";
import { toast } from "sonner";

const ComingSoonPage = () => {
  const { settings, addInquiry } = useSiteData();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displaySiteName = settings?.siteName || "ScaleXWeb";
  const contactEmail = settings?.contactEmail || "info@scalexweb.com";
  const contactPhone = settings?.contactPhone || "+91 98765 43210";
  const contactAddress = settings?.contactAddress || "Ahmedabad, Gujarat, India";
  const launchDateTime = settings?.launchDateTime || "";

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  useEffect(() => {
    if (!launchDateTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(launchDateTime) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDateTime]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await addInquiry({
        name: name.trim() || "Launch Subscriber",
        email: email.trim(),
        phone: "",
        service: "Coming Soon Subscription",
        requirement: "Notify on official website launch.",
        notes: `Subscribed during website countdown to launch date: ${launchDateTime || "Not specified"}`
      });

      if (success) {
        toast.success("🚀 Thank you! We will notify you when we launch.");
        setEmail("");
        setName("");
      } else {
        toast.error("Failed to register subscription. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-foreground py-12 px-4">
      <SEO title={`Launching Soon | ${displaySiteName}`} description="Our new website is launching soon. Subscribe to receive updates." />
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 mesh-bg opacity-45 pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      
      {/* Dynamic Animated Orbs */}
      <div className="orb w-[600px] h-[600px] bg-primary/10 -top-60 -left-60 animate-pulse-glow pointer-events-none" />
      <div className="orb w-[450px] h-[450px] bg-accent/8 bottom-0 right-0 animate-pulse-glow pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* 1. Header (Logo) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex justify-center mb-8">
        <div className="flex items-center gap-2.5">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={displaySiteName} className="h-10 w-auto object-contain" />
          ) : (
            <img src={logoImg} alt={displaySiteName} className="h-10 w-auto object-contain" />
          )}
        </div>
      </header>

      {/* 2. Main Content Card */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center my-auto">
        <div className="w-full p-8 md:p-14 backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-[32px] glow-sm text-center relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Website under construction
          </div>

          <h1 className="text-4xl sm:text-6xl font-heading font-black text-foreground mb-4 leading-tight">
            We Are <span className="gradient-text">Launching Soon</span>
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto">
            We are polishing our new online presence to bring you state-of-the-art custom web design, mobile apps, SaaS tools, and e-commerce solutions.
          </p>

          {/* Countdown Timer Grid */}
          {launchDateTime ? (
            <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-lg mx-auto mb-10">
              {[
                { label: "Days", val: padZero(timeLeft.days) },
                { label: "Hours", val: padZero(timeLeft.hours) },
                { label: "Minutes", val: padZero(timeLeft.minutes) },
                { label: "Seconds", val: padZero(timeLeft.seconds) },
              ].map((unit) => (
                <div key={unit.label} className="p-3 md:p-5 rounded-2xl border border-white/5 bg-slate-950/50 shadow-inner relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="text-3xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {timeLeft.isExpired ? "00" : unit.val}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mt-1.5 tracking-widest">
                    {unit.label}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/5 bg-slate-950/40 text-muted-foreground text-xs font-medium mb-10 font-mono">
              <Calendar className="w-4 h-4 text-primary animate-pulse" />
              <span>Official Launch Date Announcement Coming Soon</span>
            </div>
          )}

          {/* Subscribe Form */}
          <div className="max-w-md mx-auto p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-950/30">
            <h3 className="text-xs md:text-sm font-semibold text-foreground mb-4 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-primary animate-pulse" /> Want to know when we are live?
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <span>{isSubmitting ? "Subscribing..." : "Notify Me"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 3. Footer (Contact Information & Bypass Link) */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-6 text-center md:text-left text-xs text-muted-foreground">
          {/* Address */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground mb-0.5">Our Location</p>
              <p>{contactAddress}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <p className="font-bold text-foreground mb-0.5">Email Support</p>
              <a href={`mailto:${contactEmail}`} className="hover:text-primary transition-colors">{contactEmail}</a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col md:flex-row items-center gap-3 justify-end">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div className="text-center md:text-right">
              <p className="font-bold text-foreground mb-0.5">Call Us</p>
              <a href={`tel:${contactPhone}`} className="hover:text-primary transition-colors">{contactPhone}</a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & bypass */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/5 text-[10px] text-muted-foreground/40">
          <span>© {new Date().getFullYear()} {displaySiteName}. All rights reserved.</span>
          
         
        </div>
      </footer>
    </div>
  );
};

export default ComingSoonPage;
