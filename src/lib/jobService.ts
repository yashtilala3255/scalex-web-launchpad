import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { Job, JobCategory, Company, JobStatus, JobType, ExperienceLevel, Certificate } from "@/types/jobPortal";

// Mock Data for local fallback when Supabase is offline
const MOCK_CATEGORIES: JobCategory[] = [
  { id: "cat-1", name: "Engineering", slug: "engineering", created_at: new Date().toISOString() },
  { id: "cat-2", name: "Design", slug: "design", created_at: new Date().toISOString() },
  { id: "cat-3", name: "Marketing", slug: "marketing", created_at: new Date().toISOString() },
  { id: "cat-4", name: "Sales", slug: "sales", created_at: new Date().toISOString() }
];

const MOCK_COMPANIES: Company[] = [
  { id: "comp-1", name: "ScaleXWeb Solutions", logo_url: "", description: "Premium Web & App Agency", website: "https://scalexweb.com", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "comp-2", name: "TechNova Corp", logo_url: "", description: "Enterprise SaaS Platforms", website: "https://technova.io", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer (React/TypeScript)",
    slug: "senior-frontend-engineer-react-typescript",
    description: "<p>We are looking for a Senior Frontend Engineer who is passionate about pixel-perfect layouts, fluid animations, and high performance. You will lead the development of custom client web applications and SaaS platforms.</p><h3>Key Qualifications</h3><ul><li>4+ years of React/TypeScript experience</li><li>Expert knowledge of Tailwind CSS and Framer Motion</li><li>Experience with Next.js or Vite</li></ul>",
    requirements: "4+ years experience with React.js, TypeScript, Tailwind CSS, Responsive Design, State Management (Zustand/Redux).",
    responsibilities: "Architect UI components, optimize Web Vitals, collaborate with designers, mentor junior engineers.",
    category_id: "cat-1",
    company_id: "comp-1",
    location: "Remote (India)",
    job_type: "full_time",
    experience_level: "senior",
    salary_min: 1200000,
    salary_max: 2000000,
    currency: "INR",
    status: "published",
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: MOCK_COMPANIES[0],
    category: MOCK_CATEGORIES[0]
  },
  {
    id: "job-2",
    title: "Product Designer (UI/UX)",
    slug: "product-designer-ui-ux",
    description: "<p>Join our design department to craft premium, high-fidelity interfaces. You will work on layouts, bento grids, micro-interactions, and design systems.</p>",
    requirements: "Figma expertise, prototyping skills, experience building design systems, solid typography knowledge.",
    responsibilities: "Create wireframes, visual designs, high-fidelity interactive prototypes, and collaborate with engineers.",
    category_id: "cat-2",
    company_id: "comp-1",
    location: "Ahmedabad, Gujarat",
    job_type: "full_time",
    experience_level: "mid",
    salary_min: 600000,
    salary_max: 1000000,
    currency: "INR",
    status: "published",
    application_deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: MOCK_COMPANIES[0],
    category: MOCK_CATEGORIES[1]
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "<p>Looking for a Node.js + React developer to assist in building custom APIs and dashboards.</p>",
    requirements: "Node.js, PostgreSQL, React.js, REST APIs.",
    responsibilities: "Build databases, server logic, web views, and deployment configurations.",
    category_id: "cat-1",
    company_id: "comp-2",
    location: "Remote",
    job_type: "contract",
    experience_level: "entry",
    salary_min: 400000,
    salary_max: 700000,
    currency: "INR",
    status: "published",
    application_deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company: MOCK_COMPANIES[1],
    category: MOCK_CATEGORIES[0]
  }
];

// Helper to seed local mock storage
const getStoredJobs = (): Job[] => {
  const stored = localStorage.getItem("scalex_mock_jobs");
  if (!stored) {
    localStorage.setItem("scalex_mock_jobs", JSON.stringify(MOCK_JOBS));
    return MOCK_JOBS;
  }
  return JSON.parse(stored);
};

const saveStoredJobs = (jobs: Job[]) => {
  localStorage.setItem("scalex_mock_jobs", JSON.stringify(jobs));
};

