import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Mail, CheckCircle2, ShieldAlert, Sparkles, Send } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "development",
    "saas",
    "ecommerce",
    "news"
  ]);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const topicsList = [
    { id: "development", name: "Web & Mobile Development", desc: "React, Next.js, Flutter, and engineering updates" },
    { id: "saas", name: "SaaS & Platform Engineering", desc: "Multi-tenant architectures and cloud-native insights" },
    { id: "ecommerce", name: "E-Commerce & Digital Growth", desc: "Optimizing online shops for conversion rates" },
    { id: "news", name: "ScaleXWeb News & Updates", desc: "Company achievements, launches, and case studies" }
  ];

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!gdprConsent) {
      toast.error("Please consent to the privacy policy to subscribe.");
      return;
    }

    try {
      setSubmitting(true);
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.functions.invoke("newsletter-emails", {
          body: {
            action: "subscribe",
            email: email.trim().toLowerCase(),
            name: name.trim() || undefined,
            topics: selectedTopics,
            frequency: "weekly"
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast.success("Subscribed successfully!");
        setCompleted(true);
      } else {
        // Mock fallback
        setTimeout(() => {
          toast.success("Subscribed successfully! (Mock)");
          setCompleted(true);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      toast.error(err.message || "An error occurred during subscription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Subscribe to ScaleXWeb Newsletter | Digital Strategy Insights"
        description="Join our newsletter list for web development guides, SaaS architecture strategies, and digital product case studies."
        path="/newsletter"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Newsletter", path: "/newsletter" }
        ]}
        badge="Newsletter"
        headline="Scale Smarter with Digital Insights."
        subheadline="Join hundreds of ambitious founders and engineers receiving actionable web and SaaS engineering strategies direct to their inbox."
      />

      <section className="section-padding bg-background relative z-10 -mt-12 pt-0">
        <div className="container-tight max-w-3xl">
          
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="gradient-border bg-card rounded-3xl p-8 md:p-10 shadow-lg space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-heading font-extrabold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> Subscribe to Updates
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Get premium engineering articles, case studies, and framework guidelines directly to your inbox.
                  </p>
                </div>

                <form onSubmit={handleSubscribeSubmit} className="space-y-6 text-xs text-left">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Your Name (Optional)</label>
                      <Input
                        placeholder="Yash Patel"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background border-border/50 text-xs h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Email Address</label>
                      <Input
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background border-border/50 text-xs h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Topic preferences list */}
                  <div className="space-y-3 pt-2">
                    <label className="font-bold text-foreground text-xs uppercase tracking-wider block">Choose Your Topics</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {topicsList.map((topic) => {
                        const isSelected = selectedTopics.includes(topic.id);
                        return (
                          <div
                            key={topic.id}
                            onClick={() => handleTopicToggle(topic.id)}
                            className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-background/50 hover:bg-secondary/10'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox checked={isSelected} onCheckedChange={() => {}} className="rounded-md border-border" />
                              <div className="space-y-0.5 text-left">
                                <span className="font-bold text-foreground block">{topic.name}</span>
                                <span className="text-[10px] text-muted-foreground block">{topic.desc}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* GDPR Consent Box */}
                  <div className="flex items-start gap-3 bg-secondary/10 p-4 border border-border/20 rounded-2xl">
                    <Checkbox
                      id="gdpr"
                      checked={gdprConsent}
                      onCheckedChange={(checked) => setGdprConsent(!!checked)}
                      className="mt-0.5 rounded-md border-border"
                    />
                    <label htmlFor="gdpr" className="text-[11px] text-muted-foreground leading-relaxed cursor-pointer select-none">
                      I agree to receive newsletters, event updates, and promotional content from ScaleXWeb Solutions. I acknowledge I can unsubscribe at any time using the link in the footer.
                    </label>
                  </div>

                  {/* HoneyPot (Anti-Bot) */}
                  <input type="text" className="hidden" tabIndex={-1} autoComplete="off" />

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs gap-2 flex items-center justify-center shadow-md shadow-primary/10"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Subscribing..." : "Subscribe Now"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="gradient-border bg-card rounded-3xl p-10 shadow-lg text-center space-y-6"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary animate-bounce">
                  <Mail className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-extrabold text-foreground">Welcome Aboard!</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you for subscribing to our newsletter! We have registered <strong className="text-foreground">{email}</strong> and dispatched a welcome confirmation email.
                  </p>
                </div>

                <div className="bg-secondary/10 border border-border/20 rounded-2xl p-4 text-[11px] text-muted-foreground max-w-sm mx-auto flex items-start gap-2.5 text-left">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>You can customize your interests or opt-out at any time using the link in the footer of our emails.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </Layout>
  );
};

export default Newsletter;
