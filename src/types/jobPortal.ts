export type UserRole = "job_seeker" | "admin" | "super_admin";
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "remote";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
export type JobStatus = "draft" | "published" | "closed" | "expired";
export type ApplicationStatus = "applied" | "under_review" | "shortlisted" | "interview_scheduled" | "rejected" | "hired";
export type InterviewMode = "online" | "in_person";

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  resume_url?: string;
  headline?: string;
  skills: string[];
  experience_years: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  category_id?: string;
  company_id?: string;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  status: JobStatus;
  application_deadline?: string;
  posted_by?: string;
  education_ug?: string;
  education_pg?: string;
  job_role?: string;
  industry_type?: string;
  role_category?: string;
  is_unpaid?: boolean;
  created_at: string;
  updated_at: string;

  // Joined fields (optional, populated by service)
  company?: Company;
  category?: JobCategory;
  posted_by_profile?: Profile;
  _count?: {
    applications: number;
  };
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_url: string;
  cover_letter?: string;
  expected_salary?: number;
  notice_period?: number; // in days
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;

  // Joined fields
  job?: Job;
  applicant?: Profile;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  old_status?: ApplicationStatus;
  new_status: ApplicationStatus;
  changed_by?: string;
  note?: string;
  changed_at: string;

  // Joined fields
  changer_profile?: Profile;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  saved_at: string;

  // Joined fields
  job?: Job;
}

export interface JobAlert {
  id: string;
  user_id: string;
  keywords?: string;
  category_id?: string;
  location?: string;
  frequency: "daily" | "weekly";
  is_active: boolean;
  created_at: string;

  // Joined fields
  category?: JobCategory;
}

export interface InterviewSchedule {
  id: string;
  application_id: string;
  scheduled_at: string;
  mode: InterviewMode;
  location_or_link?: string;
  notes?: string;
  created_by?: string;
  created_at: string;

  // Joined fields
  application?: Application;
}