const getStoredCategories = (): JobCategory[] => {
  const stored = localStorage.getItem("scalex_mock_categories");
  if (!stored) {
    localStorage.setItem("scalex_mock_categories", JSON.stringify(MOCK_CATEGORIES));
    return MOCK_CATEGORIES;
  }
  return JSON.parse(stored);
};

const saveStoredCategories = (cats: JobCategory[]) => {
  localStorage.setItem("scalex_mock_categories", JSON.stringify(cats));
};

const getStoredCompanies = (): Company[] => {
  const stored = localStorage.getItem("scalex_mock_companies");
  if (!stored) {
    localStorage.setItem("scalex_mock_companies", JSON.stringify(MOCK_COMPANIES));
    return MOCK_COMPANIES;
  }
  return JSON.parse(stored);
};

const saveStoredCompanies = (comps: Company[]) => {
  localStorage.setItem("scalex_mock_companies", JSON.stringify(comps));
};

export const jobService = {
  // Fetch Categories
  async getCategories(): Promise<JobCategory[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("job_categories")
        .select("*")
        .order("name");
      if (!error && data) return data;
    }
    return getStoredCategories();
  },

  // Fetch Companies
  async getCompanies(): Promise<Company[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
      if (!error && data) return data;
    }
    return getStoredCompanies();
  },

  // Browse published jobs (for Seeker view)
  async getJobs(filters: {
    search?: string;
    categoryId?: string;
    location?: string;
    jobType?: string;
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
  } = {}): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from("jobs")
          .select("*, company:companies(*), category:job_categories(*)")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (filters.categoryId) {
          query = query.eq("category_id", filters.categoryId);
        }
        if (filters.location) {
          query = query.ilike("location", `%${filters.location}%`);
        }
        if (filters.jobType) {
          query = query.eq("job_type", filters.jobType);
        }
        if (filters.experienceLevel) {
          query = query.eq("experience_level", filters.experienceLevel);
        }
        if (filters.salaryMin) {
          query = query.gte("salary_max", filters.salaryMin);
        }
        if (filters.salaryMax) {
          query = query.lte("salary_min", filters.salaryMax);
        }

        const { data, error } = await query;
        if (!error && data) {
          let results = data as Job[];
          if (filters.search) {
            const search = filters.search.toLowerCase();
            results = results.filter(
              (job) =>
                (job.title || "").toLowerCase().includes(search) ||
                (job.description || "").toLowerCase().includes(search) ||
                (job.requirements || "").toLowerCase().includes(search)
            );
          }
          return results;
        }
      } catch (err) {
        console.error("Error fetching jobs from Supabase, falling back:", err);
      }
    }

    // Fallback Mock Filter logic
    let jobs = getStoredJobs();
    jobs = jobs.filter((job) => job.status === "published");

    if (filters.categoryId) {
      jobs = jobs.filter((job) => job.category_id === filters.categoryId);
    }
    if (filters.location) {
      jobs = jobs.filter((job) => (job.location || "").toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters.jobType) {
      jobs = jobs.filter((job) => job.job_type === filters.jobType);
    }
    if (filters.experienceLevel) {
      jobs = jobs.filter((job) => job.experience_level === filters.experienceLevel);
    }
    if (filters.salaryMin) {
      jobs = jobs.filter((job) => (job.salary_max || 0) >= filters.salaryMin!);
    }
    if (filters.salaryMax) {
      jobs = jobs.filter((job) => (job.salary_min || 0) <= filters.salaryMax!);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          (job.title || "").toLowerCase().includes(search) ||
          (job.description || "").toLowerCase().includes(search) ||
          (job.requirements || "").toLowerCase().includes(search)
      );
    }

    return jobs;
  },

  // Get job by slug (Seeker & Public detail view)
  async getJobBySlug(slug: string): Promise<Job | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(*), category:job_categories(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) return data as Job;
    }

    const jobs = getStoredJobs();
    const found = jobs.find((job) => job.slug === slug);
    return found || null;
  },

  // Get recruiter jobs (includes applicant counts)
  async getAdminJobs(): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*, company:companies(*), category:job_categories(*), applications(count)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((item: any) => {
            const appCount = item.applications?.[0]?.count || 0;
            return {
              ...item,
              _count: { applications: appCount }
            };
          }) as Job[];
        }
      } catch (err) {
        console.error("Error getting admin jobs:", err);
      }
    }

    // Mock Fallback
    const jobs = getStoredJobs();
    return jobs.map((job) => {
      // Fetch mock applications count from localStorage if any
      const mockAppsStr = localStorage.getItem("scalex_mock_applications") || "[]";
      const mockApps = JSON.parse(mockAppsStr);
      const appCount = mockApps.filter((app: any) => app.job_id === job.id).length;
      return {
        ...job,
        _count: { applications: appCount }
      };
    });
  },

  // Create Job
  async createJob(jobData: Omit<Job, "id" | "created_at" | "updated_at">): Promise<Job | null> {
    const slug = jobData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newJobPayload = {
      ...jobData,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("jobs")
        .insert(newJobPayload)
        .select("*, company:companies(*), category:job_categories(*)")
        .single();
      if (error) {
        console.error("Supabase job insertion error:", error);
        throw new Error(error.message);
      }
      return data as Job;
    }

    // Local Storage Fallback
    const jobs = getStoredJobs();
    const mockNewJob: Job = {
      ...newJobPayload,
      id: "job-" + Date.now(),
      company: MOCK_COMPANIES.find((c) => c.id === jobData.company_id) || MOCK_COMPANIES[0],
      category: MOCK_CATEGORIES.find((c) => c.id === jobData.category_id) || MOCK_CATEGORIES[0]
    };
    jobs.unshift(mockNewJob);
    saveStoredJobs(jobs);
    return mockNewJob;
  },

  // Update Job
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job | null> {
    const updatedPayload = {
      ...jobData,
      updated_at: new Date().toISOString()
    };

    // If title changes, update slug
    if (jobData.title) {
      updatedPayload.slug = jobData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("jobs")
        .update(updatedPayload)
        .eq("id", id)
        .select("*, company:companies(*), category:job_categories(*)")
        .single();
      if (error) {
        console.error("Supabase job update error:", error);
        throw new Error(error.message);
      }
      return data as Job;
    }

    // Local Storage Fallback
    const jobs = getStoredJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx !== -1) {
      const updatedJob = {
        ...jobs[idx],
        ...updatedPayload,
        company: MOCK_COMPANIES.find((c) => c.id === (updatedPayload.company_id || jobs[idx].company_id)) || jobs[idx].company,
        category: MOCK_CATEGORIES.find((c) => c.id === (updatedPayload.category_id || jobs[idx].category_id)) || jobs[idx].category
      } as Job;
      jobs[idx] = updatedJob;
      saveStoredJobs(jobs);
      return updatedJob;
    }
    return null;
  },

  // Delete Job
  async deleteJob(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase job deletion error:", error);
        throw new Error(error.message);
      }
      return true;
    }

    // Local Storage Fallback
    const jobs = getStoredJobs();
    const filtered = jobs.filter((j) => j.id !== id);
    saveStoredJobs(filtered);
    return true;
  },

  // Upload Resume
  async uploadResume(file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (userId) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from("resumes")
          .upload(filePath, file);

        if (!error) {
          return filePath;
        } else {
          console.error("Supabase storage upload error:", error);
          throw new Error(error.message);
        }
      }
    }

    // Local Storage Mock Fallback
    return `mock-resumes/${Date.now()}_${file.name}`;
  },

  // Submit Application
  async applyToJob(appData: {
    job_id: string;
    applicant_id: string;
    resume_url: string;
    cover_letter?: string;
    expected_salary?: number;
    notice_period?: number;
  }): Promise<any> {
    const newApplication = {
      ...appData,
      id: "app-" + Date.now(),
      status: "applied",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: appData.job_id,
          applicant_id: appData.applicant_id,
          resume_url: appData.resume_url,
          cover_letter: appData.cover_letter,
          expected_salary: appData.expected_salary,
          notice_period: appData.notice_period,
          status: "applied"
        })
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.error("Supabase applyToJob error:", error);
        throw new Error(error.message);
      }
    }

    // Local Storage Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    mockApps.push(newApplication);
    localStorage.setItem("scalex_mock_applications", JSON.stringify(mockApps));

    // Save initial history
    const mockHist = JSON.parse(localStorage.getItem("scalex_mock_status_histories") || "[]");
    mockHist.push({
      id: "hist-" + Date.now(),
      application_id: newApplication.id,
      old_status: null,
      new_status: "applied",
      changed_by: appData.applicant_id,
      note: "Application submitted",
      changed_at: new Date().toISOString()
    });
    localStorage.setItem("scalex_mock_status_histories", JSON.stringify(mockHist));

    return newApplication;
  },

  // Fetch applicant applications (for Seeker dashboard)
  async getApplications(userId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*, job:jobs(*, company:companies(*))")
        .eq("applicant_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    const seekerApps = mockApps.filter((app: any) => app.applicant_id === userId);
    const jobs = getStoredJobs();
    return seekerApps.map((app: any) => ({
      ...app,
      job: jobs.find((j) => j.id === app.job_id) || jobs[0]
    }));
  },

  // Fetch all applications across all jobs (Recruiter unified view)
  async getAllApplications(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*, applicant:profiles(*), job:jobs(*, company:companies(*))")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    const jobs = getStoredJobs();
    return mockApps.map((app: any) => ({
      ...app,
      job: jobs.find((j) => j.id === app.job_id) || jobs[0],
      applicant: app.applicant || {
        full_name: "Amit Sharma",
        email: "amit.sharma@gmail.com",
        phone: "+91 99887 76655",
        headline: "Senior React Engineer",
        skills: ["React", "TypeScript", "Tailwind CSS"],
        experience_years: 4
      }
    }));
  },

  // Fetch candidates for a specific job (Recruiter view)
  async getApplicationsByJobId(jobId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*, applicant:profiles(*)")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    const jobApps = mockApps.filter((app: any) => app.job_id === jobId);
    
    // Seed standard candidates if empty to make UI look gorgeous
    if (jobApps.length === 0) {
      const defaultApps = [
        {
          id: "app-mock-1",
          job_id: jobId,
          applicant_id: "user-mock-1",
          resume_url: "mock-resumes/amit_sharma_resume.pdf",
          cover_letter: "I am a skilled React engineer with 4+ years of experience building responsive dashboards. I'd love to join ScaleXWeb!",
          expected_salary: 1500000,
          notice_period: 30,
          status: "applied",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          applicant: {
            id: "user-mock-1",
            full_name: "Amit Sharma",
            phone: "+91 99887 76655",
            role: "job_seeker",
            headline: "Senior React Engineer",
            skills: ["React", "TypeScript", "Tailwind CSS", "Redux"],
            experience_years: 4
          }
        },
        {
          id: "app-mock-2",
          job_id: jobId,
          applicant_id: "user-mock-2",
          resume_url: "mock-resumes/priya_patel_portfolio.pdf",
          cover_letter: "Passionate designer focused on bento grids and motion physics. Review my portfolio link in the resume.",
          expected_salary: 800000,
          notice_period: 15,
          status: "shortlisted",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          applicant: {
            id: "user-mock-2",
            full_name: "Priya Patel",
            phone: "+91 98765 01234",
            role: "job_seeker",
            headline: "UI/UX Designer",
            skills: ["Figma", "Design Systems", "Prototyping", "UX Research"],
            experience_years: 2
          }
        }
      ];
      mockApps.push(...defaultApps);
      localStorage.setItem("scalex_mock_applications", JSON.stringify(mockApps));
      return defaultApps;
    }

    return jobApps;
  },

  // Fetch application details by ID
  async getApplicationDetails(applicationId: string): Promise<any | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*, applicant:profiles(*), job:jobs(*, company:companies(*))")
        .eq("id", applicationId)
        .maybeSingle();
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    const app = mockApps.find((a: any) => a.id === applicationId);
    if (app) {
      const jobs = getStoredJobs();
      return {
        ...app,
        job: jobs.find((j) => j.id === app.job_id) || jobs[0],
        applicant: app.applicant || {
          id: app.applicant_id,
          full_name: "Amit Sharma",
          phone: "+91 99887 76655",
          role: "job_seeker",
          headline: "Senior React Engineer",
          skills: ["React", "TypeScript", "Tailwind CSS", "Redux"],
          experience_years: 4
        }
      };
    }
    return null;
  },

  // Update application status (Recruiter operation)
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    note?: string
  ): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId);

      if (error) {
        throw new Error(`Application status update failed: ${error.message}`);
      }

      // Log history (Supabase trigger automatically creates a row with note = null, so we'll update it or insert if missing)
      if (note) {
        const { data: u } = await supabase.auth.getUser();
        
        // Search for the history row created by the trigger for this update
        const { data: existingHist, error: findError } = await supabase
          .from("application_status_history")
          .select("id")
          .eq("application_id", applicationId)
          .eq("new_status", status)
          .is("note", null)
          .order("changed_at", { ascending: false })
          .limit(1);

        if (findError) {
          throw new Error(`Failed to locate status log row: ${findError.message}`);
        }

        if (existingHist && existingHist.length > 0) {
          // Update the trigger-created row with the feedback note
          const { error: updateError } = await supabase
            .from("application_status_history")
            .update({ note: note, changed_by: u?.user?.id })
            .eq("id", existingHist[0].id);

          if (updateError) {
            throw new Error(`Failed to save feedback log note: ${updateError.message}`);
          }
        } else {
          // Fallback insert if trigger didn't run or record not found
          const { error: insertError } = await supabase.from("application_status_history").insert({
            application_id: applicationId,
            new_status: status,
            changed_by: u?.user?.id,
            note: note
          });

          if (insertError) {
            throw new Error(`Failed to insert feedback log note: ${insertError.message}`);
          }
        }
      }
      // Asynchronously trigger status updated email notification
      try {
        const { data: appData } = await supabase
          .from("applications")
          .select("*, job:jobs(title), applicant:profiles(full_name, email)")
          .eq("id", applicationId)
          .single();

        if (appData && appData.applicant?.email) {
          supabase.functions.invoke("job-emails", {
            body: {
              type: "status_updated",
              email: appData.applicant.email,
              name: appData.applicant.full_name,
              details: {
                jobTitle: appData.job?.title,
                newStatus: status,
                notes: note || undefined
              }
            }
          }).catch(err => console.error("Email notify background error:", err));
        }
      } catch (emailErr) {
        console.error("Failed to query details for status update email:", emailErr);
      }

      return true;
    }

    // Mock Fallback
    const mockApps = JSON.parse(localStorage.getItem("scalex_mock_applications") || "[]");
    const idx = mockApps.findIndex((a: any) => a.id === applicationId);
    if (idx !== -1) {
      const oldStatus = mockApps[idx].status;
      mockApps[idx].status = status;
      mockApps[idx].updated_at = new Date().toISOString();
      localStorage.setItem("scalex_mock_applications", JSON.stringify(mockApps));

      // Append status history
      const mockHist = JSON.parse(localStorage.getItem("scalex_mock_status_histories") || "[]");
      mockHist.push({
        id: "hist-" + Date.now(),
        application_id: applicationId,
        old_status: oldStatus,
        new_status: status,
        changed_by: "admin",
        note: note || "Status updated by admin",
        changed_at: new Date().toISOString()
      });
      localStorage.setItem("scalex_mock_status_histories", JSON.stringify(mockHist));
      return true;
    }
    return false;
  },

  // Get status history for application
  async getApplicationStatusHistory(applicationId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("application_status_history")
        .select("*, changer_profile:profiles(*)")
        .eq("application_id", applicationId)
        .order("changed_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockHist = JSON.parse(localStorage.getItem("scalex_mock_status_histories") || "[]");
    return mockHist
      .filter((h: any) => h.application_id === applicationId)
      .sort((a: any, b: any) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());
  },

  // Get scheduled interviews for application
  async getInterviewSchedules(applicationId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("interview_schedules")
        .select("*")
        .eq("application_id", applicationId)
        .order("scheduled_at", { ascending: true });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockInts = JSON.parse(localStorage.getItem("scalex_mock_interviews") || "[]");
    return mockInts.filter((i: any) => i.application_id === applicationId);
  },

  // Create Interview Schedule (Recruiter operation)
  async createInterviewSchedule(scheduleData: {
    application_id: string;
    scheduled_at: string;
    mode: "online" | "in_person";
    location_or_link?: string;
    notes?: string;
  }): Promise<any> {
    const newInt = {
      ...scheduleData,
      id: "int-" + Date.now(),
      created_by: "admin",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("interview_schedules")
        .insert({
          application_id: scheduleData.application_id,
          scheduled_at: scheduleData.scheduled_at,
          mode: scheduleData.mode,
          location_or_link: scheduleData.location_or_link,
          notes: scheduleData.notes,
          created_by: u?.user?.id
        })
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.error("Supabase createInterviewSchedule error:", error);
        throw new Error(error.message);
      }
    }

    // Mock Fallback
    const mockInts = JSON.parse(localStorage.getItem("scalex_mock_interviews") || "[]");
    mockInts.push(newInt);
    localStorage.setItem("scalex_mock_interviews", JSON.stringify(mockInts));

    // Automatically transition application status to 'interview_scheduled'
    await this.updateApplicationStatus(
      scheduleData.application_id,
      "interview_scheduled",
      `Interview scheduled for ${new Date(scheduleData.scheduled_at).toLocaleString()}`
    );

    return newInt;
  },

  // Get saved jobs list (bookmarks)
  async getSavedJobs(userId: string): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job:jobs(*, company:companies(*), category:job_categories(*))")
        .eq("user_id", userId);
      if (!error && data) {
        return data.map((d) => d.job) as Job[];
      }
    }

    // Mock Fallback
    const savedIds = JSON.parse(localStorage.getItem("scalex_saved_job_ids") || "[]");
    const allJobs = getStoredJobs();
    return allJobs.filter((job) => savedIds.includes(job.id));
  },

  // Toggle Save Job status
  async toggleSaveJob(userId: string, jobId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      // Check if already saved
      const { data: existing, error: checkError } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("user_id", userId)
        .eq("job_id", jobId)
        .maybeSingle();

      if (!checkError) {
        if (existing) {
          // Delete
          const { error } = await supabase
            .from("saved_jobs")
            .delete()
            .eq("id", existing.id);
          return !error;
        } else {
          // Insert
          const { error } = await supabase
            .from("saved_jobs")
            .insert({ user_id: userId, job_id: jobId });
          return !error;
        }
      }
      return false;
    }

    // Mock Fallback
    const savedIds = JSON.parse(localStorage.getItem("scalex_saved_job_ids") || "[]");
    const isSaved = savedIds.includes(jobId);
    let newSavedIds = [];
    if (isSaved) {
      newSavedIds = savedIds.filter((id: string) => id !== jobId);
    } else {
      newSavedIds = [...savedIds, jobId];
    }
    localStorage.setItem("scalex_saved_job_ids", JSON.stringify(newSavedIds));
    return true;
  },

  // Get job alerts configurations
  async getJobAlerts(userId: string): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("job_alerts")
        .select("*, category:job_categories(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    const mockAlerts = JSON.parse(localStorage.getItem("scalex_mock_job_alerts") || "[]");
    const categories = MOCK_CATEGORIES;
    return mockAlerts
      .filter((alert: any) => alert.user_id === userId)
      .map((alert: any) => ({
        ...alert,
        category: categories.find((c) => c.id === alert.category_id)
      }));
  },

  // Create Job Alert subscription
  async createJobAlert(
    userId: string,
    alertData: {
      keywords?: string;
      category_id?: string;
      location?: string;
      frequency: "daily" | "weekly";
    }
  ): Promise<any> {
    const newAlert = {
      ...alertData,
      id: "alert-" + Date.now(),
      user_id: userId,
      is_active: true,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("job_alerts")
        .insert({
          user_id: userId,
          keywords: alertData.keywords,
          category_id: alertData.category_id || null,
          location: alertData.location,
          frequency: alertData.frequency,
          is_active: true
        })
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.error("Supabase createJobAlert error:", error);
        throw new Error(error.message);
      }
    }

    // Mock Fallback
    const mockAlerts = JSON.parse(localStorage.getItem("scalex_mock_job_alerts") || "[]");
    mockAlerts.push(newAlert);
    localStorage.setItem("scalex_mock_job_alerts", JSON.stringify(mockAlerts));
    return newAlert;
  },

  // Delete Job Alert subscription
  async deleteJobAlert(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("job_alerts")
        .delete()
        .eq("id", id);
      if (!error) return true;
    }

    // Mock Fallback
    const mockAlerts = JSON.parse(localStorage.getItem("scalex_mock_job_alerts") || "[]");
    const filtered = mockAlerts.filter((a: any) => a.id !== id);
    localStorage.setItem("scalex_mock_job_alerts", JSON.stringify(filtered));
    return true;
  },

  // Create Job Category
  async createCategory(name: string): Promise<JobCategory | null> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newCat = {
      name,
      slug,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("job_categories")
        .insert(newCat)
        .select()
        .single();
      if (!error && data) return data as JobCategory;
      if (error) throw new Error(error.message);
    }

    // Mock Fallback
    const cats = getStoredCategories();
    const mockNewCat: JobCategory = {
      ...newCat,
      id: "cat-" + Date.now()
    };
    cats.push(mockNewCat);
    saveStoredCategories(cats);
    return mockNewCat;
  },

  // Delete Job Category
  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("job_categories")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    }

    // Mock Fallback
    const cats = getStoredCategories();
    const filtered = cats.filter((c) => c.id !== id);
    saveStoredCategories(filtered);
    return true;
  },

  // Create Company Profile
  async createCompany(companyData: {
    name: string;
    logo_url?: string;
    description?: string;
    website?: string;
  }): Promise<Company | null> {
    const newComp = {
      ...companyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("companies")
        .insert(newComp)
        .select()
        .single();
      if (!error && data) return data as Company;
      if (error) throw new Error(error.message);
    }

    // Mock Fallback
    const comps = getStoredCompanies();
    const mockNewComp: Company = {
      ...newComp,
      id: "comp-" + Date.now()
    };
    comps.push(mockNewComp);
    saveStoredCompanies(comps);
    return mockNewComp;
  },

  // Update Company Profile
  async updateCompany(id: string, companyData: {
    name: string;
    logo_url?: string;
    description?: string;
    website?: string;
  }): Promise<Company | null> {
    const updatedPayload = {
      ...companyData,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("companies")
        .update(updatedPayload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Company;
    }

    // Mock Fallback
    const comps = getStoredCompanies();
    const idx = comps.findIndex((c) => c.id === id);
    if (idx !== -1) {
      const updatedComp = {
        ...comps[idx],
        ...updatedPayload
      } as Company;
      comps[idx] = updatedComp;
      saveStoredCompanies(comps);
      return updatedComp;
    }
    return null;
  },

  // Delete Company Profile
  async deleteCompany(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    }

    // Mock Fallback
    const comps = getStoredCompanies();
    const filtered = comps.filter((c) => c.id !== id);
    saveStoredCompanies(filtered);
    return true;
  },

  // Get Seeker Profile
  async getProfile(userId: string): Promise<any | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (!error && data) return data;
    }

    // Mock Fallback
    const stored = localStorage.getItem("scalex_mock_profile_" + userId);
    if (!stored) {
      const defaultProfile = {
        id: userId,
        full_name: "Yash Patel",
        email: "yash.patel@gmail.com",
        phone: "+91 99999 88888",
        headline: "Frontend Architect",
        education: "B.Tech in Information Technology",
        experience_years: 4,
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        resume_url: ""
      };
      localStorage.setItem("scalex_mock_profile_" + userId, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(stored);
  },

  // Update Seeker Profile
  async updateProfile(userId: string, profileData: any): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          headline: profileData.headline,
          education: profileData.education,
          experience_years: profileData.experience_years,
          skills: profileData.skills,
          resume_url: profileData.resume_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
      if (error) throw new Error(error.message);
      return true;
    }

    // Mock Fallback
    const profile = await this.getProfile(userId);
    const updated = {
      ...profile,
      ...profileData
    };
    localStorage.setItem("scalex_mock_profile_" + userId, JSON.stringify(updated));
    return true;
  },

  // Fetch all registered job seekers
  async getCandidates(): Promise<any[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "job_seeker")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }

    // Mock Fallback
    return [
      {
        id: "mock-candidate-1",
        full_name: "Amit Sharma",
        email: "amit.sharma@gmail.com",
        phone: "+91 99887 76655",
        headline: "Senior React Engineer",
        education: "B.Tech in CS",
        experience_years: 4,
        skills: ["React", "TypeScript", "Tailwind CSS"],
        created_at: new Date().toISOString()
      },
      {
        id: "mock-candidate-2",
        full_name: "Priya Patel",
        email: "priya.patel@gmail.com",
        phone: "+91 98765 43210",
        headline: "UX/UI Designer",
        education: "B.Des in Interaction Design",
        experience_years: 2,
        skills: ["Figma", "Adobe XD", "Prototyping"],
        created_at: new Date().toISOString()
      }
    ];
  },

  // Delete candidate profile
  async deleteCandidate(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      return true;
    }
    return true;
  },

  // Get all certificates (admin view)
  async getCertificates(): Promise<Certificate[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabase getCertificates error:", error);
        throw new Error(error.message);
      }
      return data || [];
    }

    // Local Storage Fallback
    const stored = localStorage.getItem("scalex_certificates");
    return stored ? JSON.parse(stored) : [];
  },

  // Get single certificate for verification
  async getCertificateById(id: string): Promise<Certificate | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        console.error("Supabase getCertificateById error:", error);
        throw new Error(error.message);
      }
      return data;
    }

    // Local Storage Fallback
    const stored = localStorage.getItem("scalex_certificates");
    const certs: Certificate[] = stored ? JSON.parse(stored) : [];
    return certs.find((c) => c.id === id || c.certificate_id === id) || null;
  },

  // Create/Issue a new certificate
  async createCertificate(certData: Omit<Certificate, "id" | "created_at">): Promise<Certificate> {
    const tempId = "cert-" + Math.random().toString(36).substr(2, 9);
    const newCert = {
      ...certData,
      id: tempId,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          candidate_name: certData.candidate_name,
          program_name: certData.program_name,
          certificate_type: certData.certificate_type,
          issue_date: certData.issue_date,
          certificate_id: certData.certificate_id,
          recipient_email: certData.recipient_email,
          logo_url: certData.logo_url,
          description: certData.description
        })
        .select()
        .single();
      if (error) {
        console.error("Supabase createCertificate error:", error);
        throw new Error(error.message);
      }
      return data;
    }

    // Local Storage Fallback
    const stored = localStorage.getItem("scalex_certificates");
    const certs: Certificate[] = stored ? JSON.parse(stored) : [];
    certs.push(newCert as Certificate);
    localStorage.setItem("scalex_certificates", JSON.stringify(certs));
    return newCert as Certificate;
  },

  // Update certificate details
  async updateCertificate(id: string, certData: Partial<Certificate>): Promise<Certificate> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("certificates")
        .update({
          candidate_name: certData.candidate_name,
          program_name: certData.program_name,
          certificate_type: certData.certificate_type,
          certificate_id: certData.certificate_id,
          recipient_email: certData.recipient_email,
          description: certData.description,
          issue_date: certData.issue_date ? new Date(certData.issue_date).toISOString() : undefined
        })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Supabase updateCertificate error:", error);
        throw new Error(error.message);
      }
      return data as Certificate;
    }

    // Local Storage Fallback
    const stored = localStorage.getItem("scalex_certificates");
    const certs: Certificate[] = stored ? JSON.parse(stored) : [];
    const index = certs.findIndex((c) => c.id === id);
    if (index !== -1) {
      certs[index] = {
        ...certs[index],
        ...certData,
        issue_date: certData.issue_date ? new Date(certData.issue_date).toISOString() : certs[index].issue_date
      } as Certificate;
      localStorage.setItem("scalex_certificates", JSON.stringify(certs));
      return certs[index];
    }
    throw new Error("Certificate not found");
  },

  // Revoke/Delete certificate
  async deleteCertificate(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteCertificate error:", error);
        throw new Error(error.message);
      }
      return true;
    }

    // Local Storage Fallback
    const stored = localStorage.getItem("scalex_certificates");
    const certs: Certificate[] = stored ? JSON.parse(stored) : [];
    const filtered = certs.filter((c) => c.id !== id);
    localStorage.setItem("scalex_certificates", JSON.stringify(filtered));
    return true;
  }
};
