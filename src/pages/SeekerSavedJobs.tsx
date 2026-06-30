import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Job, JobType } from "@/types/jobPortal";
import { Bookmark, MapPin, Briefcase, DollarSign, ChevronRight, BookmarkX } from "lucide-react";
import { toast } from "sonner";

export const SeekerSavedJobs = () => {
  const [candidateId, setCandidateId] = useState<string>("seeker-mock-user");
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSavedJobs = async () => {
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

        const list = await jobService.getSavedJobs(activeUserId);
        setSavedJobs(list);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      const success = await jobService.toggleSaveJob(candidateId, jobId);
      if (success) {
        toast.success("Job removed from saved list");
        setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        toast.error("Failed to remove saved job");
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
      toast.error("Could not complete unsave operation");
    }
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
    return min ? `From ${formatter.format(min)} / yr` : `Up to ${formatter.format(max)} / yr`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  };

  return (
    <Layout>
      <SEO
        title="Saved Jobs | Bookmarks"
        description="View your saved career opportunities and apply later."
        path="/dashboard/saved-jobs"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: "Saved Jobs", path: "/dashboard/saved-jobs" }
        ]}
        badge="Bookmarks"
        headline="Saved Opportunities."
        subheadline="Access your bookmarked positions and submit your applications at your convenience."
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight max-w-4xl">
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-4 border-b border-border/40 mb-6">
            <span>You have bookmarked <strong className="text-foreground">{savedJobs.length}</strong> positions</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="border border-border/50 bg-card/50 rounded-xl p-6 h-28 animate-pulse" />
              ))}
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base mb-1">No bookmarked jobs</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                You haven't bookmarked any jobs yet. Browse open roles in the careers directory to save listings for later.
              </p>
              <Link to="/jobs">
                <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs font-semibold px-6">
                  Browse Open Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <div 
                  key={job.id}
                  className="group block border border-border bg-card rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border border-primary/10 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                          {job.category?.name}
                        </Badge>
                        <Badge variant="outline" className="border-border text-muted-foreground rounded-full text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                          {getJobTypeLabel(job.job_type)}
                        </Badge>
                      </div>
                      
                      <h3 className="font-heading font-bold text-base text-foreground leading-tight">
                        {job.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {formatSalary(job.salary_min, job.salary_max, job.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button 
                        variant="outline" 
                        onClick={() => handleRemove(job.id)}
                        className="h-10 w-10 p-0 rounded-xl border-border text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20"
                        title="Remove Bookmark"
                      >
                        <BookmarkX className="w-4 h-4" />
                      </Button>
                      
                      <Link to={`/jobs/${job.slug}`}>
                        <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 px-4 text-xs font-semibold gap-1">
                          View details <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default SeekerSavedJobs;
