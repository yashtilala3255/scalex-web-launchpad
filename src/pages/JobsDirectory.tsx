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
import { Job, JobCategory, JobType, ExperienceLevel } from "@/types/jobPortal";
import { Search, MapPin, Briefcase, DollarSign, Calendar, ChevronRight, X, Filter } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const JobsDirectory = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [cats, jobList] = await Promise.all([
          jobService.getCategories(),
          jobService.getJobs()
        ]);
        setCategories(cats);
        setJobs(jobList);
      } catch (err) {
        console.error("Error loading jobs data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Handle filter submissions
  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      if (search) filterParams.search = search;
      if (selectedCategory !== "all") filterParams.categoryId = selectedCategory;
      if (selectedType !== "all") filterParams.jobType = selectedType;
      if (selectedLevel !== "all") filterParams.experienceLevel = selectedLevel;
      if (location) filterParams.location = location;

      trackEvent("job_search", {
        keyword: search || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        location: location || undefined
      });

      const results = await jobService.getJobs(filterParams);
      setJobs(results);
    } catch (err) {
      console.error("Error filtering jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = async () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSelectedLevel("all");
    setLocation("");
    try {
      setLoading(true);
      const results = await jobService.getJobs();
      setJobs(results);
    } catch (err) {
      console.error("Error resetting filters:", err);
    } finally {
      setLoading(false);
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

  const timeAgo = (dateStr: string) => {
    try {
      const created = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Posted today";
      if (diffDays === 1) return "Posted yesterday";
      return `Posted ${diffDays} days ago`;
    } catch {
      return "Posted recently";
    }
  };

  const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    return htmlStr.replace(/<[^>]*>/g, "");
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  };

  const getExperienceLabel = (level: ExperienceLevel) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <Layout>
      <SEO
        title="Careers & Open Jobs | ScaleXWeb Solutions"
        description="Join the ScaleXWeb Solutions team. Browse our open positions in engineering, UI/UX design, marketing, and sales."
        path="/jobs"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" }
        ]}
        badge="Careers"
        headline="Join Our Growing Global Team."
        subheadline="We build premium digital solutions. Explore our open roles and find your next challenge."
      />

      <section className="section-padding bg-background relative z-10 -mt-8 pt-0">
        <div className="container-tight">
          
          {/* Recognized By Badge Bar */}
          <div className="flex justify-center mb-8">
            <div className="bg-card border border-border/60 rounded-2xl px-8 py-5 flex items-center justify-center gap-5 max-w-md w-full shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="bg-white p-2.5 rounded-xl shrink-0 flex items-center justify-center shadow-sm border border-border/10">
                <img src="/MSME.webp" alt="MSME Logo" className="h-14 w-auto object-contain" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-primary block uppercase tracking-wider">Recognized Government Enterprise</span>
                <h4 className="text-sm font-extrabold text-foreground leading-tight mt-0.5">Registered under Ministry of MSME</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Government of India</p>
              </div>
            </div>
          </div>

          {/* Search Bar Grid */}
          <div className="border border-border bg-card rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search job title, skills, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 text-sm h-11 rounded-xl"
              />
            </div>
            <div className="relative md:w-60">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. Remote, City)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 text-sm h-11 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilters} className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/95 text-white flex-grow md:flex-grow-0">
                Search Jobs
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="h-11 rounded-xl px-3 md:hidden border-border"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="border border-border bg-card rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-5">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" /> Filter Options
                  </h3>
                  <button onClick={handleResetFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                    Reset All
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  {/* Category Filter */}
                  <div>
                    <label className="font-semibold text-foreground/80 mb-2 block">Job Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
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

                  {/* Job Type Filter */}
                  <div>
                    <label className="font-semibold text-foreground/80 mb-2 block">Job Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="border-border">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full_time">Full-time</SelectItem>
                        <SelectItem value="part_time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Level Filter */}
                  <div>
                    <label className="font-semibold text-foreground/80 mb-2 block">Experience Level</label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent className="border-border">
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="lead">Lead / Architect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleApplyFilters} className="w-full mt-4 h-10 rounded-xl bg-primary text-white text-xs font-semibold">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Jobs List Grid */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
                <span>Showing <strong className="text-foreground">{jobs.length}</strong> open positions</span>
                {(selectedCategory !== "all" || selectedType !== "all" || selectedLevel !== "all" || search || location) && (
                  <button onClick={handleResetFilters} className="text-primary font-semibold hover:underline">
                    Clear Filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="border border-border/50 bg-card/50 rounded-xl p-6 h-36 animate-pulse flex flex-col justify-between">
                      <div className="h-4 bg-foreground/10 rounded w-1/3" />
                      <div className="h-3 bg-foreground/5 rounded w-1/4" />
                      <div className="h-3 bg-foreground/5 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="border border-dashed border-border bg-card/25 rounded-2xl p-12 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-1">No positions found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5">
                    We couldn't find any job postings matching your current filter criteria. Try adjusting your search keywords.
                  </p>
                  <Button variant="outline" onClick={handleResetFilters} className="rounded-xl h-10 border-border text-xs">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.slug}`}
                      className="group block border border-border bg-card hover:bg-card/75 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Company Logo column */}
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm border border-white/10 uppercase">
                          {job.company?.logo_url ? (
                            <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            (job.company?.name || "SX").slice(0, 2)
                          )}
                        </div>

                        {/* Middle Info Column */}
                        <div className="flex-grow space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[11px] font-bold text-primary tracking-wide">
                              {job.company?.name || "ScaleXWeb"}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <Badge variant="secondary" className="bg-primary/5 text-primary border border-primary/10 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                              {job.category?.name || "Job"}
                            </Badge>
                            <Badge variant="outline" className="border-border text-muted-foreground rounded-full text-[9px] uppercase font-bold tracking-wider px-2 py-0.5">
                              {getJobTypeLabel(job.job_type)}
                            </Badge>
                          </div>

                          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight pt-0.5">
                            {job.title}
                          </h3>

                          {job.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl pt-0.5">
                              {stripHtml(job.description)}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1.5">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-muted-foreground/60" />
                              {getExperienceLabel(job.experience_level)} Experience
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-muted-foreground/60" />
                              {formatSalary(job.salary_min, job.salary_max, job.currency, job.is_unpaid)}
                            </span>
                          </div>
                        </div>

                        {/* Right Arrow Column */}
                        <div className="flex items-center sm:self-center gap-1.5 self-end text-xs text-primary font-bold transition-transform group-hover:translate-x-1 shrink-0">
                          View details <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between text-[10px] text-muted-foreground pt-4 mt-4 border-t border-border/30 gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {job.created_at ? timeAgo(job.created_at) : "Posted recently"}
                        </span>
                        {job.application_deadline && (
                          <span>
                            Apply before {new Date(job.application_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Careers FAQ Section ── */}
      <section className="section-padding bg-secondary/20 border-t border-border/30">
        <div className="container-tight max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Careers FAQ</span>
            <h2 className="text-3xl font-heading font-extrabold text-foreground mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              Everything you need to know about applying, interviewing, and joining the team at ScaleXWeb.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the recruitment process at ScaleXWeb?",
                a: "Our recruitment process typically includes three main stages: (1) resume screening and portfolio evaluation, (2) a short, practical technical task or project, and (3) a live technical interview followed by a final fit discussion with our leadership team."
              },
              {
                q: "Do you offer remote or work-from-home options?",
                a: "Yes! ScaleXWeb operates as a hybrid and remote-first agency. Depending on your role, location, and project constraints, you can work fully remotely from anywhere in India, or join our collaborative office space in Ahmedabad."
              },
              {
                q: "Can I apply for multiple openings simultaneously?",
                a: "Absolutely. If your background and technical skills fit more than one role (for example, both Full Stack Developer and Frontend Engineer), feel free to apply to multiple postings. We review each application on its own merit."
              },
              {
                q: "Do you hire interns or fresh graduates?",
                a: "Yes, we regularly offer both paid and unpaid internship programs in software engineering, UI/UX design, and digital marketing. Many of our successful interns receive pre-placement offers (PPOs) to transition into full-time permanent roles."
              },
              {
                q: "How long does it take to hear back after submitting my application?",
                a: "Our recruiting team evaluates candidate logs daily. Typically, we reach out to shortlisted applicants within 3 to 5 business days after application submission. You will receive an email notification regarding your status at each stage."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group border border-border/60 bg-card rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h4 className="font-heading font-semibold text-sm text-foreground pr-4 group-hover:text-primary transition-colors">
                    {faq.q}
                  </h4>
                  <span className="shrink-0 rounded-lg bg-secondary p-1 text-muted-foreground group-open:rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground border-t border-border/20 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Drawer-like Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-[320px] bg-background h-full p-6 pt-10 flex flex-col justify-between border-l border-border animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Filter Options
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                  title="Close Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* Category Filter */}
                <div>
                  <label className="font-semibold text-foreground/80 mb-2 block">Job Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
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

                {/* Job Type Filter */}
                <div>
                  <label className="font-semibold text-foreground/80 mb-2 block">Job Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full_time">Full-time</SelectItem>
                      <SelectItem value="part_time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="font-semibold text-foreground/80 mb-2 block">Experience Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-10 text-xs">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent className="border-border">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead / Architect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6 border-t border-border/40">
              <Button
                onClick={() => {
                  handleApplyFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full h-11 rounded-xl bg-primary text-white text-xs font-semibold"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleResetFilters();
                  setShowMobileFilters(false);
                }}
                className="w-full h-11 rounded-xl border-border text-xs"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default JobsDirectory;
