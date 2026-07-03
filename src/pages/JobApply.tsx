import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job } from "@/types/jobPortal";
import { trackEvent } from "@/lib/analytics";
import { ArrowLeft, Send, Upload, FileText, CheckCircle, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

export const JobApply = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [candidateId, setCandidateId] = useState<string>("seeker-mock-user");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    const fetchJobAndUser = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const fetchedJob = await jobService.getJobBySlug(slug);
        if (fetchedJob) {
          setJob(fetchedJob);
        }

        let currentUserId = "";

        // Fetch auth user details from Supabase if configured
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            currentUserId = data.user.id;
            setCandidateId(currentUserId);
            setFullName(data.user.user_metadata?.full_name || data.user.user_metadata?.name || "");
            setEmail(data.user.email || "");
          } else {
            toast.info("Please log in or register to submit your application");
            navigate(`/careers/auth?redirect=/jobs/${slug}/apply`);
            return;
          }
        } else {
          const mockAuth = sessionStorage.getItem("scalex_mock_seeker_auth");
          if (!mockAuth) {
            toast.info("Please log in or register to submit your application");
            navigate(`/careers/auth?redirect=/jobs/${slug}/apply`);
            return;
          }
          currentUserId = "seeker-mock-user";
          setCandidateId(currentUserId);
        }

        // Fetch and verify candidate profile is complete
        const profile = await jobService.getProfile(currentUserId);
        if (profile) {
          const isComplete = 
            !!profile.full_name?.trim() &&
            !!profile.phone?.trim() &&
            !!profile.headline?.trim() &&
            !!profile.education?.trim() &&
            profile.experience_years !== undefined &&
            profile.experience_years !== null &&
            Array.isArray(profile.skills) &&
            profile.skills.length > 0 &&
            !!profile.resume_url?.trim();

          if (!isComplete) {
            toast.warning("Profile incomplete! You must fill out your profile details (name, phone, education, headline, skills) and upload a resume before applying.");
            navigate(`/dashboard/profile?redirect=/jobs/${slug}/apply`);
            return;
          }

          // Pre-populate fields from the complete profile
          setFullName(profile.full_name || "");
          if (profile.email) {
            setEmail(profile.email);
          }
          setPhone(profile.phone || "");
          setProfileResumeUrl(profile.resume_url || "");
        } else {
          toast.warning("Please complete your profile details first before submitting applications.");
          navigate(`/dashboard/profile?redirect=/jobs/${slug}/apply`);
          return;
        }

      } catch (err) {
        console.error("Error setting up application form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobAndUser();
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const validTypes = ["pdf", "doc", "docx"];
      
      if (!validTypes.includes(ext || "")) {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setResumeFile(file);
      toast.success(`Selected resume: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your contact phone number");
      return;
    }
    if (!expectedSalary.trim()) {
      toast.error("Please enter your expected salary");
      return;
    }
    if (!noticePeriod.trim()) {
      toast.error("Please enter your notice period");
      return;
    }
    if (!resumeFile && !profileResumeUrl) {
      toast.error("Please upload your resume");
      return;
    }
    if (!consentAccepted) {
      toast.error("You must accept the Privacy Policy and Terms of Service to apply.");
      return;
    }

    try {
      setSubmitting(true);
      
      // 1. Upload Resume File or use the existing profile resume URL
      let finalResumeUrl = profileResumeUrl;
      if (resumeFile) {
        finalResumeUrl = await jobService.uploadResume(resumeFile);
      }
      
      // 2. Submit Application
      await jobService.applyToJob({
        job_id: job!.id,
        applicant_id: candidateId,
        resume_url: finalResumeUrl,
        cover_letter: coverLetter || undefined,
        expected_salary: expectedSalary ? Number(expectedSalary) : undefined,
        notice_period: noticePeriod ? Number(noticePeriod) : undefined
      });

      // 3. Auto-sync name, phone, and resume to candidate profile
      try {
        const existingProfile = await jobService.getProfile(candidateId);
        await jobService.updateProfile(candidateId, {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          resume_url: finalResumeUrl,
          skills: existingProfile?.skills || [],
          education: existingProfile?.education || "",
          headline: existingProfile?.headline || "Software Professional",
          experience_years: existingProfile?.experience_years || 0
        });
      } catch (profileErr) {
        console.error("Failed to auto-sync applicant profile details:", profileErr);
      }

      toast.success("Application submitted successfully!");
      trackEvent("job_application_submitted", {
        job_id: job!.id,
        job_title: job!.title
      });
      
      // Save applicant details locally for mock tracking
      localStorage.setItem("scalex_last_applicant_id", candidateId);
      
      navigate("/dashboard/applications");
    } catch (err: any) {
      console.error("Application error:", err);
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="section-padding min-h-[60vh] flex flex-col items-center justify-center text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Job Opening Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            The job listing you are looking for might have expired, been closed, or does not exist.
          </p>
          <Link to="/jobs">
            <Button variant="outline" className="rounded-xl border-border">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`Apply for ${job.title} | ScaleXWeb`}
        description={`Submit your application for the ${job.title} position at ScaleXWeb Solutions.`}
        path={`/jobs/${job.slug}/apply`}
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: job.title, path: `/jobs/${job.slug}` },
          { name: "Apply", path: `/jobs/${job.slug}/apply` }
        ]}
        badge="Job Application"
        headline="Submit Your Application"
        subheadline={`Role: ${job.title} at ${job.company?.name || "ScaleXWeb Solutions"}`}
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight max-w-3xl">
          
          <div className="mb-6">
            <Link to={`/jobs/${job.slug}`} className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Job Details
            </Link>
          </div>

          <div className="border border-border bg-card rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
            <div className="pb-4 border-b border-border/40">
              <h2 className="text-lg font-bold text-foreground">Apply for {job.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Please complete the form below. We will review your application and respond within 2-3 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-left">
              
              {/* Personal Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Full Name</label>
                  <Input
                    required
                    placeholder="Amit Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Email Address</label>
                  <Input
                    type="email"
                    required
                    readOnly
                    placeholder="amit.sharma@example.com"
                    value={email}
                    className="bg-background/40 border-border/50 text-xs h-10 rounded-xl cursor-not-allowed text-muted-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Contact Phone</label>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 99887 76655"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Expected Salary (Annual INR)</label>
                  <Input
                    type="number"
                    required
                    placeholder="e.g. 1200000"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground/80 mb-1.5 block">Notice Period (Days)</label>
                  <Input
                    type="number"
                    required
                    placeholder="e.g. 30"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Resume Upload File input */}
              <div className="space-y-2">
                <label className="font-semibold text-foreground/80 block">Resume Upload (PDF, DOC, DOCX up to 5MB)</label>
                <div className="border border-dashed border-border hover:border-primary/40 transition-colors bg-secondary/20 rounded-2xl p-6 text-center relative cursor-pointer group">
                  <input
                    type="file"
                    required={!resumeFile && !profileResumeUrl}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto text-primary group-hover:scale-105 transition-transform">
                      {resumeFile || profileResumeUrl ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                    {resumeFile ? (
                      <div>
                        <span className="font-bold text-foreground block text-xs">{resumeFile.name}</span>
                        <span className="text-[10px] text-muted-foreground">Click or drag to replace ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      </div>
                    ) : profileResumeUrl ? (
                      <div>
                        <span className="font-bold text-foreground block text-xs">Using Profile Resume</span>
                        <span className="text-[10px] text-muted-foreground">
                          {profileResumeUrl.split("/").pop() || "Uploaded Resume Document"} (Click or drag to replace)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-foreground block text-xs">Upload Resume File</span>
                        <span className="text-[10px] text-muted-foreground">Select PDF, DOC, or DOCX formats</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="font-semibold text-foreground/80 mb-1.5 block">Cover Letter (Optional)</label>
                <Textarea
                  rows={5}
                  placeholder="Introduce yourself, specify key achievements, and mention why you want to work with us..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="bg-background/60 border-border/50 text-xs rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2 select-none">
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
                  I agree to the{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    Terms of Service
                  </a>{" "}
                  regarding the submission of my job application.
                </span>
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                <Link to={`/jobs/${job.slug}`}>
                  <Button variant="outline" className="h-11 px-6 rounded-xl border-border">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={submitting || !consentAccepted}
                  className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default JobApply;
