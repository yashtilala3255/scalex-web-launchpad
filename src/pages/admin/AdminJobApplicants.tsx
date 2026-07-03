import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job, ApplicationStatus } from "@/types/jobPortal";
import {
  ArrowLeft,
  Users,
  Briefcase,
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  Lock,
  ArrowRightLeft,
  Search,
  Filter,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

const STAGES: { id: ApplicationStatus; name: string; color: string }[] = [
  { id: "applied", name: "Applied", color: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400" },
  { id: "under_review", name: "Review", color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400" },
  { id: "shortlisted", name: "Shortlist", color: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400" },
  { id: "interview_scheduled", name: "Interviews", color: "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400" },
  { id: "hired", name: "Hired", color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" },
  { id: "rejected", name: "Rejected", color: "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400" }
];

export const AdminJobApplicants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const syncAuthAndLoad = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          if (!data?.user) {
            const { error: syncError } = await supabase.auth.signInWithPassword({
              email: "scalexwebsolution@gmail.com",
              password: "S8321060"
            });
            if (syncError) {
              toast.error(`Admin Auth Sync failed: ${syncError.message}`);
              console.error("Supabase Admin Auth Sync failed:", syncError.message);
            } else {
              console.log("Supabase Admin Auth Sync completed.");
            }
          }
        } catch (err) {
          console.error("Supabase Admin Auth Sync error:", err);
        }
      }
      loadApplicantsData();
    };

    syncAuthAndLoad();
  }, [isAuthenticated, id]);

  const loadApplicantsData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [allJobs, appList] = await Promise.all([
        jobService.getAdminJobs(),
        jobService.getApplicationsByJobId(id)
      ]);
      
      const foundJob = allJobs.find((j) => j.id === id);
      if (foundJob) {
        setJob(foundJob);
        setApplicants(appList);
      } else {
        toast.error("Job opening not found");
        navigate("/admin/jobs");
      }
    } catch (err) {
      console.error("Error loading job applicants:", err);
      toast.error("Failed to load applicants list");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = usernameInput.trim();
    const pass = passwordInput.trim();

    const storedUser = localStorage.getItem("scalex_admin_user") || "admin";
    const isValidUser = (user === "scalexwebsolution@gmail.com" || user === storedUser);
    const isValidPass = (pass === "S8321060" || pass === "admin123");

    if (isValidUser && isValidPass) {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signInWithPassword({
            email: user === "admin" ? "scalexwebsolution@gmail.com" : user,
            password: pass === "admin123" ? "S8321060" : pass
          });
        } catch (err) {
          console.error("Supabase signin error:", err);
        }
      }
      setIsAuthenticated(true);
      sessionStorage.setItem("scalex_admin_auth", "true");
      toast.success("Recruiter portal authenticated!");
    } else {
      toast.error("Invalid admin email or password credentials");
    }
  };

  const handleQuickStatusMove = async (appId: string, currentStatus: ApplicationStatus, nextStatus: ApplicationStatus) => {
    try {
      const result = await jobService.updateApplicationStatus(
        appId,
        nextStatus,
        `Status quick-moved from ${currentStatus} to ${nextStatus}`
      );
      if (result.success) {
        if (result.emailSent) {
          toast.success(`Applicant moved to ${nextStatus} & notification email sent!`);
        } else {
          toast.success(`Applicant moved to ${nextStatus}`);
        }
        loadApplicantsData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("An error occurred during stage transfer");
    }
  };

  const formatSalary = (val?: number, currency = "INR") => {
    if (!val) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const getFilteredApplicants = () => {
    return applicants.filter((app) => {
      const name = app.applicant?.full_name || "";
      const skills = app.applicant?.skills?.join(" ") || "";
      const searchLower = search.toLowerCase();
      return name.toLowerCase().includes(searchLower) || skills.toLowerCase().includes(searchLower);
    });
  };

  const filteredApplicants = getFilteredApplicants();

  // Authentication Guard Screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <SEO title="Recruiter Access | ScaleXWeb" description="Authentication screen for recruiter access." path="/admin/jobs" />
        <section className="section-padding bg-background min-h-[85vh] flex items-center justify-center relative">
          <div className="absolute inset-0 mesh-bg opacity-10" />
          <div className="absolute inset-0 dot-grid opacity-30" />
          
          <div className="max-w-md w-full relative z-10 px-4">
            <div className="border border-border bg-card rounded-3xl p-8 md:p-10 shadow-lg text-center space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground">Recruiter Portal Access</h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Please authenticate with your administrative credentials to manage job openings and review candidates.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-left">
                <div>
                  <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Email / Username</label>
                  <Input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl mt-4">
                  Log In Recruiter Panel
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={`Candidates Board - ${job?.title || "Job Details"} | ScaleXWeb`} description="Recruiter dashboard tracking applicant stages." path="/admin/jobs" />

      <section className="section-padding bg-background pt-24 min-h-screen">
        <div className="container-tight max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link to="/admin/jobs" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  Recruiter Board
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-xs text-foreground font-bold">Candidates Stage</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground mt-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> {job?.title} Applicants
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {job?.location} &bull; {job?.category?.name || "Unspecified category"}
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border/50 text-xs h-9 rounded-xl"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
              Loading candidates stages...
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
              {STAGES.map((stage) => {
                const stageApps = filteredApplicants.filter((a) => a.status === stage.id);
                
                return (
                  <div 
                    key={stage.id}
                    className="border border-border/50 bg-secondary/10 rounded-2xl p-4 min-w-[200px] flex flex-col space-y-4"
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-xs uppercase tracking-wider">{stage.name}</h3>
                      <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${stage.color}`}>
                        {stageApps.length}
                      </Badge>
                    </div>

                    {/* Candidate Cards Stack */}
                    <div className="space-y-3 flex-grow overflow-y-auto max-h-[60vh] scrollbar-thin">
                      {stageApps.length === 0 ? (
                        <div className="border border-dashed border-border bg-card/20 rounded-xl p-5 text-center text-muted-foreground text-[10px] italic">
                          No candidates
                        </div>
                      ) : (
                        stageApps.map((app) => (
                          <div 
                            key={app.id}
                            className="group block border border-border bg-card rounded-xl p-4 hover:shadow-sm transition-all duration-300 hover:border-primary/20 cursor-pointer text-[11px]"
                          >
                            <div onClick={() => navigate(`/admin/applicants/${app.id}`)} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground group-hover:text-primary transition-colors block truncate pr-2">
                                  {app.applicant?.full_name}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
                              </div>

                              <p className="text-[10px] text-muted-foreground truncate leading-relaxed">
                                {app.applicant?.headline || "Candidate Seeker"}
                              </p>

                              {app.applicant?.skills && app.applicant.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {app.applicant.skills.slice(0, 3).map((skill: string) => (
                                    <Badge key={skill} variant="secondary" className="bg-secondary/40 text-[9px] px-1 py-0 rounded text-muted-foreground">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-2 border-t border-border/30">
                                <span>Exp: {formatSalary(app.expected_salary)}</span>
                                <span className="flex items-center gap-0.5">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(app.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </div>

                            {/* Quick Move Stage Button & Delete */}
                            <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-border/30">
                              <span className="text-[9px] text-muted-foreground mr-auto font-mono uppercase tracking-wider font-bold">Move Stage</span>
                              {STAGES.filter((s) => s.id !== stage.id).slice(0, 2).map((s) => (
                                <button
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickStatusMove(app.id, app.status, s.id);
                                  }}
                                  className="border border-border hover:bg-primary hover:text-white rounded px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground transition-colors"
                                >
                                  {s.name.slice(0, 3)}
                                </button>
                              ))}
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to permanently delete ${app.applicant?.full_name}'s application?`)) {
                                    try {
                                      const success = await jobService.deleteApplication(app.id);
                                      if (success) {
                                        toast.success("Application deleted successfully!");
                                        loadApplicantsData();
                                      } else {
                                        toast.error("Failed to delete application");
                                      }
                                    } catch (err: any) {
                                      toast.error(err?.message || "Error deleting application");
                                    }
                                  }
                                }}
                                className="border border-red-500/20 bg-red-500/5 hover:bg-red-600 hover:text-white rounded p-1 text-red-600 dark:text-red-400 transition-colors ml-1"
                                title="Delete Application"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                          </div>
                        ))
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default AdminJobApplicants;
