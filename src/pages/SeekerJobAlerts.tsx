import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { JobCategory } from "@/types/jobPortal";
import { Bell, Trash2, Mail, Plus, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const SeekerJobAlerts = () => {
  const [candidateId, setCandidateId] = useState<string>("seeker-mock-user");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserAndAlerts = async () => {
      try {
        setLoading(true);
        let activeUserId = "seeker-mock-user";

        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            activeUserId = data.user.id;
            setCandidateId(activeUserId);
          }
        }

        const [cats, alertList] = await Promise.all([
          jobService.getCategories(),
          jobService.getJobAlerts(activeUserId)
        ]);
        setCategories(cats);
        setAlerts(alertList);
      } catch (err) {
        console.error("Error loading job alerts data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywords.trim() && selectedCategory === "all" && !location.trim()) {
      toast.error("Please provide at least one filter criteria (Keywords, Category, or Location)");
      return;
    }

    try {
      setSubmitting(true);
      const newAlert = await jobService.createJobAlert(candidateId, {
        keywords: keywords.trim() || undefined,
        category_id: selectedCategory !== "all" ? selectedCategory : undefined,
        location: location.trim() || undefined,
        frequency
      });

      if (newAlert) {
        toast.success("Job search alert created!");
        setKeywords("");
        setSelectedCategory("all");
        setLocation("");
        
        // Refresh alert list
        const updatedList = await jobService.getJobAlerts(candidateId);
        setAlerts(updatedList);
      } else {
        toast.error("Failed to create alert");
      }
    } catch (err) {
      console.error("Alert creation error:", err);
      toast.error("Could not subscribe to job alerts");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const success = await jobService.deleteJobAlert(alertId);
      if (success) {
        toast.success("Alert unsubscribed");
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      } else {
        toast.error("Failed to delete alert");
      }
    } catch (err) {
      console.error("Delete alert error:", err);
      toast.error("Failed to complete unsubscribe request");
    }
  };

  return (
    <Layout>
      <SEO
        title="Job Alerts & Subscriptions | Candidate Dashboard"
        description="Configure matching keyword subscriptions to receive daily or weekly email Digests."
        path="/dashboard/job-alerts"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: "Job Alerts", path: "/dashboard/job-alerts" }
        ]}
        badge="Job Alerts"
        headline="Configure Search Digests."
        subheadline="Receive email notifications when new job listings matching your specific criteria are published."
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight max-w-5xl">
          
          <div className="grid md:grid-cols-5 gap-8">
            
            {/* Left: Alerts Form */}
            <div className="md:col-span-3 space-y-6">
              <div className="border border-border bg-card rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                <div className="pb-3 border-b border-border/40">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" /> Create Alert Subscription
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1">Specify search parameters for your custom email digest.</p>
                </div>

                <form onSubmit={handleCreateAlert} className="space-y-4 text-xs text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Keywords (e.g. React, UI)</label>
                      <Input
                        placeholder="e.g. React, Node, Designer"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Job Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Target Location</label>
                      <Input
                        placeholder="e.g. Remote, Bangalore"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Digest Frequency</label>
                      <Select value={frequency} onValueChange={(val) => setFrequency(val as "daily" | "weekly")}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="daily">Daily Email Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Email Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-1.5"
                  >
                    <Bell className="w-4 h-4" /> {submitting ? "Subscribing..." : "Create Search Alert"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Right: Active Subscriptions List */}
            <div className="md:col-span-2 space-y-6">
              <div className="border border-border bg-card rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Active Alerts</h4>
                  <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-full font-bold px-2 py-0.5 text-[9px]">
                    {alerts.length} Active
                  </Badge>
                </div>

                {loading ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary mx-auto mb-2" />
                    Loading alerts...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center p-6 text-muted-foreground italic text-xs space-y-1">
                    <Mail className="w-6 h-6 mx-auto opacity-50 mb-2" />
                    <p>No active alerts configured.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className="border border-border bg-background rounded-xl p-4 flex items-start justify-between gap-3 text-[11px]"
                      >
                        <div className="space-y-1.5 flex-grow min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-primary/5 text-primary border border-primary/10 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                              {alert.frequency}
                            </Badge>
                          </div>
                          
                          <div className="space-y-0.5 text-muted-foreground">
                            {alert.keywords && (
                              <p className="truncate"><strong className="text-foreground">Keywords:</strong> {alert.keywords}</p>
                            )}
                            {alert.category?.name && (
                              <p className="truncate"><strong className="text-foreground">Category:</strong> {alert.category.name}</p>
                            )}
                            {alert.location && (
                              <p className="truncate"><strong className="text-foreground">Location:</strong> {alert.location}</p>
                            )}
                          </div>
                        </div>

                        <Button 
                          variant="outline"
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20 flex-shrink-0"
                          title="Unsubscribe Alert"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alert Tips Widget */}
              <div className="bg-secondary/20 border border-border/50 rounded-2xl p-5 space-y-3 text-[11px] text-muted-foreground leading-relaxed">
                <h5 className="font-bold text-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Notification Settings
                </h5>
                <p>
                  We scan new job listings daily against your active subscriptions. If a matching role is found, a summary digest is sent directly to your registered profile email.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] bg-background/50 border border-border/20 p-2.5 rounded-lg text-foreground/80">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  Make sure to add <code>careers@scalexweb.com</code> to your contacts whitelist.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SeekerJobAlerts;
