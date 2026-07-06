import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Settings, Loader2, Save, AlertCircle, Sparkles, LogOut } from "lucide-react";

export const PreferenceCenter = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  const topicsList = [
    { id: "development", name: "Web & Mobile Development", desc: "React, Next.js, Flutter, and engineering updates" },
    { id: "saas", name: "SaaS & Platform Engineering", desc: "Multi-tenant architectures and cloud-native insights" },
    { id: "ecommerce", name: "E-Commerce & Digital Growth", desc: "Optimizing online shops for conversion rates" },
    { id: "news", name: "ScaleXWeb News & Updates", desc: "Company achievements, launches, and case studies" }
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!token || !email) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.functions.invoke("newsletter-emails", {
            body: {
              action: "get-preferences",
              email: email,
              token: token
            }
          });

          if (error) throw error;
          if (data?.error) {
            setUnauthorized(true);
          } else if (data?.preferences) {
            const pref = data.preferences;
            setName(pref.name || "");
            setSelectedTopics(pref.topics || []);
            setFrequency(pref.frequency || "weekly");
          }
        } else {
          // Mock data fallback
          setName("Yash Patel");
          setSelectedTopics(["development", "saas"]);
          setFrequency("weekly");
        }
      } catch (err: any) {
        console.error("Preferences load error:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [token, email]);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;

    try {
      setSaving(true);
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.functions.invoke("newsletter-emails", {
          body: {
            action: "update-preferences",
            email: email,
            token: token,
            name: name.trim() || undefined,
            topics: selectedTopics,
            frequency: frequency
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        toast.success("Subscription preferences saved successfully!");
      } else {
        setTimeout(() => {
          toast.success("Preferences updated! (Mock)");
        }, 1000);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to update preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Email Preferences Center | ScaleXWeb Solutions"
        description="Configure your newsletter category selection and frequency parameters."
        path="/newsletter/preferences"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Newsletter", path: "/newsletter" },
          { name: "Preferences", path: "/newsletter/preferences" }
        ]}
        badge="Preferences"
        headline="Configure Your Inbox."
        subheadline="Take complete control of what emails we send you and how often you receive them."
      />

      <section className="section-padding bg-background relative z-10 -mt-12 pt-0">
        <div className="container-tight max-w-2xl">

          {loading ? (
            <div className="border border-border bg-card rounded-3xl p-12 text-center text-xs text-muted-foreground shadow-sm">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              Retrieving your inbox settings...
            </div>
          ) : unauthorized ? (
            <div className="border border-border bg-card rounded-3xl p-10 shadow-sm text-center space-y-5">
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Access Token Mismatch</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                This verification code has expired, or the link is broken. Please register again or access preferences via the link inside your newsletter footer.
              </p>
              <Link to="/newsletter">
                <Button className="h-10 bg-primary text-white rounded-xl text-xs px-6">
                  Newsletter Landing Page
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleSavePreferences} className="gradient-border bg-card rounded-3xl p-8 md:p-10 shadow-lg space-y-6 text-xs text-left">
                <div className="space-y-2 border-b border-border/30 pb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-4.5 h-4.5 text-primary" /> Preferences Center
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Managing inbox preferences for <strong className="text-foreground">{email}</strong>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Your Name</label>
                    <Input
                      placeholder="Yash Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background border-border/50 text-xs h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Mailing Frequency</label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-background border-border/50 rounded-xl h-11 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border">
                        <SelectItem value="weekly">Weekly Digest (Recommended)</SelectItem>
                        <SelectItem value="monthly">Monthly Summary</SelectItem>
                        <SelectItem value="real_time">Real-Time (Instantly on publish)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Topic selector */}
                <div className="space-y-3 pt-2">
                  <label className="font-bold text-foreground text-xs uppercase tracking-wider block">Custom Interests Selection</label>
                  <div className="grid gap-3">
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

                <div className="flex gap-3 pt-2 border-t border-border/30">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-grow h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs gap-1.5 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving changes..." : "Save Inbox Preferences"}
                  </Button>
                  
                  <Link to={`/newsletter/unsubscribe?email=${encodeURIComponent(email || "")}&token=${token}`}>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-border text-xs gap-1.5 flex items-center justify-center text-rose-500 hover:bg-rose-500/5 hover:text-rose-600 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" /> Unsubscribe
                    </Button>
                  </Link>
                </div>
              </form>

              <div className="flex justify-center items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/10 p-3 rounded-2xl border border-border/20">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>You can return and update these preferences at any time.</span>
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default PreferenceCenter;
