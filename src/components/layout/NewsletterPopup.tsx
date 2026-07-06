import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if dismissed or subscribed
    const status = localStorage.getItem("scalex_newsletter_popup_status");
    if (status === "subscribed" || status === "dismissed") {
      return;
    }

    // Timer: show after 15 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    // Exit intent handler
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 30) {
        setIsOpen(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    // Suppress for 7 days
    const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("scalex_newsletter_popup_status", "dismissed");
    localStorage.setItem("scalex_newsletter_popup_expiry", expiry.toString());
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setSubmitting(true);
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.functions.invoke("newsletter-emails", {
          body: {
            action: "subscribe",
            email: email.trim().toLowerCase(),
            topics: ["development", "saas", "ecommerce", "news"],
            frequency: "weekly"
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast.success("Subscribed successfully!");
        setSuccess(true);
        localStorage.setItem("scalex_newsletter_popup_status", "subscribed");
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setTimeout(() => {
          toast.success("Subscribed successfully! (Mock)");
          setSuccess(true);
          localStorage.setItem("scalex_newsletter_popup_status", "subscribed");
          setTimeout(() => setIsOpen(false), 3000);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Popup subscription error:", err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if saved dismissal has expired
  useEffect(() => {
    const expiry = localStorage.getItem("scalex_newsletter_popup_expiry");
    if (expiry) {
      const now = new Date().getTime();
      if (now > parseInt(expiry)) {
        localStorage.removeItem("scalex_newsletter_popup_status");
        localStorage.removeItem("scalex_newsletter_popup_expiry");
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden text-center z-10"
          >
            {/* Background Orbs */}
            <div className="absolute inset-0 mesh-bg opacity-10 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!success ? (
              <form onSubmit={handleSubscribeSubmit} className="space-y-5 text-xs text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary mb-2">
                  <Mail className="w-5.5 h-5.5" />
                </div>

                <div className="text-center space-y-1.5">
                  <h3 className="text-lg font-heading font-extrabold text-foreground flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-primary" /> Join Our Insights Circle
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Subscribe to receive high-value Web Development templates and SaaS growth checklists directly in your inbox. No spam.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <Input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border/50 text-xs h-11 rounded-xl w-full"
                  />
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Subscribing..." : "Get Free Access"}
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
                  By clicking above, you agree to our GDPR privacy policy. You can opt-out at any time in one-click.
                </p>
              </form>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-foreground">Welcome Aboard!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  You have successfully subscribed to the ScaleXWeb Solutions newsletter!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
