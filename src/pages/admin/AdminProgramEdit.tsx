import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  ArrowLeft, Save, Briefcase, Building, MapPin, 
  Layers, GraduationCap, DollarSign, Calendar, Sparkles, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job, JobCategory, Company, JobStatus, ExperienceLevel, JobType } from "@/types/jobPortal";
import { trackEvent } from "@/lib/analytics";

export const AdminProgramEdit = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Auth Guard Verification
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields State
  const [form, setForm] = useState({
    title: "",
    location: "Ahmedabad, India",
    category_id: "",
    company_id: "",
    experience_level: "entry" as ExperienceLevel,
    status: "draft" as JobStatus,
    application_deadline: "",
    description: "",
    requirements: "",
    responsibilities: "",
    education_ug: "Any Graduate",
    education_pg: "Any Postgraduate",
    job_role: "Internship Program",
    industry_type: "IT Services & Consulting",
    role_category: "Software Development",
    program_show_mentorship: true,
    program_show_hybrid: true,
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
            await supabase.auth.signInWithPassword({
              email: "scalexwebsolution@gmail.com",
              password: "S8321060"
            });
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

        // Pre-select defaults
        if (cats.length > 0) setForm((prev) => ({ ...prev, category_id: cats[0].id }));
        if (comps.length > 0) setForm((prev) => ({ ...prev, company_id: comps[0].id }));

        if (isEditMode && id) {
          const allJobs = await jobService.getAdminJobs();
          const jobToEdit = allJobs.find((j) => j.id === id);
          if (jobToEdit) {
            setForm({
              title: jobToEdit.title,
              location: jobToEdit.location,
              category_id: jobToEdit.category_id || "",
              company_id: jobToEdit.company_id || "",
              experience_level: jobToEdit.experience_level,
              status: jobToEdit.status,
              application_deadline: jobToEdit.application_deadline || "",
              description: jobToEdit.description,
              requirements: jobToEdit.requirements,
              responsibilities: jobToEdit.responsibilities || "",
              education_ug: jobToEdit.education_ug || "Any Graduate",
              education_pg: jobToEdit.education_pg || "Any Postgraduate",
              job_role: jobToEdit.job_role || "Internship Program",
              industry_type: jobToEdit.industry_type || "IT Services & Consulting",
              role_category: jobToEdit.role_category || "Software Development",
              program_show_mentorship: jobToEdit.program_show_mentorship !== false,
              program_show_hybrid: jobToEdit.program_show_hybrid !== false,
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
            toast.error("Internship Program not found");
            navigate("/admin/jobs");
          }
        }
      } catch (err) {
        console.error("Error loading program details:", err);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    loadFormDependencies();
  }, [id, isEditMode, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy text-foreground flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black">Unauthorized</h1>
          <p className="text-sm text-muted-foreground">Please log in to manage internship programs.</p>
          <Link to="/admin/jobs">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-xs">
              Go to CMS Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Program title is required");
      return;
    }
    if (!form.location.trim()) {
      toast.error("Location is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description details are required");
      return;
    }
    if (!form.requirements.trim()) {
      toast.error("Requirements details are required");
      return;
    }
    if (!form.program_show_mentorship && !form.program_show_hybrid) {
      toast.error("You must offer at least one package (Mentorship or Hybrid)");
      return;
    }

    if (form.program_show_mentorship && (!form.program_mentorship_price || isNaN(Number(form.program_mentorship_price)))) {
      toast.error("Mentorship Price must be a valid number");
      return;
    }
    if (form.program_show_hybrid && (!form.program_hybrid_price || isNaN(Number(form.program_hybrid_price)))) {
      toast.error("Hybrid Price must be a valid number");
      return;
    }

    try {
      const jobData = {
        title: form.title,
        location: form.location,
        category_id: form.category_id,
        company_id: form.company_id,
        job_type: "internship" as JobType,
        experience_level: form.experience_level,
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
        is_unpaid: false,
        is_internship_program: true,
        program_show_mentorship: form.program_show_mentorship,
        program_show_hybrid: form.program_show_hybrid,
        program_mentorship_price: form.program_show_mentorship ? Number(form.program_mentorship_price) : undefined,
        program_mentorship_features: form.program_show_mentorship ? form.program_mentorship_features.split("\n").map((f) => f.trim()).filter(Boolean) : undefined,
        program_hybrid_price: form.program_show_hybrid ? Number(form.program_hybrid_price) : undefined,
        program_hybrid_features: form.program_show_hybrid ? form.program_hybrid_features.split("\n").map((f) => f.trim()).filter(Boolean) : undefined
      };

      let result = null;
      if (isEditMode && id) {
        result = await jobService.updateJob(id, jobData);
        if (result) {
          toast.success("Internship Program updated successfully!");
          trackEvent("admin_job_updated", { job_id: id, job_title: jobData.title });
        }
      } else {
        result = await jobService.createJob(jobData);
        if (result) {
          toast.success("Internship Program created successfully!");
          trackEvent("admin_job_created", { job_title: jobData.title });
        }
      }

      if (result) {
        navigate("/admin/jobs");
      } else {
        toast.error("Failed to save internship program");
      }
    } catch (err: any) {
      console.error("Save program error:", err);
      toast.error(err?.message ? `Failed to save program: ${err.message}` : "Failed to save program");
    }
  };

  return (
    <div className="min-h-screen bg-navy text-foreground antialiased pb-12">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-navy/80 backdrop-blur-lg">
        <div className="container max-w-7xl h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link to="/admin/jobs">
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg hover:bg-card">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">CMS Panel</span>
              <h1 className="text-sm font-bold">{isEditMode ? "Edit Internship Program" : "Create Internship Program"}</h1>
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="bg-primary hover:bg-primary/95 text-white h-9 rounded-lg text-xs gap-1.5 px-4 font-bold"
          >
            <Save className="w-4 h-4" /> Save Program
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="border border-border/40 bg-card/20 rounded-3xl p-12 text-center">
            <p className="text-xs text-muted-foreground">Loading form settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs text-left">
            {/* Header Identity */}
            <div className="border border-border bg-card rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Program Identity</h2>
                  <p className="text-[10px] text-muted-foreground">Enter primary title and details of the internship program.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Internship Program Title</label>
                  <Input 
                    required
                    placeholder="e.g. Full Stack Web Development Internship Program"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Hosting Company</label>
                  <Select value={form.company_id} onValueChange={(val) => setForm({ ...form, company_id: val })}>
                    <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      {companies.map((comp) => (
                        <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Category / Domain</label>
                  <Select value={form.category_id} onValueChange={(val) => setForm({ ...form, category_id: val })}>
                    <SelectTrigger className="bg-background border-border/50 rounded-xl h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Location</label>
                  <Input 
                    required
                    placeholder="Ahmedabad, India (or Remote)"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
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
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Deadline Date</label>
                  <Input 
                    type="date"
                    value={form.application_deadline}
                    onChange={(e) => setForm({ ...form, application_deadline: e.target.value })}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Paid Packages (Mentorship & Hybrid) */}
            <div className="border border-border bg-card rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <DollarSign className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Program Pricing &amp; Features</h2>
                  <p className="text-[10px] text-muted-foreground">Configure mentorship and hybrid plan options.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pb-4 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="program_show_mentorship"
                    checked={form.program_show_mentorship}
                    onChange={(e) => setForm({ ...form, program_show_mentorship: e.target.checked })}
                    className="w-4 h-4 rounded border-primary bg-background text-primary accent-primary"
                  />
                  <label htmlFor="program_show_mentorship" className="font-semibold text-foreground cursor-pointer select-none text-xs">
                    Offer Mentorship Package
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="program_show_hybrid"
                    checked={form.program_show_hybrid}
                    onChange={(e) => setForm({ ...form, program_show_hybrid: e.target.checked })}
                    className="w-4 h-4 rounded border-purple-500 bg-background text-purple-600 accent-purple-500"
                  />
                  <label htmlFor="program_show_hybrid" className="font-semibold text-foreground cursor-pointer select-none text-xs">
                    Offer Hybrid Package
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Mentorship plan */}
                <div className={`space-y-4 p-4 bg-background/50 border border-border/60 rounded-2xl transition-all duration-300 ${form.program_show_mentorship ? "opacity-100" : "opacity-40 pointer-events-none bg-background/20"}`}>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${form.program_show_mentorship ? "bg-primary animate-pulse" : "bg-muted"}`} />
                    Mentorship Plan
                  </h3>
                  {form.program_show_mentorship ? (
                    <>
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Mentorship Price (INR)</label>
                        <Input 
                          type="number"
                          required
                          placeholder="e.g. 4500"
                          value={form.program_mentorship_price}
                          onChange={(e) => setForm({ ...form, program_mentorship_price: e.target.value })}
                          className="bg-background border-border/50 text-xs h-10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Features List (HTML allowed / One bullet per line)</label>
                        <Textarea 
                          rows={8}
                          required
                          placeholder="Enter mentorship bullets..."
                          value={form.program_mentorship_features}
                          onChange={(e) => setForm({ ...form, program_mentorship_features: e.target.value })}
                          className="bg-background border-border/50 text-xs rounded-xl"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-xs italic">
                      Mentorship package is disabled.
                    </div>
                  )}
                </div>

                {/* Hybrid plan */}
                <div className={`space-y-4 p-4 bg-background/50 border border-border/60 rounded-2xl transition-all duration-300 ${form.program_show_hybrid ? "opacity-100" : "opacity-40 pointer-events-none bg-background/20"}`}>
                  <h3 className="text-xs font-bold text-purple-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${form.program_show_hybrid ? "bg-purple-500 animate-pulse" : "bg-muted"}`} />
                    Hybrid Plan
                  </h3>
                  {form.program_show_hybrid ? (
                    <>
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Hybrid Price (INR)</label>
                        <Input 
                          type="number"
                          required
                          placeholder="e.g. 3500"
                          value={form.program_hybrid_price}
                          onChange={(e) => setForm({ ...form, program_hybrid_price: e.target.value })}
                          className="bg-background border-border/50 text-xs h-10 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-foreground/80 mb-1.5 block">Features List (HTML allowed / One bullet per line)</label>
                        <Textarea 
                          rows={8}
                          required
                          placeholder="Enter hybrid bullets..."
                          value={form.program_hybrid_features}
                          onChange={(e) => setForm({ ...form, program_hybrid_features: e.target.value })}
                          className="bg-background border-border/50 text-xs rounded-xl"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-xs italic">
                      Hybrid package is disabled.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description and requirements */}
            <div className="border border-border bg-card rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Content Details</h2>
                  <p className="text-[10px] text-muted-foreground">Describe the overview and syllabus requirements.</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Program Description (HTML allowed / Newline-separated)</label>
                <Textarea 
                  rows={6}
                  required
                  placeholder="Provide an overview description of the internship program..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="bg-background/60 border-border/50 text-xs rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Requirements &amp; Prerequisites (HTML allowed / Newline-separated)</label>
                <Textarea 
                  rows={5}
                  required
                  placeholder="e.g. Basic knowledge of JavaScript, laptop, etc."
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  className="bg-background border-border/50 text-xs rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Responsibilities (Optional) (HTML allowed / Newline-separated)</label>
                <Textarea 
                  rows={5}
                  placeholder="Describe projects or assignments..."
                  value={form.responsibilities}
                  onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                  className="bg-background border-border/50 text-xs rounded-xl leading-relaxed"
                />
              </div>
            </div>

            {/* Role & Industry parameters */}
            <div className="border border-border bg-card rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Metadata Classification</h2>
                  <p className="text-[10px] text-muted-foreground">Classifications for candidate search indexing.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Job Role Name</label>
                  <Input 
                    placeholder="e.g. Web Developer Intern"
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

                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">UG Qualification</label>
                  <Input 
                    placeholder="e.g. B.Tech/B.E. or BCA"
                    value={form.education_ug}
                    onChange={(e) => setForm({ ...form, education_ug: e.target.value })}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">PG Qualification</label>
                  <Input 
                    placeholder="e.g. M.Tech or MCA"
                    value={form.education_pg}
                    onChange={(e) => setForm({ ...form, education_pg: e.target.value })}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/30">
              <Link to="/admin/jobs">
                <Button variant="outline" className="border-border rounded-xl h-10 text-xs font-semibold px-6">
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleSubmit} 
                className="bg-primary hover:bg-primary/95 text-white h-10 rounded-xl text-xs gap-1.5 px-6 font-bold"
              >
                <Save className="w-4 h-4" /> Save Program
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdminProgramEdit;
