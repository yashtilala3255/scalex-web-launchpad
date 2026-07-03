import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { jobService } from "@/lib/jobService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { User, Mail, Phone, BookOpen, Briefcase, FileText, Upload, Trash2, X, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

export const SeekerProfile = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Profile State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [education, setEducation] = useState("");
  const [experienceYears, setExperienceYears] = useState("0");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let activeUserId = "";

        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getUser();
          if (data?.user) {
            activeUserId = data.user.id;
            setCandidateId(activeUserId);
          }
        }

        if (!activeUserId) {
          toast.error("Please login to manage your candidate profile");
          navigate("/careers/auth?redirect=/dashboard/profile");
          return;
        }

        const profile = await jobService.getProfile(activeUserId);
        if (profile) {
          setFullName(profile.full_name || "");
          setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setHeadline(profile.headline || "");
          setEducation(profile.education || "");
          setExperienceYears(String(profile.experience_years || 0));
          setSkills(profile.skills || []);
          setResumeUrl(profile.resume_url || "");
        }
      } catch (err) {
        console.error("Error fetching seeker profile:", err);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleAddSkill = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const validTypes = ["pdf", "doc", "docx"];

      if (!validTypes.includes(ext || "")) {
        toast.error("Invalid format. Please upload PDF, DOC, or DOCX");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File exceeds 5MB limit");
        return;
      }

      try {
        setUploadingResume(true);
        const uploadedPath = await jobService.uploadResume(file);
        if (uploadedPath) {
          setResumeUrl(uploadedPath);
          toast.success("Resume uploaded successfully!");
        } else {
          toast.error("Resume upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Could not upload resume to private storage");
      } finally {
        setUploadingResume(false);
      }
    }
  };

  const handleViewResume = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error("No resume has been uploaded yet");
      return;
    }
    if (resumeUrl.startsWith("mock")) {
      toast.info(`Mock Resume Path: ${resumeUrl}`);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.storage
          .from("resumes")
          .createSignedUrl(resumeUrl, 600);
        
        if (error) throw error;
        if (data?.signedUrl) {
          window.open(data.signedUrl, "_blank", "noopener,noreferrer");
        } else {
          toast.error("Could not generate access link for your resume");
        }
      } else {
        toast.info(`Mock Resume Path: ${resumeUrl}`);
      }
    } catch (err: any) {
      console.error("Signed URL error:", err);
      toast.error(`Failed to retrieve resume: ${err.message}`);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    try {
      setSaving(true);
      const success = await jobService.updateProfile(candidateId, {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        headline: headline.trim() || undefined,
        education: education.trim() || undefined,
        experience_years: parseInt(experienceYears) || 0,
        skills,
        resume_url: resumeUrl || undefined
      });

      if (success) {
        toast.success("Candidate Profile updated successfully!");
        const redirectUrl = new URLSearchParams(window.location.search).get("redirect");
        if (redirectUrl) {
          navigate(redirectUrl);
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      toast.error(err.message || "Could not save profile changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="section-padding min-h-[80vh] flex items-center justify-center">
          <div className="text-center text-xs text-muted-foreground">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary mx-auto mb-2" />
            Loading Profile Console...
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Candidate Profile | ScaleXWeb Careers"
        description="Manage your professional seeker profile, upload resume, and list skills."
        path="/dashboard/profile"
      />

      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/jobs" },
          { name: "Profile", path: "/dashboard/profile" }
        ]}
        badge="Candidate Profile"
        headline="Manage Profile Details."
        subheadline="Keep your professional information, skills, and resume updated to speed up job applications."
      />

      <section className="section-padding bg-background relative z-10 -mt-10 pt-0">
        <div className="container-tight max-w-4xl">
          
          <form onSubmit={handleSaveProfile} className="grid md:grid-cols-5 gap-8 items-start">
            
            {/* Left Column: Personal info & contact details */}
            <div className="md:col-span-3 space-y-6">
              <div className="border border-border bg-card rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                <div className="pb-3 border-b border-border/40">
                  <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Personal Information
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Full Name</label>
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Email Address (Read-only)</label>
                      <Input
                        disabled
                        value={email}
                        className="bg-secondary/20 border-border/30 text-xs h-10 rounded-xl text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Phone Number</label>
                      <Input
                        placeholder="+91 99999 88888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground/80 mb-1.5 block">Years of Experience</label>
                      <Input
                        type="number"
                        min="0"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Professional Headline</label>
                    <Input
                      placeholder="e.g. Senior Full Stack Developer"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground/80 mb-1.5 block">Education Details</label>
                    <Textarea
                      rows={3}
                      placeholder="e.g. B.Tech in Computer Engineering, XYZ University, 2024"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="bg-background/60 border-border/50 text-xs rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 justify-end">
                <Link to="/dashboard/applications">
                  <Button type="button" variant="outline" className="h-11 px-6 rounded-xl text-xs font-semibold border-border">
                    Track Applications
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="h-11 px-8 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs shadow-md shadow-primary/20"
                >
                  {saving ? "Saving Changes..." : "Save Profile Details"}
                </Button>
              </div>
            </div>

            {/* Right Column: Skills & Resume Upload */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Resume File Uploader */}
              <div className="border border-border bg-card rounded-3xl p-6 shadow-sm space-y-4">
                <div className="pb-3 border-b border-border/40">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" /> Private Resume File
                  </h4>
                </div>

                <div className="space-y-4 text-xs text-left">
                  {resumeUrl ? (
                    <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">Resume Attached</p>
                        <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{resumeUrl.split("/").pop()}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleViewResume}
                          className="h-8 px-2.5 rounded-lg border-border text-[10px] font-bold text-primary gap-1"
                          title="View Resume"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setResumeUrl("")}
                          className="h-8 w-8 p-0 border-border text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20"
                          title="Delete Resume link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border/60 hover:border-primary/50 bg-background/50 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 group transition-all">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        disabled={uploadingResume}
                      />
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-foreground text-xs block">
                          {uploadingResume ? "Uploading file..." : "Choose resume file"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Supports PDF, DOC, DOCX up to 5MB</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Skills Tags Configurator */}
              <div className="border border-border bg-card rounded-3xl p-6 shadow-sm space-y-4">
                <div className="pb-3 border-b border-border/40">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Skill Tags</h4>
                </div>

                <div className="space-y-4 text-xs text-left">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. React, Docker"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="bg-background/60 border-border/50 text-xs h-9 rounded-xl flex-grow"
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleAddSkill()} 
                      size="sm" 
                      className="h-9 w-9 p-0 rounded-xl bg-primary hover:bg-primary/95 text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {skills.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic text-center py-2">No skill tags configured.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="bg-secondary/40 border border-border/30 rounded-full px-2.5 py-0.5 text-foreground/80 flex items-center gap-1 hover:border-rose-500/20 hover:text-rose-500 group transition-all"
                        >
                          {skill}
                          <X 
                            className="w-3 h-3 cursor-pointer text-muted-foreground group-hover:text-rose-500" 
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SeekerProfile;
