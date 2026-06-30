import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { ApplicationStatus, InterviewSchedule, ApplicationStatusHistory } from "@/types/jobPortal";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  MapPinOff,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

export const SeekerApplications = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState<string>("seeker-mock-user");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Accordion state to track expanded application detail panels
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [histories, setHistories] = useState<Record<string, ApplicationStatusHistory[]>>({});
  const [interviews, setInterviews] = useState<Record<string, InterviewSchedule[]>>({});

  useEffect(() => {
    const fetchUserAndApplications = async () => {
      try {
        setLoading(true);
        let activeUserId = "seeker-mock-user";

        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            activeUserId = data.user.id;
            setCandidateId(activeUserId);
          } else {
            toast.info("Please log in to track your applications");
            navigate("/careers/auth?redirect=/dashboard/applications");
            return;
          }
        } else {
          const mockAuth = sessionStorage.getItem("scalex_mock_seeker_auth");
          if (!mockAuth) {
            toast.info("Please log in to track your applications");
            navigate("/careers/auth?redirect=/dashboard/applications");
            return;
          }
        }

        const appList = await jobService.getApplications(activeUserId);
        setApplications(appList);
      } catch (err) {
        console.error("Error fetching candidate applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndApplications();
  }, []);

  const handleToggleExpand = async (appId: string) => {
    if (expandedId === appId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(appId);
    
    // Load histories and interviews for this specific application
    try {
      const [histList, intList] = await Promise.all([
        jobService.getApplicationStatusHistory(appId),
        jobService.getInterviewSchedules(appId)
      ]);
      setHistories((prev) => ({ ...prev, [appId]: histList }));
      setInterviews((prev) => ({ ...prev, [appId]: intList }));
    } catch (err) {
      console.error("Error loading application timeline details:", err);
    }
  };

  const handleViewResume = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!path) {
      toast.error("No resume has been uploaded for this application");
      return;
    }
    if (path.startsWith("mock")) {
      toast.info(`Mock Resume Path: ${path}`);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.storage
          .from("resumes")
          .createSignedUrl(path, 600);
        
        if (error) throw error;
        if (data?.signedUrl) {
          window.open(data.signedUrl, "_blank", "noopener,noreferrer");
        } else {
          toast.error("Could not generate access link for your resume");
        }
      } else {
        toast.info(`Mock Resume Path: ${path}`);
      }
    } catch (err: any) {
      console.error("Signed URL error:", err);
      toast.error(`Failed to retrieve resume: ${err.message}`);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Applied</Badge>;
      case "under_review":
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Under Review</Badge>;
      case "shortlisted":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Shortlisted</Badge>;
      case "interview_scheduled":
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Interview Scheduled</Badge>;
      case "rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">Hired</Badge>;
    }
  };

  const getStats = () => {
    const total = applications.length;
    const active = applications.filter((a) => !["rejected", "hired"].includes(a.status)).length;
    const interviewsCount = applications.filter((a) => a.status === "interview_scheduled").length;
    const hired = applications.filter((a) => a.status === "hired").length;
    return { total, active, interviewsCount, hired };
  };

  const stats = getStats();

  return (
    <Layout>
      <SEO
        title="My Applications | Candidate Dashboard"
        description="Track your job application status and interview schedules in real-time."
        path="/dashboard/applications"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: "Dashboard", path: "/dashboard/applications" }
        ]}
        badge="Candidate Dashboard"
        headline="Track Your Applications."
        subheadline="Stay updated on recruiter reviews, screening, shortlists, and scheduled interview rounds."
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight max-w-4xl">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-border bg-card rounded-2xl p-4 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Submitted</span>
              <span className="text-2xl font-bold text-foreground mt-1 block">{stats.total}</span>
            </div>
            <div className="border border-border bg-card rounded-2xl p-4 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Active Reviews</span>
              <span className="text-2xl font-bold text-primary mt-1 block">{stats.active}</span>
            </div>
            <div className="border border-border bg-card rounded-2xl p-4 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Interviews</span>
              <span className="text-2xl font-bold text-purple-600 mt-1 block">{stats.interviewsCount}</span>
            </div>
            <div className="border border-border bg-card rounded-2xl p-4 text-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Offers Hired</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">{stats.hired}</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="border border-border/50 bg-card/50 rounded-xl p-6 h-28 animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base mb-1">No applications yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                You haven't submitted any job applications yet. Visit the careers directory to find open positions.
              </p>
              <Link to="/jobs">
                <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs font-semibold px-6">
                  Browse Open Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const isExpanded = expandedId === app.id;
                const appHistories = histories[app.id] || [];
                const appInterviews = interviews[app.id] || [];

                return (
                  <div 
                    key={app.id}
                    className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm transition-all hover:border-primary/20"
                  >
                    
                    {/* Header Row */}
                    <div 
                      onClick={() => handleToggleExpand(app.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-secondary/10 transition-colors"
                    >
                      <div className="space-y-1">
                        <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                          {app.job?.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                          {app.job?.company?.name || "ScaleXWeb Solutions"} &bull; <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" /> {app.job?.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" /> 
                          Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {getStatusBadge(app.status)}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Details Block */}
                    {isExpanded && (
                      <div className="border-t border-border/30 bg-secondary/15 p-5 md:p-6 space-y-6 text-xs animate-slide-down">
                        
                        {/* Summary Details */}
                        <div className="grid sm:grid-cols-3 gap-4 border-b border-border/30 pb-4">
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Expected Salary</span>
                            <span className="text-foreground font-semibold mt-0.5 block">
                              {app.expected_salary 
                                ? new Intl.NumberFormat("en-IN", { style: "currency", currency: app.job?.currency || "INR", maximumFractionDigits: 0 }).format(app.expected_salary)
                                : "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Notice Period</span>
                            <span className="text-foreground font-semibold mt-0.5 block">
                              {app.notice_period !== undefined ? `${app.notice_period} Days` : "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Submitted Resume</span>
                            <button
                              onClick={(e) => handleViewResume(e, app.resume_url)}
                              className="text-primary hover:underline font-bold mt-0.5 flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" /> View Resume File
                            </button>
                          </div>
                        </div>

                        {/* Interview Details (if scheduled) */}
                        {app.status === "interview_scheduled" && appInterviews.length > 0 && (
                          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 space-y-3">
                            <h4 className="font-bold text-purple-600 flex items-center gap-1.5">
                              <Video className="w-4 h-4" /> Interview Scheduled details
                            </h4>
                            {appInterviews.map((interview) => (
                              <div key={interview.id} className="grid sm:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-1">
                                  <span className="text-muted-foreground block text-[10px]">DATE &amp; TIME</span>
                                  <span className="font-bold text-foreground">
                                    {new Date(interview.scheduled_at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-muted-foreground block text-[10px]">MODE &amp; LINK</span>
                                  {interview.mode === "online" ? (
                                    <a 
                                      href={interview.location_or_link || "#"} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline font-bold flex items-center gap-1"
                                    >
                                      Join Video Call <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <span className="font-semibold text-foreground flex items-center gap-1">
                                      In-Person: {interview.location_or_link || "Office Location"}
                                    </span>
                                  )}
                                </div>
                                {interview.notes && (
                                  <div className="sm:col-span-2 space-y-1 border-t border-purple-500/10 pt-2">
                                    <span className="text-muted-foreground block text-[10px]">RECRUITER NOTES</span>
                                    <p className="text-muted-foreground leading-relaxed italic">{interview.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Timeline / Progress History */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">Status History &amp; Activity Log</h4>
                          
                          <div className="relative border-l border-border/60 ml-3 space-y-6 py-2">
                            {appHistories.map((hist) => (
                              <div key={hist.id} className="relative pl-6">
                                {/* Timeline Dot */}
                                <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border border-2 border-background z-10" />
                                
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                                      {hist.new_status.replace("_", " ")}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(hist.changed_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground italic text-xs">
                                    {hist.note || "No comments left by recruiter"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
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

export default SeekerApplications;
