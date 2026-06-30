import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckSquare, Square, FileText } from "lucide-react";
import { toast } from "sonner";
import { CURRENT_POLICY_VERSION } from "@/constants/policies";

export const PolicyReacceptanceModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    const checkUserPolicyVersion = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const uId = session.user.id;
          setUserId(uId);

          const { data: profile, error } = await supabase
            .from("profiles")
            .select("policy_version")
            .eq("id", uId)
            .maybeSingle();

          if (error) {
            console.error("Error fetching user profile policy version:", error);
            return;
          }

          // If profile policy_version does not match current version, prompt re-acceptance
          if (!profile || profile.policy_version !== CURRENT_POLICY_VERSION) {
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error("Policy check error:", err);
      }
    };

    checkUserPolicyVersion();
  }, []);

  const handleAccept = async () => {
    if (!consentAccepted) {
      toast.error("Please accept the updated policies to continue.");
      return;
    }
    if (!userId || !supabase) return;

    try {
      setLoading(true);
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({
          terms_accepted: true,
          terms_accepted_at: now,
          privacy_accepted: true,
          privacy_accepted_at: now,
          policy_version: CURRENT_POLICY_VERSION
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      toast.success("Thank you! Policies updated successfully.");
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error updating policy acceptance:", err);
      toast.error(err.message || "Failed to submit agreement");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="max-w-md w-full border border-border bg-card rounded-3xl p-6 md:p-8 shadow-2xl relative z-50 space-y-6 animate-scale-up">
        
        {/* Subtle decorative orb */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none animate-pulse-glow" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold text-foreground">Updated Legal Policies</h3>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1.5">
              Version {CURRENT_POLICY_VERSION} Update
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We have updated our Terms of Service and Privacy Policy to improve user data security, cookies tracking consent, and career platform compliance.
          </p>
        </div>

        <div className="bg-secondary/20 border border-border/40 rounded-2xl p-4 space-y-2.5 relative z-10 text-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" /> What's changing?
          </h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] leading-relaxed">
            <li>Refined Privacy terms outlining Supabase database encryption.</li>
            <li>Detailed Cookie preferences log linked to custom device IDs.</li>
            <li>Explicit role permissions declaring location and camera services.</li>
          </ul>
        </div>

        <div className="flex items-start gap-2.5 pt-1 relative z-10 select-none">
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
            I review and re-accept the updated{" "}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Terms of Service
            </a>{" "}
            for ScaleXWeb.
          </span>
        </div>

        <Button
          onClick={handleAccept}
          disabled={loading || !consentAccepted}
          className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
        >
          {loading ? "Saving Agreement..." : "Accept & Continue"}
        </Button>
      </div>
    </div>
  );
};
