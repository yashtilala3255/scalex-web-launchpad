import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { AlertTriangle, Sparkles, Smile, Loader2, ArrowRight } from "lucide-react";

export const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [reason, setReason] = useState("");
  const [otherFeedback, setOtherFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const reasonsList = [
    "The content is no longer relevant to me",
    "Emails are sent too frequently",
    "I signed up by mistake",
    "Technical issues / broken layout",
    "Other (please explain below)"
  ];

  const handleUnsubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      toast.error("Invalid unsubscribe link. Token and email parameters are required.");
      return;
    }

    try {
      setSubmitting(true);
      const finalReason = reason === "Other (please explain below)" 
        ? `Other: ${otherFeedback.trim()}` 
        : reason || "No reason specified";

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.functions.invoke("newsletter-emails", {
          body: {
            action: "unsubscribe",
            email: email,
            token: token,
            reason: finalReason
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast.success("Unsubscribed successfully.");
        setCompleted(true);
      } else {
        // Mock fallback
        setTimeout(() => {
          toast.success("Unsubscribed (Mock)");
          setCompleted(true);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Unsubscribe error:", err);
      toast.error(err.message || "An error occurred during unsubscribe.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Unsubscribe from ScaleXWeb Newsletter | Feedback Center"
        description="Opt-out of email campaigns and leave feedback to help us improve."
        path="/newsletter/unsubscribe"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Newsletter", path: "/newsletter" },
          { name: "Unsubscribe", path: "/newsletter/unsubscribe" }
        ]}
        badge="Unsubscribe"
        headline="We are Sorry to See You Go."
        subheadline="You will be immediately removed from our active subscriber list. Help us improve by letting us know why."
      />

      <section className="section-padding bg-background relative z-10 -mt-12 pt-0">
        <div className="container-tight max-w-2xl">

          {!completed ? (
            <form onSubmit={handleUnsubscribeSubmit} className="gradient-border bg-card rounded-3xl p-8 md:p-10 shadow-lg space-y-6 text-xs text-left">
              <div className="space-y-2 border-b border-border/30 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground">Confirm Unsubscribe</h3>
                  <p className="text-[10px] text-muted-foreground">
                    Opting out email: <strong className="text-foreground">{email}</strong>
                  </p>
                </div>
              </div>

              {/* Feedback reason radio list */}
              <div className="space-y-3">
                <label className="font-bold text-foreground text-xs uppercase tracking-wider block">Reason for unsubscribing</label>
                <div className="space-y-2">
                  {reasonsList.map((r) => (
                    <label key={r} className="flex items-center gap-3 border border-border/50 bg-background/50 hover:bg-secondary/10 p-3.5 rounded-xl cursor-pointer transition-all">
                      <input
                        required
                        type="radio"
                        name="reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="text-primary focus:ring-primary border-border rounded-full w-4 h-4"
                      />
                      <span className="text-xs text-foreground/90 font-medium">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {reason === "Other (please explain below)" && (
                <div className="space-y-2 animate-slide-in-down">
                  <label className="font-semibold text-foreground/80 block">Please provide more details</label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="We read all feedback. Let us know how we can improve our frequency, format, or topic relevance..."
                    value={otherFeedback}
                    onChange={(e) => setOtherFeedback(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs rounded-xl"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs gap-1.5 flex items-center justify-center shadow-md shadow-rose-600/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Unsubscribing...
                  </>
                ) : (
                  "Confirm Unsubscribe"
                )}
              </Button>
            </form>
          ) : (
            <div className="gradient-border bg-card rounded-3xl p-10 shadow-lg text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto text-emerald-500">
                <Smile className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-extrabold text-foreground">You Have Been Unsubscribed</h2>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your address <strong className="text-foreground">{email}</strong> has been successfully removed from our list. You will no longer receive campaigns from us.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link to={`/newsletter/preferences?email=${encodeURIComponent(email || "")}&token=${token}`}>
                  <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs gap-1.5 flex items-center justify-center shadow-md shadow-primary/10">
                    <Sparkles className="w-4 h-4" /> Re-Subscribe or Modify Preferences
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="outline" className="w-full h-11 border-border rounded-xl text-xs gap-1 flex items-center justify-center">
                    Go to Homepage <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default Unsubscribe;
