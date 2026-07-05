import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job, JobStatus, JobType, JobCategory, Company, Certificate } from "@/types/jobPortal";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  Search,
  Lock,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Building2,
  ShieldAlert,
  FolderOpen,
  Globe,
  Settings,
  Mail,
  Phone,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

export const AdminJobsList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [activeView, setActiveView] = useState<"jobs" | "internships" | "companies" | "categories" | "candidates" | "applications" | "certificates">("jobs");
  
  // Lists
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  
  // Search filters
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Certificates CMS State
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [certCandidateName, setCertCandidateName] = useState("");
  const [certProgramName, setCertProgramName] = useState("");
  const [certType, setCertType] = useState<"project_completion" | "internship_completion" | "internship_participation">("project_completion");
  const [certCustomId, setCertCustomId] = useState("");
  const [certEmail, setCertEmail] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [certDescription, setCertDescription] = useState("");
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [savingCertificate, setSavingCertificate] = useState(false);

  // Stats Counters
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalApplications: 0
  });

  // Modal Dialog Form States
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [compName, setCompName] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compLogo, setCompLogo] = useState("");
  const [savingCompany, setSavingCompany] = useState(false);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [catName, setCatName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

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
      loadDashboardData();
    };

    syncAuthAndLoad();
  }, [isAuthenticated, activeView]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [allJobs, cats, comps, candidatesList, appsList, certsList] = await Promise.all([
        jobService.getAdminJobs(),
        jobService.getCategories(),
        jobService.getCompanies(),
        jobService.getCandidates(),
        jobService.getAllApplications(),
        jobService.getCertificates()
      ]);
      setJobs(allJobs);
      setCategories(cats);
      setCompanies(comps);
      setCandidates(candidatesList);
      setApplications(appsList);
      setCertificates(certsList);

      // Compute statistics
      const total = allJobs.length;
      const published = allJobs.filter((j) => j.status === "published").length;
      const draft = allJobs.filter((j) => j.status === "draft").length;
      const totalApplications = allJobs.reduce((acc, curr) => acc + (curr._count?.applications || 0), 0);

      setStats({ total, published, draft, totalApplications });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      toast.error("Failed to load dashboard data");
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

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) return;
    try {
      const success = await jobService.deleteJob(id);
      if (success) {
        toast.success("Job posting deleted");
        trackEvent("admin_job_deleted", { job_id: id });
        loadDashboardData();
      } else {
        toast.error("Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Delete operation encountered an error");
    }
  };

  const handleDuplicateJob = async (job: Job) => {
    try {
      const duplicateData = {
        title: `${job.title} (Copy)`,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities || "",
        category_id: job.category_id,
        company_id: job.company_id,
        location: job.location,
        job_type: job.job_type,
        experience_level: job.experience_level,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        currency: job.currency,
        status: "draft" as JobStatus,
        application_deadline: job.application_deadline
      };
      const newJob = await jobService.createJob(duplicateData);
      if (newJob) {
        toast.success("Job posting duplicated as Draft");
        trackEvent("admin_job_duplicated", {
          original_job_id: job.id,
          new_job_id: newJob.id,
          job_title: job.title
        });
        loadDashboardData();
      } else {
        toast.error("Duplication failed");
      }
    } catch (err) {
      console.error("Duplication error:", err);
      toast.error("Failed to duplicate job posting");
    }
  };

  // Companies CRUD
  const handleStartEditCompany = (comp: Company) => {
    setEditingCompanyId(comp.id);
    setCompName(comp.name);
    setCompDesc(comp.description || "");
    setCompWebsite(comp.website || "");
    setCompLogo(comp.logo_url || "");
    setShowAddCompany(true);
  };

  const handleCloseCompanyModal = () => {
    setCompName("");
    setCompDesc("");
    setCompWebsite("");
    setCompLogo("");
    setEditingCompanyId(null);
    setShowAddCompany(false);
  };

  const handleAddCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) {
      toast.error("Company name is required");
      return;
    }
    try {
      setSavingCompany(true);
      const companyData = {
        name: compName.trim(),
        description: compDesc.trim() || undefined,
        website: compWebsite.trim() || undefined,
        logo_url: compLogo.trim() || undefined
      };

      let result = null;
      if (editingCompanyId) {
        result = await jobService.updateCompany(editingCompanyId, companyData);
        if (result) {
          toast.success("Company profile updated successfully!");
        }
      } else {
        result = await jobService.createCompany(companyData);
        if (result) {
          toast.success("Company profile added successfully!");
        }
      }

      if (result) {
        setCompName("");
        setCompDesc("");
        setCompWebsite("");
        setCompLogo("");
        setEditingCompanyId(null);
        setShowAddCompany(false);
        loadDashboardData();
      } else {
        toast.error(editingCompanyId ? "Failed to update company" : "Failed to create company");
      }
    } catch (err: any) {
      console.error("Save company error:", err);
      toast.error(err?.message || "Database operation failed");
    } finally {
      setSavingCompany(false);
    }
  };

  const handleDeleteCompany = async (compId: string) => {
    if (!window.confirm("Are you sure you want to delete this company profile? This might affect job postings linked to it.")) return;
    try {
      const success = await jobService.deleteCompany(compId);
      if (success) {
        toast.success("Company profile removed");
        loadDashboardData();
      } else {
        toast.error("Failed to delete company");
      }
    } catch (err: any) {
      console.error("Error deleting company:", err);
      toast.error(err?.message || "Delete operation encountered an error");
    }
  };

  // Certificates CRUD
  const handleEditCertificateClick = (cert: Certificate) => {
    setEditingCertificateId(cert.id);
    setCertCandidateName(cert.candidate_name);
    setCertProgramName(cert.program_name);
    setCertType(cert.certificate_type);
    setCertCustomId(cert.certificate_id);
    setCertEmail(cert.recipient_email || "");
    setCertIssueDate(cert.issue_date.split("T")[0]);
    setCertDescription(cert.description || "");
    setShowAddCertificate(true);
  };

  const handleAddCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCandidateName.trim()) {
      toast.error("Candidate Name is required");
      return;
    }
    if (!certProgramName.trim()) {
      toast.error("Program Name is required");
      return;
    }

    try {
      setSavingCertificate(true);
      const issueDateStr = certIssueDate.trim() || new Date().toISOString().split("T")[0];

      if (editingCertificateId) {
        // Edit flow
        const updated = await jobService.updateCertificate(editingCertificateId, {
          candidate_name: certCandidateName.trim(),
          program_name: certProgramName.trim(),
          certificate_type: certType,
          issue_date: issueDateStr,
          certificate_id: certCustomId.trim(),
          recipient_email: certEmail.trim() || undefined,
          description: certDescription.trim() || undefined
        });

        if (updated) {
          toast.success("Certificate updated successfully!");
          setCertCandidateName("");
          setCertProgramName("");
          setCertCustomId("");
          setCertEmail("");
          setCertIssueDate("");
          setCertDescription("");
          setCertType("project_completion");
          setEditingCertificateId(null);
          setShowAddCertificate(false);
          loadDashboardData();
        } else {
          toast.error("Failed to update certificate");
        }
      } else {
        // Create flow
        const nextNum = String(certificates.length + 1).padStart(2, "0");
        const generatedId = certCustomId.trim() || `SCX-${new Date().getFullYear()}-${nextNum}`;
        
        const newCert = await jobService.createCertificate({
          candidate_name: certCandidateName.trim(),
          program_name: certProgramName.trim(),
          certificate_type: certType,
          issue_date: issueDateStr,
          certificate_id: generatedId,
          recipient_email: certEmail.trim() || undefined,
          description: certDescription.trim() || undefined
        });

        if (newCert) {
          toast.success("Certificate issued successfully!");
          setCertCandidateName("");
          setCertProgramName("");
          setCertCustomId("");
          setCertEmail("");
          setCertIssueDate("");
          setCertDescription("");
          setCertType("project_completion");
          setShowAddCertificate(false);
          loadDashboardData();
        } else {
          toast.error("Failed to issue certificate");
        }
      }
    } catch (err: any) {
      console.error("Save certificate error:", err);
      toast.error(err?.message || "Operation failed");
    } finally {
      setSavingCertificate(false);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm("Are you sure you want to revoke this certificate? Verification links will no longer work.")) return;
    try {
      const success = await jobService.deleteCertificate(id);
      if (success) {
        toast.success("Certificate revoked successfully");
        loadDashboardData();
      } else {
        toast.error("Failed to revoke certificate");
      }
    } catch (err: any) {
      console.error("Revoke certificate error:", err);
      toast.error(err?.message || "Revocation failed");
    }
  };

  // Categories CRUD
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      setSavingCategory(true);
      const newCat = await jobService.createCategory(catName.trim());
      if (newCat) {
        toast.success("Job category added successfully!");
        setCatName("");
        setShowAddCategory(false);
        loadDashboardData();
      } else {
        toast.error("Failed to create job category");
      }
    } catch (err: any) {
      console.error("Create category error:", err);
      toast.error(err?.message || "Database operation failed");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This might affect job postings linked to it.")) return;
    try {
      const success = await jobService.deleteCategory(catId);
      if (success) {
        toast.success("Category deleted successfully!");
        loadDashboardData();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (err: any) {
      console.error("Error deleting category:", err);
      toast.error(err?.message || "Delete operation encountered an error");
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!window.confirm("Are you sure you want to delete this candidate profile? All their applications will be deleted as well.")) return;
    try {
      const success = await jobService.deleteCandidate(candidateId);
      if (success) {
        toast.success("Candidate profile removed successfully");
        loadDashboardData();
      } else {
        toast.error("Failed to delete candidate");
      }
    } catch (err: any) {
      console.error("Delete candidate error:", err);
      toast.error(err?.message || "Delete operation failed");
    }
  };

  const handleDeleteApplication = async (appId: string, applicantName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${applicantName}'s application?`)) return;
    try {
      setLoading(true);
      const success = await jobService.deleteApplication(appId);
      if (success) {
        toast.success("Application deleted successfully!");
        loadDashboardData();
      } else {
        toast.error("Failed to delete application");
      }
    } catch (err: any) {
      console.error("Delete application error:", err);
      toast.error(err?.message || "Delete operation failed");
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  };

  const formatSalary = (min?: number, max?: number, currency = "INR") => {
    if (!min && !max) return "Undisclosed";
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)} / yr`;
    }
    return min ? `${formatter.format(min)} / yr` : `${formatter.format(max)} / yr`;
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Published</Badge>;
      case "draft":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Draft</Badge>;
      case "closed":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Closed</Badge>;
      case "expired":
        return <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Expired</Badge>;
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_type !== "internship" &&
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredInternships = jobs.filter(
    (job) =>
      job.job_type === "internship" &&
      (job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()))
  );

  const internshipStats = {
    total: jobs.filter(j => j.job_type === "internship").length,
    published: jobs.filter(j => j.job_type === "internship" && j.status === "published").length,
    draft: jobs.filter(j => j.job_type === "internship" && j.status === "draft").length,
    totalApplications: applications.filter(a => a.job?.job_type === "internship").length
  };

  const filteredCompanies = companies.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredCandidates = candidates.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredApplications = applications.filter((app) =>
    (app.applicant?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (app.job?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Applied</Badge>;
      case "under_review":
        return <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Under Review</Badge>;
      case "shortlisted":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Shortlisted</Badge>;
      case "interview_scheduled":
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Interview</Badge>;
      case "rejected":
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">Hired</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">{status}</Badge>;
    }
  };

  const handleViewResume = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();
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

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Authentication Lock Screen
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
      <SEO title="Recruiter Dashboard - Job Openings | ScaleXWeb" description="Recruiter dashboard for creating and managing job postings." path="/admin/jobs" />

      <section className="section-padding bg-background pt-24 min-h-screen">
        <div className="container-tight">
          
          {/* Recruiter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-heading font-bold text-foreground">Recruiter Job Portal</h2>
              <p className="text-xs text-muted-foreground">Manage open roles, companies, job categories, and track candidates.</p>
            </div>
            
            <div className="flex gap-2">
              <Link to="/adminloginog">
                <Button variant="outline" className="rounded-xl h-10 border-border text-xs">
                  CMS Dashboard
                </Button>
              </Link>
              
              {activeView === "jobs" ? (
                <Link to="/admin/jobs/new">
                  <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                    <Plus className="w-4 h-4" /> Post a Job
                  </Button>
                </Link>
              ) : activeView === "internships" ? (
                <div className="flex gap-2">
                  <Link to="/admin/jobs/new?type=internship">
                    <Button variant="outline" className="border-border rounded-xl h-10 text-xs gap-1.5 font-bold">
                      <Plus className="w-4 h-4" /> Post Standard Internship
                    </Button>
                  </Link>
                  <Link to="/admin/programs/new">
                    <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                      <Plus className="w-4 h-4" /> Post Internship Program
                    </Button>
                  </Link>
                </div>
              ) : activeView === "companies" ? (
                <Button onClick={() => setShowAddCompany(true)} className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                  <Plus className="w-4 h-4" /> Add Company
                </Button>
              ) : activeView === "categories" ? (
                <Button onClick={() => setShowAddCategory(true)} className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                  <Plus className="w-4 h-4" /> Add Category
                </Button>
              ) : activeView === "certificates" ? (
                <Button onClick={() => setShowAddCertificate(true)} className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                  <Plus className="w-4 h-4" /> Issue Certificate
                </Button>
              ) : null}
            </div>
          </div>

          {/* Global Recruiter Portal Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Candidates Card */}
            <div className="gradient-border bg-card rounded-2xl p-5 shadow-sm hover:glow-sm transition-all duration-300 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Registered Candidates</span>
                <span className="text-xl font-extrabold text-foreground block leading-none">{candidates.length}</span>
              </div>
            </div>

            {/* Total Jobs Card */}
            <div className="gradient-border bg-card rounded-2xl p-5 shadow-sm hover:glow-sm transition-all duration-300 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Job Postings</span>
                <span className="text-xl font-extrabold text-foreground block leading-none">
                  {jobs.filter(j => j.job_type !== "internship").length}
                </span>
              </div>
            </div>

            {/* Total Internships Card */}
            <div className="gradient-border bg-card rounded-2xl p-5 shadow-sm hover:glow-sm transition-all duration-300 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Internship Positions</span>
                <span className="text-xl font-extrabold text-foreground block leading-none">
                  {jobs.filter(j => j.job_type === "internship").length}
                </span>
              </div>
            </div>

            {/* Total Applications Card */}
            <div className="gradient-border bg-card rounded-2xl p-5 shadow-sm hover:glow-sm transition-all duration-300 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Job Applications</span>
                <span className="text-xl font-extrabold text-foreground block leading-none">{applications.length}</span>
              </div>
            </div>
          </div>

          {/* Sub Tab View Toggles */}
          <div className="flex gap-2 border-b border-border/30 pb-4 mb-6 overflow-x-auto no-scrollbar">
            <Button
              variant={activeView === "jobs" ? "default" : "outline"}
              onClick={() => { setActiveView("jobs"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <Briefcase className="w-4 h-4" /> Job Postings
            </Button>
            <Button
              variant={activeView === "internships" ? "default" : "outline"}
              onClick={() => { setActiveView("internships"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <Briefcase className="w-4 h-4 text-purple-500" /> Internships
            </Button>
            <Button
              variant={activeView === "companies" ? "default" : "outline"}
              onClick={() => { setActiveView("companies"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <Building2 className="w-4 h-4" /> Company Profiles
            </Button>
            <Button
              variant={activeView === "categories" ? "default" : "outline"}
              onClick={() => { setActiveView("categories"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <FolderOpen className="w-4 h-4" /> Job Categories
            </Button>
            <Button
              variant={activeView === "candidates" ? "default" : "outline"}
              onClick={() => { setActiveView("candidates"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <Users className="w-4 h-4" /> Registered Candidates
            </Button>
            <Button
              variant={activeView === "applications" ? "default" : "outline"}
              onClick={() => { setActiveView("applications"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <FileText className="w-4 h-4" /> Job Applications
            </Button>
            <Button
              variant={activeView === "certificates" ? "default" : "outline"}
              onClick={() => { setActiveView("certificates"); setSearch(""); }}
              className="rounded-xl text-xs h-9 gap-1.5 px-4"
            >
              <Award className="w-4 h-4 text-amber-500" /> Certificates
            </Button>
            <Link to="/admin/compliance">
              <Button
                variant="outline"
                className="rounded-xl text-xs h-9 gap-1.5 px-4 hover:text-primary transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-primary" /> Policy Compliance
              </Button>
            </Link>
          </div>

          {/* =========================================================================
              VIEW: JOBS
             ========================================================================= */}
          {activeView === "jobs" && (
            <>
              {/* Metrics Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Total Positions</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-foreground">{jobs.filter(j => j.job_type !== "internship").length}</span>
                    <span className="text-[10px] text-muted-foreground">roles</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Active Published</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-emerald-600">{jobs.filter(j => j.job_type !== "internship" && j.status === "published").length}</span>
                    <span className="text-[10px] text-muted-foreground">live</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Draft Items</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-amber-600">{jobs.filter(j => j.job_type !== "internship" && j.status === "draft").length}</span>
                    <span className="text-[10px] text-muted-foreground">drafts</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Applicants Received</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-primary">{applications.filter(a => a.job?.job_type !== "internship").length}</span>
                    <span className="text-[10px] text-muted-foreground">candidates</span>
                  </div>
                </div>
              </div>

              {/* Jobs Table Search & Render */}
              <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/40 flex items-center justify-between gap-3 bg-secondary/10">
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter jobs list..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{filteredJobs.length} matches found</span>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-xs text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                    Loading job postings...
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                    <h4 className="font-bold text-foreground text-sm">No Jobs Found</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                      No job postings match your filters or search keywords. Create a new listing to get started.
                    </p>
                    <Link to="/admin/jobs/new">
                      <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-9 text-xs">
                        Post First Job
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                          <th className="p-4 pl-6">Job Title</th>
                          <th className="p-4">Location / Type</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Candidates</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="space-y-1">
                                <span className="font-bold text-foreground block">{job.title}</span>
                                <span className="text-[10px] text-muted-foreground block">{job.category?.name || "Uncategorized"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="text-foreground block">{job.location}</span>
                                <span className="text-[10px] text-muted-foreground block font-medium">{getJobTypeLabel(job.job_type)}</span>
                              </div>
                            </td>
                            <td className="p-4">{getStatusBadge(job.status)}</td>
                            <td className="p-4">
                              {job._count?.applications ? (
                                <Link to={`/admin/jobs/${job.id}/applicants`} className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 hover:bg-primary/20 font-bold transition-colors">
                                  <Users className="w-3.5 h-3.5" /> {job._count.applications} Applicants
                                </Link>
                              ) : (
                                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                  <Users className="w-3.5 h-3.5 opacity-60" /> 0 Applicants
                                </span>
                              )}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a href={`/jobs/${job.slug}`} target="_blank" rel="noopener noreferrer" title="View Job Public Page">
                                  <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border">
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                                  </Button>
                                </a>
                                <Link to={job.is_internship_program ? `/admin/programs/edit/${job.id}` : `/admin/jobs/edit/${job.id}`} title="Edit Job">
                                  <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border">
                                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                  </Button>
                                </Link>
                                <Button variant="outline" onClick={() => handleDuplicateJob(job)} title="Duplicate / Clone" className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-muted-foreground">
                                  Clone
                                </Button>
                                <Button variant="outline" onClick={() => handleDeleteJob(job.id)} title="Delete Job" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20">
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              VIEW: INTERNSHIPS
             ========================================================================= */}
          {activeView === "internships" && (
            <>
              {/* Metrics Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Total Internships</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-foreground">{internshipStats.total}</span>
                    <span className="text-[10px] text-muted-foreground">roles</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Active Published</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-emerald-600">{internshipStats.published}</span>
                    <span className="text-[10px] text-muted-foreground">live</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Draft Items</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-amber-600">{internshipStats.draft}</span>
                    <span className="text-[10px] text-muted-foreground">drafts</span>
                  </div>
                </div>
                <div className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">Applicants Received</span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-bold text-primary">{internshipStats.totalApplications}</span>
                    <span className="text-[10px] text-muted-foreground">candidates</span>
                  </div>
                </div>
              </div>

              {/* Internships Table Search & Render */}
              <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/40 flex items-center justify-between gap-3 bg-secondary/10">
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter internships list..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{filteredInternships.length} matches found</span>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-xs text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                    Loading internship postings...
                  </div>
                ) : filteredInternships.length === 0 ? (
                  <div className="p-12 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">No Internships Found</h4>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                      No internship postings match your filters or search keywords. Create a new listing to get started.
                    </p>
                    <Link to="/admin/jobs/new?type=internship">
                      <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-9 text-xs">
                        Post First Internship
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                          <th className="p-4 pl-6">Internship Title</th>
                          <th className="p-4">Location / Compensation</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Candidates</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {filteredInternships.map((job) => (
                          <tr key={job.id} className="hover:bg-secondary/5 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="space-y-1">
                                <span className="font-bold text-foreground block">{job.title}</span>
                                <span className="text-[10px] text-muted-foreground block">{job.category?.name || "Uncategorized"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="text-foreground block">{job.location}</span>
                                <span className="text-[10px] text-muted-foreground block font-semibold text-purple-500 uppercase tracking-wide">
                                  {job.is_unpaid ? "Unpaid" : formatSalary(job.salary_min, job.salary_max, job.currency)}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">{getStatusBadge(job.status)}</td>
                            <td className="p-4">
                              {job._count?.applications ? (
                                <Link to={`/admin/jobs/${job.id}/applicants`} className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 hover:bg-primary/20 font-bold transition-colors">
                                  <Users className="w-3.5 h-3.5" /> {job._count.applications} Applicants
                                </Link>
                              ) : (
                                <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                  <Users className="w-3.5 h-3.5 opacity-60" /> 0 Applicants
                                </span>
                              )}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a href={`/jobs/${job.slug}`} target="_blank" rel="noopener noreferrer" title="View Internship Public Page">
                                  <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border">
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                                  </Button>
                                </a>
                                <Link to={job.is_internship_program ? `/admin/programs/edit/${job.id}` : `/admin/jobs/edit/${job.id}`} title="Edit Internship">
                                  <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-border">
                                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                  </Button>
                                </Link>
                                <Button variant="outline" onClick={() => handleDuplicateJob(job)} title="Duplicate / Clone" className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-muted-foreground">
                                  Clone
                                </Button>
                                <Button variant="outline" onClick={() => handleDeleteJob(job.id)} title="Delete Internship" className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20">
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              VIEW: COMPANIES
             ========================================================================= */}
          {activeView === "companies" && (
            <div className="space-y-4">
              <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 bg-secondary/10">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search company name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{filteredCompanies.length} companies listed</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                  Loading company profiles...
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <Building2 className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-bold text-foreground text-sm">No Companies Configured</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                    Create a company profile first to link it to your job listings.
                  </p>
                  <Button onClick={() => setShowAddCompany(true)} className="bg-primary text-white rounded-xl h-10 text-xs font-semibold px-6">
                    Add First Company
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.map((comp) => (
                    <div key={comp.id} className="border border-border bg-card rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {comp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm truncate max-w-[150px]">{comp.name}</h4>
                            {comp.website && (
                              <a href={ensureAbsoluteUrl(comp.website)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                                <Globe className="w-3 h-3" /> Website Link
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {comp.description || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/30 flex items-center justify-between gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleStartEditCompany(comp)}
                          className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-primary gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleDeleteCompany(comp.id)}
                          className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: CATEGORIES
             ========================================================================= */}
          {activeView === "categories" && (
            <div className="space-y-4 max-w-2xl">
              <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 bg-secondary/10">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search category name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{filteredCategories.length} categories listed</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                  Loading categories...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <FolderOpen className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-bold text-foreground text-sm">No Categories Configured</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1 mb-4">
                    Create a category first to link it to your job listings.
                  </p>
                  <Button onClick={() => setShowAddCategory(true)} className="bg-primary text-white rounded-xl h-10 text-xs font-semibold px-6">
                    Add First Category
                  </Button>
                </div>
              ) : (
                <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-4 pl-6">Category Name</th>
                        <th className="p-4">Slug Identifier</th>
                        <th className="p-4 pr-6 text-right font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredCategories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 pl-6 font-bold text-foreground">{cat.name}</td>
                          <td className="p-4 font-mono text-muted-foreground text-[10px]">{cat.slug}</td>
                          <td className="p-4 pr-6 text-right">
                            <Button 
                              variant="outline" 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: CANDIDATES
             ========================================================================= */}
          {activeView === "candidates" && (
            <div className="space-y-4">
              <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 bg-secondary/10">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{filteredCandidates.length} candidates registered</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                  Loading candidate accounts...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <Users className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-bold text-foreground text-sm">No Registered Candidates</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                    No candidates have registered an account in the portal yet.
                  </p>
                </div>
              ) : (
                <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-4 pl-6">Full Name / Headline</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Education / Experience</th>
                        <th className="p-4">Key Skills</th>
                        <th className="p-4 pr-6 text-right font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredCandidates.map((cand) => (
                        <tr key={cand.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="space-y-1">
                              <span className="font-bold text-foreground block">{cand.full_name}</span>
                              <span className="text-[10px] text-primary font-semibold block">{cand.headline || "Software Seeker"}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-muted-foreground">
                              <span className="block flex items-center gap-1 font-mono text-[10px]"><Mail className="w-3 h-3" /> {cand.email}</span>
                              {cand.phone && <span className="block flex items-center gap-1 font-mono text-[10px]"><Phone className="w-3 h-3" /> {cand.phone}</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="text-foreground block font-medium truncate max-w-[180px]" title={cand.education}>{cand.education || "No education specified"}</span>
                              <span className="text-[10px] text-muted-foreground block">{cand.experience_years || 0} Years Experience</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {Array.isArray(cand.skills) && cand.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {cand.skills.slice(0, 3).map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="bg-secondary/50 text-[9px] px-1.5 py-0 rounded-full border border-border/20 text-foreground/80">
                                    {skill}
                                  </Badge>
                                ))}
                                {cand.skills.length > 3 && (
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 rounded-full border-border">
                                    +{cand.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic text-[10px]">No skills listed</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {cand.resume_url ? (
                                <Button 
                                  onClick={(e) => handleViewResume(e, cand.resume_url)}
                                  variant="outline" 
                                  className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-primary gap-1"
                                  title="View Seeker Resume"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Resume
                                </Button>
                              ) : (
                                <Button disabled variant="outline" className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-muted-foreground opacity-60">
                                  No Resume
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                onClick={() => handleDeleteCandidate(cand.id)}
                                title="Remove Candidate Profile" 
                                className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: APPLICATIONS
             ========================================================================= */}
          {activeView === "applications" && (
            <div className="space-y-4">
              <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 bg-secondary/10">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate or job position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{filteredApplications.length} applications total</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                  Loading candidate applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <Briefcase className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-bold text-foreground text-sm">No Applications Found</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                    No seekers have submitted applications for your job postings yet.
                  </p>
                </div>
              ) : (
                <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-4 pl-6">Candidate / Contact</th>
                        <th className="p-4">Applied Job Position</th>
                        <th className="p-4">Compensation / Notice</th>
                        <th className="p-4">Current Stage</th>
                        <th className="p-4 pr-6 text-right font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="space-y-1">
                              <span className="font-bold text-foreground block">{app.applicant?.full_name || "New Candidate"}</span>
                              <span className="text-[10px] text-muted-foreground block font-mono">{app.applicant?.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="font-bold text-foreground block">{app.job?.title || "Deleted Job"}</span>
                              <span className="text-[10px] text-primary font-semibold block">{app.job?.company?.name || "ScaleXWeb"}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[10px]">
                            <div className="space-y-1 text-muted-foreground">
                              <span className="block">Expected: {app.expected_salary ? `${app.expected_salary.toLocaleString("en-IN")} INR` : "N/A"}</span>
                              <span className="block">Notice: {app.notice_period !== undefined ? `${app.notice_period} Days` : "Immediate"}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {getApplicationStatusBadge(app.status)}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/admin/applicants/${app.id}`}>
                                <Button className="h-8 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold rounded-lg px-3">
                                  Manage Candidate
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleDeleteApplication(app.id, app.applicant?.full_name || "New Candidate")}
                                className="h-8 w-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 p-0 rounded-lg border border-rose-500/20 flex items-center justify-center"
                                title="Delete Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW: CERTIFICATES
             ========================================================================= */}
          {activeView === "certificates" && (
            <div className="space-y-4">
              <div className="border border-border bg-card rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 bg-secondary/10">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidate name or program..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {certificates.filter(c => 
                    (c.candidate_name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (c.program_name || "").toLowerCase().includes(search.toLowerCase()) ||
                    (c.certificate_id || "").toLowerCase().includes(search.toLowerCase())
                  ).length} issued certificates
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                  Loading certificates registry...
                </div>
              ) : certificates.filter(c => 
                (c.candidate_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.program_name || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.certificate_id || "").toLowerCase().includes(search.toLowerCase())
              ).length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <Award className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                  <h4 className="font-bold text-foreground text-sm">No Certificates Found</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                    No certificates have been issued yet. Click "Issue Certificate" above to generate one.
                  </p>
                </div>
              ) : (
                <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden text-left">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                        <th className="p-4 pl-6">Recipient Name</th>
                        <th className="p-4">Program / Domain Name</th>
                        <th className="p-4">Certificate Type</th>
                        <th className="p-4">Credential ID</th>
                        <th className="p-4">Issue Date</th>
                        <th className="p-4 pr-6 text-right font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {certificates.filter(c => 
                        (c.candidate_name || "").toLowerCase().includes(search.toLowerCase()) ||
                        (c.program_name || "").toLowerCase().includes(search.toLowerCase()) ||
                        (c.certificate_id || "").toLowerCase().includes(search.toLowerCase())
                      ).map((cert) => (
                        <tr key={cert.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-bold text-foreground block">{cert.candidate_name}</span>
                            {cert.recipient_email && (
                              <span className="text-[10px] text-muted-foreground block font-mono">{cert.recipient_email}</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-foreground">
                            {cert.program_name}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 capitalize">
                              {cert.certificate_type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-400">
                            {cert.certificate_id}
                          </td>
                          <td className="p-4 font-semibold text-foreground">
                            {cert.issue_date ? (
                              (() => {
                                const d = new Date(cert.issue_date);
                                return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric"
                                });
                              })()
                            ) : "N/A"}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex justify-end gap-2">
                              <a href={`/verify-certificate/${cert.id}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="h-8 text-[10px] rounded-lg border-border font-bold">
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> View / Verify
                                </Button>
                              </a>
                              <Button 
                                variant="outline"
                                onClick={() => handleEditCertificateClick(cert)} 
                                className="h-8 w-8 p-0 rounded-lg border-border hover:bg-primary/10"
                                title="Edit Certificate Info"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-primary" />
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => handleDeleteCertificate(cert.id)} 
                                className="h-8 w-8 p-0 rounded-lg border-border hover:bg-rose-500/10 hover:border-rose-500/20"
                                title="Revoke Certificate"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          MODAL: ADD COMPANY
         ========================================================================= */}
      {showAddCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="max-w-md w-full bg-background border border-border rounded-3xl p-6 md:p-8 shadow-lg space-y-5 animate-scale-in">
            <div className="pb-3 border-b border-border/40">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> {editingCompanyId ? "Edit Company Profile" : "Create Company Profile"}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">
                {editingCompanyId ? "Update existing details for this company profile." : "Specify basic details for the company profile."}
              </p>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Company Name</label>
                <Input
                  required
                  placeholder="e.g. ScaleXWeb Solutions"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Website URL (Optional)</label>
                  <Input
                    placeholder="https://company.com"
                    value={compWebsite}
                    onChange={(e) => setCompWebsite(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Logo Icon URL (Optional)</label>
                  <Input
                    placeholder="https://image-link.png"
                    value={compLogo}
                    onChange={(e) => setCompLogo(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Short Description</label>
                <Textarea
                  rows={3}
                  placeholder="Tell us about the company, its domains, and headquarters..."
                  value={compDesc}
                  onChange={(e) => setCompDesc(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseCompanyModal}
                  className="h-10 px-4 rounded-xl border-border text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={savingCompany}
                  className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs"
                >
                  {savingCompany ? "Saving Profile..." : (editingCompanyId ? "Save Changes" : "Save Company")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD CATEGORY
         ========================================================================= */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="max-w-md w-full bg-background border border-border rounded-3xl p-6 md:p-8 shadow-lg space-y-5 animate-scale-in">
            <div className="pb-3 border-b border-border/40">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-primary" /> Create Job Category
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Specify name for the new job category.</p>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Category / Department Name</label>
                <Input
                  required
                  placeholder="e.g. Sales or Engineering"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddCategory(false)}
                  className="h-10 px-4 rounded-xl border-border text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={savingCategory}
                  className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs"
                >
                  {savingCategory ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ISSUE CERTIFICATE
         ========================================================================= */}
      {showAddCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4">
          <div className="max-w-md w-full bg-background border border-border rounded-3xl p-6 md:p-8 shadow-lg space-y-5 animate-scale-in">
            <div className="pb-3 border-b border-border/40">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> {editingCertificateId ? "Edit Credential Details" : "Issue Verified Credential"}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">
                {editingCertificateId ? "Modify recipient and criteria details for this issued certificate." : "Specify recipient details and program criteria."}
              </p>
            </div>

            <form onSubmit={handleAddCertificateSubmit} className="space-y-4 text-xs text-left">
              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Candidate Full Name</label>
                <Input
                  required
                  placeholder="e.g. Yash Patel"
                  value={certCandidateName}
                  onChange={(e) => setCertCandidateName(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Program Name</label>
                <Input
                  required
                  placeholder="e.g. Web Development Internship Program"
                  value={certProgramName}
                  onChange={(e) => setCertProgramName(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Certificate Type</label>
                  <select
                    value={certType}
                    onChange={(e: any) => setCertType(e.target.value)}
                    className="w-full bg-background/60 border border-border/50 rounded-xl h-10 px-3 text-xs text-foreground focus:outline-none"
                  >
                    <option value="project_completion">Project Completion Certificate</option>
                    <option value="internship_completion">Internship Completion Certificate</option>
                    <option value="internship_participation">Internship Participation Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Issue Date</label>
                  <Input
                    type="date"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Recipient Email (Optional)</label>
                  <Input
                    type="email"
                    placeholder="candidate@email.com"
                    value={certEmail}
                    onChange={(e) => setCertEmail(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Credential ID {editingCertificateId ? "" : "(Optional)"}</label>
                  <Input
                    required={!!editingCertificateId}
                    placeholder="e.g. SCX-2026-01"
                    value={certCustomId}
                    onChange={(e) => setCertCustomId(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Custom Description (Optional - Fallbacks to default if empty)</label>
                <Textarea
                  placeholder="Describe candidate achievements or custom certificate text. Plaintext / HTML allowed."
                  value={certDescription}
                  onChange={(e) => setCertDescription(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs rounded-xl min-h-[70px] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setCertCandidateName("");
                    setCertProgramName("");
                    setCertCustomId("");
                    setCertEmail("");
                    setCertIssueDate("");
                    setCertDescription("");
                    setEditingCertificateId(null);
                    setShowAddCertificate(false);
                  }}
                  className="h-10 px-4 rounded-xl border-border text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={savingCertificate}
                  className="h-10 px-6 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs"
                >
                  {savingCertificate ? "Saving..." : (editingCertificateId ? "Save Changes" : "Generate Certificate")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default AdminJobsList;
