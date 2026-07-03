import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job, JobCategory, Company, JobStatus, JobType, ExperienceLevel } from "@/types/jobPortal";
import { ArrowLeft, Lock, Save, Briefcase, FileText, Settings, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

export const AdminJobEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields State
  const [form, setForm] = useState({
    title: "",
    location: "",
    category_id: "",
    company_id: "",
    job_type: "full_time" as JobType,
    experience_level: "mid" as ExperienceLevel,
    salary_min: "",
    salary_max: "",
    currency: "INR",
    status: "draft" as JobStatus,
    application_deadline: "",
    description: "",
    requirements: "",
    responsibilities: "",
    education_ug: "Any Graduate",
    education_pg: "Any Postgraduate",
    job_role: "",
    industry_type: "IT Services & Consulting",
    role_category: "Software Development",
    is_unpaid: false,
    is_internship_program: false,
    program_mentorship_price: "4500",
    program_mentorship_features: [
      "Program Duration : 2 months",
      "30 Hours of Content",
      "3 Projects",
      "Live Sessions During Project Execution & Training",
      "Life time access for content and Customised Dashboard",
      "Project Completion Certificate from Partnered Companies",
      "Internship Offer Letter",
      "Internship Completion Certificate",
      "Customised Resume Builder"
    ].join("\n"),
    program_hybrid_price: "3500",
    program_hybrid_features: [
      "Program Duration : 2 months",
      "30 Hours of Content",
      "3 Major Projects",
      "1 year Access for Dashboard and Content",
      "Project Completion Certificate",
      "Internship Offer Letter",
      "Internship Completion Certificate"
    ].join("\n")
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadFormDependencies = async () => {
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

      try {
        setLoading(true);
        const [cats, comps] = await Promise.all([
          jobService.getCategories(),
          jobService.getCompanies()
        ]);
        setCategories(cats);
        setCompanies(comps);

        // Pre-select default IDs if categories / companies exist
        if (cats.length > 0) setForm((prev) => ({ ...prev, category_id: cats[0].id }));
        if (comps.length > 0) setForm((prev) => ({ ...prev, company_id: comps[0].id }));

        // Check query parameters for default type
        const queryType = new URLSearchParams(window.location.search).get("type");
        if (queryType === "internship") {
          setForm((prev) => ({
            ...prev,
            job_type: "internship",
            is_unpaid: true
          }));
        }

        if (isEditMode && id) {
          // Find the job to load
          const allJobs = await jobService.getAdminJobs();
          const jobToEdit = allJobs.find((j) => j.id === id);
          if (jobToEdit) {
            setForm({
              title: jobToEdit.title,
              location: jobToEdit.location,
              category_id: jobToEdit.category_id || "",
              company_id: jobToEdit.company_id || "",
              job_type: jobToEdit.job_type,
              experience_level: jobToEdit.experience_level,
              salary_min: jobToEdit.salary_min ? String(jobToEdit.salary_min) : "",
              salary_max: jobToEdit.salary_max ? String(jobToEdit.salary_max) : "",
              currency: jobToEdit.currency || "INR",
              status: jobToEdit.status,
              application_deadline: jobToEdit.application_deadline || "",
              description: jobToEdit.description,
              requirements: jobToEdit.requirements,
              responsibilities: jobToEdit.responsibilities || "",
              education_ug: jobToEdit.education_ug || "Any Graduate",
              education_pg: jobToEdit.education_pg || "Any Postgraduate",
              job_role: jobToEdit.job_role || "",
              industry_type: jobToEdit.industry_type || "IT Services & Consulting",
              role_category: jobToEdit.role_category || "Software Development",
              is_unpaid: jobToEdit.is_unpaid || false,
              is_internship_program: jobToEdit.is_internship_program || false,
              program_mentorship_price: jobToEdit.program_mentorship_price ? String(jobToEdit.program_mentorship_price) : "4500",
              program_mentorship_features: Array.isArray(jobToEdit.program_mentorship_features)
                ? jobToEdit.program_mentorship_features.join("\n")
                : [
                    "Program Duration : 2 months",
                    "30 Hours of Content",
                    "3 Projects",
                    "Live Sessions During Project Execution & Training",
                    "Life time access for content and Customised Dashboard",
                    "Project Completion Certificate from Partnered Companies",
                    "Internship Offer Letter",
                    "Internship Completion Certificate",
                    "Customised Resume Builder"
                  ].join("\n"),
              program_hybrid_price: jobToEdit.program_hybrid_price ? String(jobToEdit.program_hybrid_price) : "3500",
              program_hybrid_features: Array.isArray(jobToEdit.program_hybrid_features)
                ? jobToEdit.program_hybrid_features.join("\n")
                : [
                    "Program Duration : 2 months",
                    "30 Hours of Content",
                    "3 Major Projects",
                    "1 year Access for Dashboard and Content",
                    "Project Completion Certificate",
                    "Internship Offer Letter",
                    "Internship Completion Certificate"
                  ].join("\n")
            });
          } else {
            toast.error("Job posting not found for editing");
            navigate("/admin/jobs");
          }
        }
      } catch (err) {
        console.error("Error loading job dependencies:", err);
        toast.error("Failed to load form details");
      } finally {
        setLoading(false);
      }
    };

    loadFormDependencies();
  }, [isAuthenticated, isEditMode, id, navigate]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!form.location.trim()) {
      toast.error("Location details are required");
      return;
    }
    if (!form.category_id) {
      toast.error("Job category is required");
      return;
    }
    if (!form.company_id) {
      toast.error("Company selection is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Job description is required");
      return;
    }
    if (!form.requirements.trim()) {
      toast.error("Requirements details are required");
      return;
    }

    try {
      const jobData = {
        title: form.title,
        location: form.location,
        category_id: form.category_id,
        company_id: form.company_id,
        job_type: form.job_type,
        experience_level: form.experience_level,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
        currency: form.currency,
        status: form.status,
        application_deadline: form.application_deadline || undefined,
        description: form.description,
        requirements: form.requirements,
        responsibilities: form.responsibilities || undefined,
        education_ug: form.education_ug || undefined,
        education_pg: form.education_pg || undefined,
        job_role: form.job_role || undefined,
        industry_type: form.industry_type || undefined,
        role_category: form.role_category || undefined,
        is_unpaid: form.is_unpaid,
        is_internship_program: form.job_type === "internship" ? form.is_internship_program : false,
        program_mentorship_price: (form.job_type === "internship" && form.is_internship_program) ? Number(form.program_mentorship_price) : undefined,
        program_mentorship_features: (form.job_type === "internship" && form.is_internship_program) ? form.program_mentorship_features.split("\n").map((f) => f.trim()).filter(Boolean) : undefined,
        program_hybrid_price: (form.job_type === "internship" && form.is_internship_program) ? Number(form.program_hybrid_price) : undefined,
        program_hybrid_features: (form.job_type === "internship" && form.is_internship_program) ? form.program_hybrid_features.split("\n").map((f) => f.trim()).filter(Boolean) : undefined
      };

      let result = null;
      if (isEditMode && id) {
        result = await jobService.updateJob(id, jobData);
        if (result) {
          toast.success("Job posting updated successfully!");
          trackEvent("admin_job_updated", {
            job_id: id,
            job_title: jobData.title
          });
        }
      } else {
        result = await jobService.createJob(result ? { ...jobData, slug: "" } : jobData);
        if (result) {
          toast.success("Job posting created successfully!");
          trackEvent("admin_job_created", {
            job_title: jobData.title
          });
        }
      }

      if (result) {
        navigate("/admin/jobs");
      } else {
        toast.error("Failed to save job details");
      }
    } catch (err: any) {
      console.error("Save job error:", err);
      toast.error(err?.message ? `Database operation failed: ${err.message}` : "Database operation failed");
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

  return (
    <Layout>
      <SEO title={`${isEditMode ? "Edit Job Posting" : "New Job Posting"} | ScaleXWeb`} description="Create or edit a career opportunity." path="/admin/jobs" />

      <section className="section-padding bg-background pt-24 min-h-screen">
        <div className="container-tight max-w-4xl">
          
          <div className="mb-6">
            <Link to="/admin/jobs" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Recruiter Dashboard
            </Link>
          </div>

          <div className="border border-border bg-card rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-border/40">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> {isEditMode ? "Edit Job Posting" : "Post a New Job"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Specify requirements, parameters, and roles details.</p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                Loading form data...
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs text-left">
                
                {/* Section: Job Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Job Title</label>
                      <Input
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Location</label>
                      <Input
                        required
                        placeholder="e.g. Remote (India) or Ahmedabad, India"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Category / Department</label>
                      <Select value={form.category_id} onValueChange={(val) => setForm({ ...form, category_id: val })}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Company Profile</label>
                      <Select value={form.company_id} onValueChange={(val) => setForm({ ...form, company_id: val })}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          {companies.map((comp) => (
                            <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section: Job Settings */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Parameters &amp; Type</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Job Type</label>
                      <Select value={form.job_type} onValueChange={(val) => setForm({ ...form, job_type: val as JobType })}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="full_time">Full-time</SelectItem>
                          <SelectItem value="part_time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Experience Level</label>
                      <Select value={form.experience_level} onValueChange={(val) => setForm({ ...form, experience_level: val as ExperienceLevel })}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="lead">Lead / Architect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Status</label>
                      <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val as JobStatus })}>
                        <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border">
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published (Live)</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-semibold text-foreground/80 block">Annual Salary Range (INR)</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id="is_unpaid"
                            checked={form.is_unpaid}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setForm({
                                ...form,
                                is_unpaid: checked,
                                salary_min: checked ? "" : form.salary_min,
                                salary_max: checked ? "" : form.salary_max
                              });
                            }}
                            className="w-3.5 h-3.5 rounded border-border bg-background text-primary accent-primary"
                          />
                          <label htmlFor="is_unpaid" className="text-[11px] font-semibold text-primary cursor-pointer select-none">
                            Unpaid / Volunteer
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          disabled={form.is_unpaid}
                          placeholder={form.is_unpaid ? "Unpaid" : "Min (e.g. 600000)"}
                          value={form.salary_min}
                          onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                          className="bg-background/60 border-border/50 text-xs h-10 rounded-xl w-full disabled:opacity-50"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          disabled={form.is_unpaid}
                          placeholder={form.is_unpaid ? "Unpaid" : "Max (e.g. 1200000)"}
                          value={form.salary_max}
                          onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                          className="bg-background/60 border-border/50 text-xs h-10 rounded-xl w-full disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Application Deadline</label>
                      <Input
                        type="date"
                        value={form.application_deadline}
                        onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                </div>

                {/* Section: Job Role & Education Requirements */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role, Industry &amp; Education</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Job Role</label>
                      <Input
                        placeholder="e.g. Mobile / App Developer"
                        value={form.job_role}
                        onChange={(e) => setForm({ ...form, job_role: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Industry Type</label>
                      <Input
                        placeholder="e.g. IT Services & Consulting"
                        value={form.industry_type}
                        onChange={(e) => setForm({ ...form, industry_type: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Role Category</label>
                      <Input
                        placeholder="e.g. Software Development"
                        value={form.role_category}
                        onChange={(e) => setForm({ ...form, role_category: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">UG Education Requirement</label>
                      <Input
                        placeholder="e.g. Any Graduate"
                        value={form.education_ug}
                        onChange={(e) => setForm({ ...form, education_ug: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">PG Education Requirement</label>
                      <Input
                        placeholder="e.g. Any Postgraduate"
                        value={form.education_pg}
                        onChange={(e) => setForm({ ...form, education_pg: e.target.value })}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Rich Details */}
                <div className="space-y-4 pt-4 border-t border-border/40">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description &amp; Requirements</h3>
                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Job Description (HTML allowed)</label>
                    <Textarea
                      required
                      rows={6}
                      placeholder="Detail the role, team, and company culture using <p>, <h3>, <ul> and <li> tags..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="bg-background/60 border-border/50 text-xs rounded-xl font-mono leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Requirements Details (Plaintext / Newline-separated)</label>
                    <Textarea
                      required
                      rows={4}
                      placeholder="Specify experience, technical skills, core qualifications..."
                      value={form.requirements}
                      onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                      className="bg-background/60 border-border/50 text-xs rounded-xl leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Responsibilities Details (Optional)</label>
                    <Textarea
                      rows={4}
                      placeholder="Daily duties, leadership roles, project deliverables..."
                      value={form.responsibilities}
                      onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                      className="bg-background/60 border-border/50 text-xs rounded-xl leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                  <Link to="/admin/jobs">
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> Save Job Posting
                  </Button>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default AdminJobEdit;
