import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Lock, Mail, User, Shield, Sparkles, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { CURRENT_POLICY_VERSION } from "@/constants/policies";
import { trackEvent } from "@/lib/analytics";

export const CareersAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirect") || "/jobs";

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          navigate(redirectTo);
        }
      }
    };
    checkUser();
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all credentials");
      return;
    }

    try {
      setLoading(true);
      if (activeTab === "signin") {
        // Sign In
        if (isSupabaseConfigured && supabase) {
          const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });
          if (error) {
            toast.error(error.message);
            return;
          }

          // Link anonymous consents if device_id exists
          const deviceId = localStorage.getItem("scalex_device_id");
          if (deviceId && signInData.user) {
            await supabase
              .from("anonymous_consents")
              .update({ user_id: signInData.user.id })
              .eq("device_id", deviceId)
              .is("user_id", null);
          }
        } else {
          // Mock login
          sessionStorage.setItem("scalex_mock_seeker_auth", "true");
        }
        toast.success("Successfully signed in!");
        navigate(redirectTo);
      } else {
        // Sign Up
        if (!fullName.trim()) {
          toast.error("Please provide your full name");
          return;
        }
        if (!consentAccepted) {
          toast.error("You must accept the Privacy Policy and Terms of Service to register.");
          return;
        }
        if (isSupabaseConfigured && supabase) {
          const { data: signUpData, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: {
                full_name: fullName.trim(),
                terms_accepted: true,
                privacy_accepted: true,
                policy_version: CURRENT_POLICY_VERSION
              }
            }
          });
          if (error) {
            toast.error(error.message);
            return;
          }

          // Link anonymous consents if device_id exists
          const deviceId = localStorage.getItem("scalex_device_id");
          if (deviceId && signUpData.user) {
            await supabase
              .from("anonymous_consents")
              .update({ user_id: signUpData.user.id })
              .eq("device_id", deviceId)
              .is("user_id", null);
          }

          toast.success("Registration successful! Please check your email for confirmation link.");
          trackEvent("signup_completed");
          setActiveTab("signin");
        } else {
          toast.success("Mock Registration completed! Switch to Login.");
          trackEvent("signup_completed");
          setActiveTab("signin");
        }
      }
    } catch (err: any) {
      console.error("Auth submit error:", err);
      toast.error("Could not complete authentication check");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Candidate Careers Portal Authentication | ScaleXWeb"
        description="Access candidate dashboards to apply for jobs and track status."
        path="/careers/auth"
      />

      <section className="section-padding bg-background min-h-screen flex items-center justify-center relative z-10 pt-28">
        <div className="absolute inset-0 mesh-bg opacity-10" />
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="max-w-md w-full px-4 relative z-10">
          
          <div className="border border-border bg-card rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-heading font-extrabold text-foreground">
                {activeTab === "signin" ? "Candidate Access Console" : "Create Careers Account"}
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {activeTab === "signin"
                  ? "Log in to track active applications and modify alert digests."
                  : "Sign up to configure search filters, bookmarks, and apply directly."}
              </p>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-2 p-1 bg-secondary/30 rounded-xl">
              <button
                onClick={() => { setActiveTab("signin"); setEmail(""); setPassword(""); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "signin" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab("signup"); setEmail(""); setPassword(""); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "signup" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
              {activeTab === "signup" && (
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                    <Input
                      type="text"
                      required
                      placeholder="Yash Patel"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    type="email"
                    required
                    placeholder="candidate@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              {activeTab === "signup" && (
                <div className="flex items-start gap-2.5 pt-2 select-none">
                  <button
                    type="button"
                    onClick={() => setConsentAccepted(!consentAccepted)}
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    title="Toggle Acceptance"
                  >
                    {consentAccepted ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span className="text-[11px] leading-relaxed text-muted-foreground">
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                      Terms of Service
                    </a>
                  </span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || (activeTab === "signup" && !consentAccepted)}
                className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : activeTab === "signin" ? "Sign In" : "Register Profile"}
              </Button>
            </form>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default CareersAuth;
