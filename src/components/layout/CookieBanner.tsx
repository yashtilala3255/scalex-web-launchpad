import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldAlert, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been given
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      // Delay showing the banner slightly for better entry presentation
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = { essential: true, analytics: true, marketing: true };
    localStorage.setItem("cookieConsent", JSON.stringify(allConsent));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    localStorage.setItem("cookieConsent", JSON.stringify(essentialOnly));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md bg-card border border-border rounded-2xl shadow-xl p-6 md:w-96 overflow-hidden transform-gpu"
        >
          {/* Subtle colored mesh background overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-primary/[0.03] to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between relative z-10 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-foreground text-sm">Cookie Preferences</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Consent Settings</p>
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies to optimize site performance, analyze traffic, and support marketing inquiries in alignment with our{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookie-policy" className="text-primary hover:underline font-medium">
                Cookie Policy
              </Link>.
            </p>

            <AnimatePresence>
              {showCustomize && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 pt-2 border-t border-border/50 overflow-hidden"
                >
                  {/* Essential */}
                  <div className="flex items-start justify-between p-2 rounded-xl bg-secondary/30 border border-border/40">
                    <div className="max-w-[75%]">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        Essential <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground" />
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Required for core features and secure form logins.</p>
                    </div>
                    <div className="h-6 flex items-center">
                      <span className="w-4 h-4 rounded bg-primary/25 border border-primary/40 flex items-center justify-center text-primary cursor-not-allowed">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Analytics */}
                  <label className="flex items-start justify-between p-2 rounded-xl bg-secondary/10 border border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer select-none">
                    <div className="max-w-[75%]">
                      <p className="text-xs font-semibold text-foreground">Analytics & Performance</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Allows us to analyze page speeds and site performance.</p>
                    </div>
                    <div className="h-6 flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="accent-primary w-4 h-4 rounded border-border focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </label>

                  {/* Marketing */}
                  <label className="flex items-start justify-between p-2 rounded-xl bg-secondary/10 border border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer select-none">
                    <div className="max-w-[75%]">
                      <p className="text-xs font-semibold text-foreground">Marketing & Advertising</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">Enables anonymous tracking for client lead acquisitions.</p>
                    </div>
                    <div className="h-6 flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="accent-primary w-4 h-4 rounded border-border focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              {showCustomize ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs"
                    onClick={() => setShowCustomize(false)}
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl text-xs bg-primary hover:bg-primary/95 text-white"
                    onClick={handleSavePreferences}
                  >
                    Save Preferences
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs"
                      onClick={() => setShowCustomize(true)}
                    >
                      Preferences
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      onClick={handleRejectAll}
                    >
                      Reject All
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="w-full rounded-xl text-xs bg-primary hover:bg-primary/95 text-white"
                    onClick={handleAcceptAll}
                  >
                    Accept All Cookies
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
