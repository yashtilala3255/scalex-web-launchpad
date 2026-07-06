import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { CheckCircle2, XCircle, Sparkles, Loader2, Settings, ArrowRight } from "lucide-react";

export const NewsletterConfirm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token || !email) {
        setErrorMessage("Missing verification parameters in url.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.functions.invoke("newsletter-emails", {
            body: {
              action: "confirm",
              email: email,
              token: token
            }
          });

          if (error) throw error;
          if (data?.error) {
            setErrorMessage(data.error);
            setSuccess(false);
          } else {
            setSuccess(true);
          }
        } else {
          // Mock fallback
          setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 1500);
          return;
        }
      } catch (err: any) {
        console.error("Confirmation error:", err);
        setErrorMessage(err.message || "Confirmation request failed.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    confirmSubscription();
  }, [token, email]);

  return (
    <Layout>
      <SEO
        title="Confirming Newsletter Subscription | ScaleXWeb Solutions"
        description="Verify your email address to active newsletter subscription."
        path="/newsletter/confirm"
      />

      <section className="section-padding bg-background min-h-[85vh] flex items-center justify-center relative">
        <div className="absolute inset-0 mesh-bg opacity-10" />
        <div className="absolute inset-0 dot-grid opacity-30" />

        <div className="max-w-md w-full relative z-10 px-4">
          <div className="border border-border bg-card rounded-3xl p-8 md:p-10 shadow-lg text-center space-y-6">
            
            {loading ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <h3 className="text-base font-bold text-foreground">Confirming Your Subscription</h3>
                <p className="text-xs text-muted-foreground">Please wait while we verify your secure credentials...</p>
              </div>
            ) : success ? (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-heading font-extrabold text-foreground flex items-center justify-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-primary" /> Verified Successfully!
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your subscription is now active! You will receive our weekly newsletters packed with web and SaaS development tips.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link to={`/newsletter/preferences?email=${encodeURIComponent(email || "")}&token=${token}`}>
                    <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs gap-1.5 flex items-center justify-center shadow-md shadow-primary/10">
                      <Settings className="w-4 h-4" /> Customize Topics Preference
                    </Button>
                  </Link>
                  
                  <Link to="/">
                    <Button variant="outline" className="w-full h-11 border-border rounded-xl text-xs gap-1 flex items-center justify-center">
                      Go to Homepage <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto text-rose-500">
                  <XCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-heading font-extrabold text-foreground">Verification Failed</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {errorMessage || "The verification link is invalid, expired, or has already been used."}
                  </p>
                </div>

                <div className="pt-2">
                  <Link to="/newsletter">
                    <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs">
                      Try Subscribing Again
                    </Button>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsletterConfirm;
