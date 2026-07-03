import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ApplicationStatus, InterviewMode, InterviewSchedule, ApplicationStatusHistory } from "@/types/jobPortal";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Video,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  Lock,
  Plus,
  ArrowRight,
  AlertCircle,
  Settings,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export const AdminApplicantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [application, setApplication] = useState<any | null>(null);
  const [statusHistories, setStatusHistories] = useState<ApplicationStatusHistory[]>([]);
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([]);
  const [allCandidateApplications, setAllCandidateApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Form State
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("applied");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingApp, setDeletingApp] = useState(false);

  // Interview Scheduler State
  const [intDate, setIntDate] = useState("");
  const [intMode, setIntMode] = useState<InterviewMode>("online");
  const [intLocation, setIntLocation] = useState("");
  const [intNotes, setIntNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);

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
      loadApplicantData();
    };

    syncAuthAndLoad();
  }, [isAuthenticated, id]);

  const loadApplicantData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const appDetails = await jobService.getApplicationDetails(id);
      if (appDetails) {
        setApplication(appDetails);
        setNewStatus(appDetails.status);
        
        // Fetch histories, interviews, and all applications by this candidate
        const [histList, intList, candidateApps] = await Promise.all([
          jobService.getApplicationStatusHistory(id),
          jobService.getInterviewSchedules(id),
          jobService.getApplications(appDetails.applicant_id)
        ]);
        setStatusHistories(histList);
        setInterviews(intList);
        setAllCandidateApplications(candidateApps);
      } else {
        toast.error("Application not found");
        navigate("/admin/jobs");
      }
    } catch (err) {
      console.error("Error loading application detail details:", err);
      toast.error("Failed to load applicant detail profile");
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

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setUpdatingStatus(true);
      const result = await jobService.updateApplicationStatus(id, newStatus, statusNote);
      if (result.success) {
        if (statusNote) {
          if (result.emailSent) {
            toast.success("Application status updated and notification email sent!");
          } else {
            toast.warning(`Status updated, but email failed: ${result.emailError || "check Resend configuration"}`);
          }
        } else {
          toast.success("Application status updated!");
        }
        setStatusNote("");
        loadApplicantData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      toast.error(err?.message || "An error occurred while saving the status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to permanently delete this application? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingApp(true);
      const success = await jobService.deleteApplication(id);
      if (success) {
        toast.success("Application deleted successfully!");
        if (application?.job_id) {
          navigate(`/admin/jobs/${application.job_id}/applicants`);
        } else {
          navigate("/admin/jobs");
        }
      } else {
        toast.error("Failed to delete application");
      }
    } catch (err: any) {
      console.error("Delete application error:", err);
      toast.error(err?.message || "An error occurred while deleting the application");
    } finally {
      setDeletingApp(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!intDate) {
      toast.error("Please select a date and time");
      return;
    }

    try {
      setScheduling(true);
      await jobService.createInterviewSchedule({
        application_id: id,
        scheduled_at: new Date(intDate).toISOString(),
        mode: intMode,
        location_or_link: intLocation || undefined,
        notes: intNotes || undefined
      });
      toast.success("Interview scheduled successfully!");
      
      // Clear scheduler form
      setIntDate("");
      setIntLocation("");
      setIntNotes("");
      
      loadApplicantData();
    } catch (err: any) {
      console.error("Interview scheduling error:", err);
      toast.error(err.message || "Failed to schedule interview");
    } finally {
      setScheduling(false);
    }
  };

  const formatSalary = (val?: number, currency = "INR") => {
    if (!val) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return "N/A";
    }
  };

  const formatScheduledDate = (dateStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "N/A";
    }
  };

  const formatScheduledTime = (dateStr: string) => {
    try {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleTimeString("en-IN", { timeStyle: "short" });
    } catch {
      return "N/A";
    }
  };

  const handleViewResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    const path = application?.resume_url || application?.applicant?.resume_url;
    if (!path) {
      toast.error("No resume has been uploaded by this candidate");
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
          toast.error("Could not generate access link for this resume");
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

  if (loading) {
    return (
      <Layout>
        <SEO title="Loading Candidate Details..." path="/admin/jobs" />
        <section className="section-padding bg-background pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center text-xs text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
            Loading candidate details...
          </div>
        </section>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <SEO title="Candidate Not Found" path="/admin/jobs" />
        <section className="section-padding bg-background pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-bold text-foreground text-sm">Applicant Profile Not Found</h3>
            <p className="text-xs text-muted-foreground">
              We could not retrieve the applicant details. This might be due to a permission constraint, or the applicant ID does not exist.
            </p>
            <Link to="/admin/jobs">
              <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 px-6 text-xs">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={`Applicant: ${application?.applicant?.full_name || "Detail"} | ScaleXWeb`} description="Recruiter dashboard candidate profile details and interview scheduler." path="/admin/jobs" />

      <section className="section-padding bg-background pt-24 min-h-screen">
        <div className="container-tight max-w-6xl">
          
          <div className="mb-6">
            {application?.job_id ? (
              <Link to={`/admin/jobs/${application.job_id}/applicants`} className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Candidates Board
              </Link>
            ) : (
              <Link to="/admin/jobs" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Recruiter Dashboard
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Seeker profile details & cover letter */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Candidate Overview Card */}
                <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border/40">
                    <div className="space-y-1.5">
                      <h2 className="text-xl font-bold text-foreground">{application.applicant?.full_name}</h2>
                      <p className="text-xs text-primary font-semibold font-mono tracking-wide uppercase">{application.applicant?.headline || "Software Professional"}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground pt-1.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground/60" /> {application.applicant?.email || "No Email"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground/60" /> {application.applicant?.phone || "No Phone"}
                        </span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs border-b border-border/30 pb-6">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Experience</span>
                      <span className="font-bold text-foreground mt-0.5 block">{application.applicant?.experience_years || 0} Years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Expected Salary</span>
                      <span className="font-bold text-foreground mt-0.5 block">{formatSalary(application.expected_salary)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Notice Period</span>
                      <span className="font-bold text-foreground mt-0.5 block">
                        {application.notice_period !== undefined ? `${application.notice_period} Days` : "N/A"}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(application.applicant?.skills) && application.applicant.skills.length > 0 && (
                    <div className="space-y-2 border-b border-border/30 pb-6">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Candidate Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {application.applicant.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="bg-secondary/40 text-[10px] px-2.5 py-0.5 rounded-full border border-border/30 text-foreground/80">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {application.applicant?.education && (
                    <div className="space-y-2 border-b border-border/30 pb-6">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Education Details</span>
                      <p className="text-xs text-foreground/90 leading-relaxed bg-secondary/10 p-4 border border-border/20 rounded-xl">
                        {application.applicant.education}
                      </p>
                    </div>
                  )}

                  {application.cover_letter && (
                    <div className="space-y-2 pt-2">
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Cover Letter / Message</span>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line bg-secondary/10 p-4 border border-border/20 rounded-xl">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between border-t border-border/30">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Candidate Resume</span>
                    <Button 
                      onClick={handleViewResume}
                      className="h-10 rounded-xl bg-primary text-white text-xs font-bold gap-1.5 px-4"
                    >
                      <FileText className="w-4 h-4" /> View Resume Document
                    </Button>
                  </div>
                </div>

                {/* Candidate's Job Applications Tracking List */}
                <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border/40 uppercase tracking-wider">
                    Track All Applied Jobs ({allCandidateApplications.length})
                  </h3>
                  
                  <div className="divide-y divide-border/30">
                    {allCandidateApplications.map((otherApp) => {
                      const isCurrent = otherApp.id === id;
                      return (
                        <div 
                          key={otherApp.id} 
                          className={`py-3.5 flex items-center justify-between gap-4 text-xs ${isCurrent ? 'bg-primary/5 -mx-4 px-4 rounded-xl border border-primary/20' : ''}`}
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-foreground block">
                              {otherApp.job?.title || "Unknown Position"}
                            </span>
                            <span className="text-[10px] text-muted-foreground block font-mono">
                              Applied: {new Date(otherApp.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(otherApp.status)}
                            {isCurrent ? (
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                Current View
                              </span>
                            ) : (
                              <Link 
                                to={`/admin/applicants/${otherApp.id}`}
                                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-secondary/10 flex items-center justify-center font-bold text-[10px] text-foreground hover:text-primary transition-colors"
                              >
                                View Application
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline activity list */}
                <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border/40 uppercase tracking-wider">Status logs &amp; activity history</h3>
                  
                  <div className="relative border-l border-border/60 ml-3 space-y-6 py-2">
                    {statusHistories.map((hist) => (
                      <div key={hist.id} className="relative pl-6">
                        <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border border-2 border-background z-10" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                              {(hist.new_status || "").replace("_", " ")}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(hist.changed_at)}
                            </span>
                          </div>
                          <p className="text-muted-foreground italic text-xs leading-relaxed">
                            {hist.note || "Status changed"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Recruiter status changer & interview scheduler */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Status Changer Card */}
                <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" /> Update Application Stage
                  </h4>
                  <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 text-xs text-left">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Application Status</label>
                      <Select value={newStatus} onValueChange={(val) => setNewStatus(val as ApplicationStatus)}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired (Offer Extended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Log Note / Recruiter Feedback</label>
                      <Textarea
                        rows={3}
                        placeholder="Log feedback notes regarding candidate screening, resume reviews, or test scores..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs rounded-xl"
                      />
                    </div>

                    <Button type="submit" disabled={updatingStatus} className="w-full h-10 bg-primary text-white font-bold rounded-xl text-xs mt-2">
                      {updatingStatus ? "Saving Stage..." : "Save Application Stage"}
                    </Button>
                  </form>
                </div>

                {/* Interview Scheduler Card */}
                <div className="border border-border bg-card rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" /> Schedule Interview Round
                  </h4>
                  <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs text-left">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Date &amp; Time</label>
                      <Input
                        required
                        type="datetime-local"
                        value={intDate}
                        onChange={(e) => setIntDate(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Mode</label>
                        <Select value={intMode} onValueChange={(val) => setIntMode(val as InterviewMode)}>
                          <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-border">
                            <SelectItem value="online">Online Call</SelectItem>
                            <SelectItem value="in_person">In-Person</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Location / Meeting Link</label>
                        <Input
                          placeholder={intMode === "online" ? "Google Meet link" : "Office Address"}
                          value={intLocation}
                          onChange={(e) => setIntLocation(e.target.value)}
                          className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Interview Notes / Instructions</label>
                      <Textarea
                        rows={3}
                        placeholder="Topics to prepare, interviewer list, resume review points..."
                        value={intNotes}
                        onChange={(e) => setIntNotes(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs rounded-xl"
                      />
                    </div>

                    <Button type="submit" disabled={scheduling} className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs mt-2 flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" /> {scheduling ? "Scheduling..." : "Schedule & Invite Candidate"}
                    </Button>
                  </form>
                </div>

                {/* Scheduled Interviews List widget */}
                {interviews.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">Scheduled Rounds</h4>
                    <div className="space-y-2">
                      {interviews.map((item) => (
                        <div key={item.id} className="border border-purple-500/20 bg-purple-500/5 rounded-xl p-4 text-[11px] space-y-2">
                          <div className="flex items-center justify-between font-bold text-purple-600">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" /> {item.mode === "online" ? "Online Call" : "In-Person"}
                            </span>
                            <span>{formatScheduledDate(item.scheduled_at)}</span>
                          </div>
                          
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatScheduledTime(item.scheduled_at)}
                          </p>

                          {item.location_or_link && (
                            <p className="text-[10px] text-primary truncate">
                              <strong>Link/Loc:</strong> {item.location_or_link}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone: Delete Application */}
                <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 shadow-sm space-y-4">
                  <h4 className="font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Danger Zone
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Once deleted, this application will be permanently removed from your dashboard. This action is irreversible.
                  </p>
                  <Button 
                    onClick={handleDeleteApplication}
                    disabled={deletingApp}
                    className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deletingApp ? "Deleting..." : "Delete Application"}
                  </Button>
                </div>

              </div>

            </div>

        </div>
      </section>
    </Layout>
  );
};

export default AdminApplicantDetail;