import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/jobService";
import { Job, JobType, ExperienceLevel } from "@/types/jobPortal";
import { trackEvent } from "@/lib/analytics";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  Send,
  Building2
} from "lucide-react";
import { toast } from "sonner";

export const JobDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadJobData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const fetchedJob = await jobService.getJobBySlug(slug);
        if (fetchedJob) {
          setJob(fetchedJob);
          // Check if saved locally
          const savedList = JSON.parse(localStorage.getItem("scalex_saved_job_ids") || "[]");
          setIsSaved(savedList.includes(fetchedJob.id));

          trackEvent("job_viewed", {
            job_id: fetchedJob.id,
            job_title: fetchedJob.title,
            category: fetchedJob.category?.name || "Uncategorized"
          });

          // Load related jobs
          const allJobs = await jobService.getJobs({ categoryId: fetchedJob.category_id });
          setRelatedJobs(allJobs.filter((j) => j.id !== fetchedJob.id).slice(0, 3));
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Error loading job details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobData();
  }, [slug]);

  const handleToggleSave = () => {
    if (!job) return;
    const savedList = JSON.parse(localStorage.getItem("scalex_saved_job_ids") || "[]");
    if (isSaved) {
      const filtered = savedList.filter((id: string) => id !== job.id);
      localStorage.setItem("scalex_saved_job_ids", JSON.stringify(filtered));
      setIsSaved(false);
      toast.success("Job removed from saved list");
    } else {
      savedList.push(job.id);
      localStorage.setItem("scalex_saved_job_ids", JSON.stringify(savedList));
      setIsSaved(true);
      toast.success("Job saved successfully!");
      trackEvent("job_saved", {
        job_id: job.id,
        job_title: job.title
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job?.title} | ScaleXWeb Careers`,
        text: `Check out this job opening for ${job?.title} at ScaleXWeb Solutions!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  const formatSalary = (min?: number, max?: number, currency = "INR", isUnpaid = false) => {
    if (isUnpaid) return "Unpaid";
    if (!min && !max) return "Undisclosed";
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)} / yr`;
    }
    return min ? `From ${formatter.format(min)} / yr` : `Up to ${formatter.format(max)} / yr`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  };

  const getExperienceLabel = (level: ExperienceLevel) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
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
        title={`${job.title} | Careers at ScaleXWeb`}
        description={job.description.replace(/<[^>]*>/g, "").slice(0, 150)}
        path={`/jobs/${job.slug}`}
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: job.title, path: `/jobs/${job.slug}` }
        ]}
        badge={job.category?.name || "Job Details"}
        headline={job.title}
        subheadline={`Open Position at ${job.company?.name || "ScaleXWeb Solution"}`}
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight">
          
          <div className="mb-6">
            <Link to="/jobs" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to all jobs
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Job Info Header Card */}
              <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border border-primary/10 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">
                        {job.category?.name}
                      </Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground rounded-full text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5">
                        {getJobTypeLabel(job.job_type)}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      {job.company?.name} &bull; <MapPin className="w-3.5 h-3.5 inline text-muted-foreground/60" /> {job.location}
                    </p>
                  </div>
                  
                  <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-1.5 text-xs text-foreground/80 font-bold self-start">
                    <span className="text-[10px] text-muted-foreground font-normal">Salary Range</span>
                    <span className="text-primary text-sm font-extrabold">{formatSalary(job.salary_min, job.salary_max, job.currency, job.is_unpaid)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-secondary/35 border border-border/30 rounded-xl space-y-1">
                    <span className="text-muted-foreground block text-[10px]">EXPERIENCE</span>
                    <span className="font-bold text-foreground block">{getExperienceLabel(job.experience_level)}</span>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-border/30 rounded-xl space-y-1">
                    <span className="text-muted-foreground block text-[10px]">JOB TYPE</span>
                    <span className="font-bold text-foreground block">{getJobTypeLabel(job.job_type)}</span>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-border/30 rounded-xl space-y-1">
                    <span className="text-muted-foreground block text-[10px]">LOCATION</span>
                    <span className="font-bold text-foreground block truncate">{job.location}</span>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-border/30 rounded-xl space-y-1">
                    <span className="text-muted-foreground block text-[10px]">DEADLINE</span>
                    <span className="font-bold text-foreground block">
                      {job.application_deadline 
                        ? new Date(job.application_deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                        : "Ongoing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description details */}
              <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Role Overview</h3>
                  <div 
                    className="text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-4 prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }} 
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Requirements</h3>
                  <div 
                    className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>

                {job.responsibilities && (
                  <div className="space-y-4 pt-4">
                    <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Key Responsibilities</h3>
                    <div 
                      className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                    />
                  </div>
                )}
                {/* Structured Role & Education Specifications Table */}
                <div className="space-y-4 pt-6 border-t border-border/40 mt-8">
                  <h3 className="text-base font-bold text-foreground pb-2 border-b border-border/40">Role &amp; Education Details</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-bold text-foreground text-right">{job.job_role || "Not Specified"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Industry Type</span>
                      <span className="font-bold text-foreground text-right">{job.industry_type || "IT Services & Consulting"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-bold text-foreground text-right">{job.category?.name || "Engineering"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Employment Type</span>
                      <span className="font-bold text-foreground text-right">{getJobTypeLabel(job.job_type)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Role Category</span>
                      <span className="font-bold text-foreground text-right">{job.role_category || "Software Development"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/20">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-bold text-foreground text-right">{getExperienceLabel(job.experience_level)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-secondary/35 border border-border/30 rounded-xl space-y-2.5">
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Education Requirements</h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Undergraduate (UG)</span>
                        <span className="font-bold text-foreground mt-0.5 block">{job.education_ug || "Any Graduate"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Postgraduate (PG)</span>
                        <span className="font-bold text-foreground mt-0.5 block">{job.education_pg || "Any Postgraduate"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {job.is_internship_program && (job.program_show_mentorship !== false || job.program_show_hybrid !== false) && (
                  <div className="space-y-6 pt-6 border-t border-border/40 mt-8">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-black font-heading text-foreground">
                        Enroll Now and Become One of 50,000+ Happy Learners!
                      </h3>
                      <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className={`grid gap-6 pt-4 ${
                      (job.program_show_mentorship !== false && job.program_show_hybrid !== false)
                        ? "md:grid-cols-2" 
                        : "max-w-md mx-auto grid-cols-1"
                    }`}>
                      {/* Mentorship Option Card */}
                      {job.program_show_mentorship !== false && (
                        <div className="gradient-border bg-card rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-6 shadow-sm border border-border/40 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                          <div className="space-y-3 w-full">
                            <span className="inline-block px-3 py-1 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                              Mentorship
                            </span>
                            <div className="space-y-1">
                              <div className="text-3xl font-black text-foreground">
                                ₹ {job.program_mentorship_price || 4500}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-semibold">
                                +18% GST
                              </div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => {
                              toast.success("Redirecting to Mentorship Program Payment Page...");
                              window.open("https://rzp.io/l/scalex-mentorship", "_blank");
                            }}
                            className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs"
                          >
                            Buy Now
                          </Button>

                          <ul className="text-left text-xs text-muted-foreground space-y-2.5 w-full pt-4 border-t border-border/20">
                            {Array.isArray(job.program_mentorship_features) && job.program_mentorship_features.length > 0 ? (
                              job.program_mentorship_features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-0.5 shrink-0 text-[10px]">🔸</span>
                                  <span className="leading-tight" dangerouslySetInnerHTML={{ __html: feat }} />
                                </li>
                              ))
                            ) : (
                              [
                                "Program Duration : 2 months",
                                "30 Hours of Content",
                                "3 Projects",
                                "Live Sessions During Project Execution & Training",
                                "Life time access for content and Customised Dashboard",
                                "Project Completion Certificate from Partnered Companies",
                                "Internship Offer Letter",
                                "Internship Completion Certificate",
                                "Customised Resume Builder"
                              ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary mt-0.5 shrink-0 text-[10px]">🔸</span>
                                  <span className="leading-tight" dangerouslySetInnerHTML={{ __html: feat }} />
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Hybrid Option Card */}
                      {job.program_show_hybrid !== false && (
                        <div className="gradient-border bg-card rounded-3xl p-6 flex flex-col justify-between items-center text-center space-y-6 shadow-sm border border-border/40 hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                          <div className="space-y-3 w-full">
                            <span className="inline-block px-3 py-1 rounded-lg bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wider">
                              Hybrid
                            </span>
                            <div className="space-y-1">
                              <div className="text-3xl font-black text-foreground">
                                ₹ {job.program_hybrid_price || 3500}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-semibold">
                                +18% GST
                              </div>
                            </div>
                          </div>

                          <Button 
                            onClick={() => {
                              toast.success("Redirecting to Hybrid Program Payment Page...");
                              window.open("https://rzp.io/l/scalex-hybrid", "_blank");
                            }}
                            className="w-full h-11 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs"
                          >
                            Buy Now
                          </Button>

                          <ul className="text-left text-xs text-muted-foreground space-y-2.5 w-full pt-4 border-t border-border/20">
                            {Array.isArray(job.program_hybrid_features) && job.program_hybrid_features.length > 0 ? (
                              job.program_hybrid_features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-0.5 shrink-0 text-[10px]">🔸</span>
                                  <span className="leading-tight" dangerouslySetInnerHTML={{ __html: feat }} />
                                </li>
                              ))
                            ) : (
                              [
                                "Program Duration : 2 months",
                                "30 Hours of Content",
                                "3 Major Projects",
                                "1 year Access for Dashboard and Content",
                                "Project Completion Certificate",
                                "Internship Offer Letter",
                                "Internship Completion Certificate"
                              ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-0.5 shrink-0 text-[10px]">🔸</span>
                                  <span className="leading-tight" dangerouslySetInnerHTML={{ __html: feat }} />
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Sticky Actions Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="border border-border bg-card rounded-2xl p-6 shadow-sm sticky top-24 space-y-4">
                <h4 className="font-bold text-foreground text-sm">
                  {job.is_internship_program ? "Ready to Enroll?" : "Interested in this role?"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {job.is_internship_program 
                    ? "Select one of our professional paid internship packages below and enroll instantly to start your learning journey."
                    : "Submit your application detailing your experiences and portfolio today. Our recruitment team reviews inquiries within 48 hours."}
                </p>
                
                <div className="space-y-3 pt-2">
                  {job.is_internship_program ? (
                    <div className="space-y-2.5">
                      {job.program_show_mentorship !== false && (
                        <Button 
                          onClick={() => {
                            toast.success("Redirecting to Mentorship Program Payment Page...");
                            window.open("https://rzp.io/l/scalex-mentorship", "_blank");
                          }}
                          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-1.5 text-xs font-semibold"
                        >
                          Buy Mentorship (₹{job.program_mentorship_price || 4500})
                        </Button>
                      )}
                      {job.program_show_hybrid !== false && (
                        <Button 
                          onClick={() => {
                            toast.success("Redirecting to Hybrid Program Payment Page...");
                            window.open("https://rzp.io/l/scalex-hybrid", "_blank");
                          }}
                          className="w-full h-11 rounded-xl bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-1.5 text-xs font-semibold"
                        >
                          Buy Hybrid (₹{job.program_hybrid_price || 3500})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Link 
                      to={`/jobs/${job.slug}/apply`} 
                      onClick={() => trackEvent("job_application_started", { job_id: job.id, job_title: job.title })}
                      className="block w-full"
                    >
                      <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 text-xs font-semibold">
                        <Send className="w-4 h-4" /> Apply For This Job
                      </Button>
                    </Link>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleToggleSave} 
                      className="h-10 rounded-xl border-border text-xs flex items-center justify-center gap-1.5"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-primary" /> Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" /> Save
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShare} 
                      className="h-10 rounded-xl border-border text-xs flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                </div>

                {job.application_deadline && (
                  <div className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/30">
                    Application deadline: {new Date(job.application_deadline).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                )}

                <div className="pt-4 border-t border-border/30 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-sm border border-border/10">
                    <img src="/MSME.webp" alt="MSME Logo" className="h-12 w-auto object-contain" />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-[9px] font-bold text-primary block uppercase tracking-wider">Registered Enterprise</span>
                    <h5 className="text-xs font-extrabold text-foreground leading-tight mt-0.5">Ministry of MSME</h5>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Govt. of India</span>
                  </div>
                </div>
              </div>

              {/* Related Jobs Section */}
              {relatedJobs.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">Related Openings</h4>
                  <div className="space-y-3">
                    {relatedJobs.map((rJob) => (
                      <Link 
                        key={rJob.id} 
                        to={`/jobs/${rJob.slug}`}
                        className="block border border-border bg-card hover:bg-card/75 rounded-xl p-4 transition-all duration-300 hover:shadow-sm"
                      >
                        <h5 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate">{rJob.title}</h5>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          {rJob.location} &bull; {getJobTypeLabel(rJob.job_type)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JobDetails;
