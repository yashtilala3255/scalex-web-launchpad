import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import * as defaultData from "@/data";
import { toast } from "sonner";

// Types
export interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  requirement: string;
  status: "New" | "In Progress" | "Contacted" | "Closed";
  notes?: string;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinkedin: string;
  socialTwitter: string;
  socialGithub: string;
  socialInstagram?: string;
  logoUrl?: string;
  isMaintenanceMode?: boolean;
  isComingSoonMode?: boolean;
  launchDateTime?: string;
}

interface SiteDataContextType {
  isSupabase: boolean;
  loading: boolean;
  stats: any[];
  services: any[];
  industries: any[];
  trustPoints: any[];
  processSteps: any[];
  testimonials: any[];
  values: any[];
  techMarqueeItems: string[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  challenges: any[];
  solutionCategories: any[];
  caseStudies: any[];
  saasArchitecture: any[];
  saasFeatures: any[];
  saasWhyUs: any[];
  techStack: Record<string, string[]>;
  analytics: {
    pageViews: Record<string, number>;
    dailyViews: Record<string, number>;
    recentActivity: Array<{
      id: string;
      path: string;
      timestamp: string;
      city: string;
      device: "Desktop" | "Mobile";
    }>;
  };
  trackPageView: (path: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "created_at" | "status">) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => Promise<void>;
  updateInquiryNotes: (id: string, notes: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  updateSection: (key: string, data: any) => Promise<void>;
  updateSettings: (data: SiteSettings) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const DEFAULT_ANALYTICS = {
  pageViews: {},
  dailyViews: {},
  recentActivity: []
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "ScaleXWeb Solution",
  contactEmail: "info@scalexweb.com",
  contactPhone: "+91 98765 43210",
  contactAddress: "Ahmedabad, Gujarat, India",
  socialLinkedin: "https://www.linkedin.com/company/scale-x-web-solution",
  socialTwitter: "https://twitter.com/scalexweb",
  socialGithub: "https://github.com/scalexweb",
  socialInstagram: "https://www.instagram.com/scalexwebsolution/",
  logoUrl: "",
  isMaintenanceMode: false,
  isComingSoonMode: false,
  launchDateTime: ""
};

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return !/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    }
    return true;
  });
  const [stats, setStats] = useState<any[]>(defaultData.stats || []);
  const [services, setServices] = useState<any[]>(defaultData.services || []);
  const [industries, setIndustries] = useState<any[]>(defaultData.industries || []);
  const [trustPoints, setTrustPoints] = useState<any[]>(defaultData.trustPoints || []);
  const [processSteps, setProcessSteps] = useState<any[]>(defaultData.processSteps || []);
  const [testimonials, setTestimonials] = useState<any[]>(defaultData.testimonials || []);
  const [values, setValues] = useState<any[]>(defaultData.values || []);
  const [techMarqueeItems, setTechMarqueeItems] = useState<string[]>(defaultData.techMarqueeItems || []);
  const [challenges, setChallenges] = useState<any[]>(defaultData.challenges || []);
  const [solutionCategories, setSolutionCategories] = useState<any[]>(defaultData.solutionCategories || []);
  const [caseStudies, setCaseStudies] = useState<any[]>(defaultData.caseStudies || []);
  const [saasArchitecture, setSaasArchitecture] = useState<any[]>(defaultData.saasArchitecture || []);
  const [saasFeatures, setSaasFeatures] = useState<any[]>(defaultData.saasFeatures || []);
  const [saasWhyUs, setSaasWhyUs] = useState<any[]>(defaultData.saasWhyUs || []);
  const [techStack, setTechStack] = useState<Record<string, string[]>>(defaultData.techStack || {});
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [analytics, setAnalytics] = useState<any>(DEFAULT_ANALYTICS);

  // Initialize and Sync Content
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Fetch Site Content
          const { data: contentData, error: contentError } = await supabase
            .from("site_content")
            .select("*");

          if (contentError) throw contentError;

          const contentMap = (contentData || []).reduce((acc: any, item: any) => {
            acc[item.key] = item.value;
            return acc;
          }, {});

          // Helper to combine database + localStorage cache
          const getCombined = (key: string, defVal: any) => {
            if (contentMap[key] !== undefined) return contentMap[key];
            const stored = localStorage.getItem(`scalex_${key}`);
            return stored ? JSON.parse(stored) : defVal;
          };

          // Load data with fallback to localStorage edits, and then to default static data
          const loadedStats = getCombined("stats", defaultData.stats);
          setStats(loadedStats);
          
          let loadedServices = getCombined("services", defaultData.services);
          if (Array.isArray(loadedServices)) {
            const missingServices = defaultData.services.filter(
              (defSvc: any) => !loadedServices.some((s: any) => s.path === defSvc.path)
            );
            if (missingServices.length > 0) {
              loadedServices = [...loadedServices, ...missingServices];
              if (isSupabaseConfigured && supabase) {
                supabase
                  .from("site_content")
                  .upsert({ key: "services", value: loadedServices, updated_at: new Date().toISOString() })
                  .then(({ error }) => {
                    if (error) console.error("Auto-heal services failed:", error.message);
                    else console.log("Auto-healed services list in database!");
                  });
              }
            }
          }
          setServices(loadedServices);

          const loadedIndustries = getCombined("industries", defaultData.industries);
          const loadedTrustPoints = getCombined("trustPoints", defaultData.trustPoints);
          const loadedProcessSteps = getCombined("processSteps", defaultData.processSteps);
          const loadedTestimonials = getCombined("testimonials", defaultData.testimonials);
          const loadedValues = getCombined("values", defaultData.values);
          const loadedTechMarqueeItems = getCombined("techMarqueeItems", defaultData.techMarqueeItems);
          const loadedChallenges = getCombined("challenges", defaultData.challenges);
          const loadedSolutionCategories = getCombined("solutionCategories", defaultData.solutionCategories);
          const loadedCaseStudies = getCombined("caseStudies", defaultData.caseStudies);
          const loadedSaasArchitecture = getCombined("saasArchitecture", defaultData.saasArchitecture);
          const loadedSaasFeatures = getCombined("saasFeatures", defaultData.saasFeatures);
          const loadedSaasWhyUs = getCombined("saasWhyUs", defaultData.saasWhyUs);
          const loadedTechStack = getCombined("techStack", defaultData.techStack);
          const loadedSettings = getCombined("settings", DEFAULT_SETTINGS);
          const loadedAnalytics = getCombined("analytics", DEFAULT_ANALYTICS);

          setIndustries(loadedIndustries);
          setTrustPoints(loadedTrustPoints);
          setProcessSteps(loadedProcessSteps);
          setTestimonials(loadedTestimonials);
          setValues(loadedValues);
          setTechMarqueeItems(loadedTechMarqueeItems);
          setChallenges(loadedChallenges);
          setSolutionCategories(loadedSolutionCategories);
          setCaseStudies(loadedCaseStudies);
          setSaasArchitecture(loadedSaasArchitecture);
          setSaasFeatures(loadedSaasFeatures);
          setSaasWhyUs(loadedSaasWhyUs);
          setTechStack(loadedTechStack);
          setSettings(loadedSettings);
          setAnalytics(loadedAnalytics);

          // Seed Supabase if it's completely empty
          if (contentData.length === 0) {
            const seedItems = [
              { key: "stats", value: loadedStats },
              { key: "services", value: loadedServices },
              { key: "industries", value: loadedIndustries },
              { key: "trustPoints", value: loadedTrustPoints },
              { key: "processSteps", value: loadedProcessSteps },
              { key: "testimonials", value: loadedTestimonials },
              { key: "values", value: loadedValues },
              { key: "techMarqueeItems", value: loadedTechMarqueeItems },
              { key: "challenges", value: loadedChallenges },
              { key: "solutionCategories", value: loadedSolutionCategories },
              { key: "caseStudies", value: loadedCaseStudies },
              { key: "saasArchitecture", value: loadedSaasArchitecture },
              { key: "saasFeatures", value: loadedSaasFeatures },
              { key: "saasWhyUs", value: loadedSaasWhyUs },
              { key: "techStack", value: loadedTechStack },
              { key: "settings", value: loadedSettings }
            ];
            await supabase.from("site_content").insert(seedItems);
          }

          // 2. Fetch Inquiries
          const { data: inquiryData, error: inquiryError } = await supabase
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false });

          if (inquiryError) throw inquiryError;
          setInquiries(inquiryData || []);

        } catch (e: any) {
          console.error("Supabase load failed, falling back to Local Storage:", e.message);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
      setLoading(false);
    };

    initData();
  }, []);

  const loadFromLocalStorage = () => {
    const getLocal = (key: string, fallback: any) => {
      const stored = localStorage.getItem(`scalex_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    };

    setStats(getLocal("stats", defaultData.stats));
    
    let localServices = getLocal("services", defaultData.services);
    if (Array.isArray(localServices)) {
      const missingServices = defaultData.services.filter(
        (defSvc: any) => !localServices.some((s: any) => s.path === defSvc.path)
      );
      if (missingServices.length > 0) {
        localServices = [...localServices, ...missingServices];
        localStorage.setItem("scalex_services", JSON.stringify(localServices));
      }
    }
    setServices(localServices);

    setIndustries(getLocal("industries", defaultData.industries));
    setTrustPoints(getLocal("trustPoints", defaultData.trustPoints));
    setProcessSteps(getLocal("processSteps", defaultData.processSteps));
    setTestimonials(getLocal("testimonials", defaultData.testimonials));
    setValues(getLocal("values", defaultData.values));
    setTechMarqueeItems(getLocal("techMarqueeItems", defaultData.techMarqueeItems));
    setChallenges(getLocal("challenges", defaultData.challenges));
    setSolutionCategories(getLocal("solutionCategories", defaultData.solutionCategories));
    setCaseStudies(getLocal("caseStudies", defaultData.caseStudies));
    setSaasArchitecture(getLocal("saasArchitecture", defaultData.saasArchitecture));
    setSaasFeatures(getLocal("saasFeatures", defaultData.saasFeatures));
    setSaasWhyUs(getLocal("saasWhyUs", defaultData.saasWhyUs));
    setTechStack(getLocal("techStack", defaultData.techStack));
    setSettings(getLocal("settings", DEFAULT_SETTINGS));
    setInquiries(getLocal("inquiries", []));
    setAnalytics(getLocal("analytics", DEFAULT_ANALYTICS));
  };

  // Set LocalStorage Helper
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(`scalex_${key}`, JSON.stringify(data));
  };

  // Add inquiry (leads)
  const addInquiry = async (newInq: Omit<Inquiry, "id" | "created_at" | "status">): Promise<boolean> => {
    const id = Math.random().toString(36).substring(2, 9);
    const created_at = new Date().toISOString();
    const fullInquiry: Inquiry = {
      ...newInq,
      id,
      created_at,
      status: "New"
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("inquiries").insert([{
          name: newInq.name,
          email: newInq.email,
          phone: newInq.phone,
          service: newInq.service,
          requirement: newInq.requirement,
          status: "New"
        }]);
        if (error) throw error;
        
        // Refresh local state from server
        const { data } = await supabase
          .from("inquiries")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setInquiries(data);
        return true;
      } catch (e: any) {
        console.error("Supabase insert failed, saving locally:", e.message);
      }
    }

    // Local Storage Fallback
    const updated = [fullInquiry, ...inquiries];
    setInquiries(updated);
    saveToLocal("inquiries", updated);
    return true;
  };

  // Update Inquiry Status
  const updateInquiryStatus = async (id: string, status: Inquiry["status"]) => {
    let synced = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("inquiries")
          .update({ status })
          .eq("id", id);
        if (error) throw error;

        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        toast.success("Inquiry status updated successfully!");
        synced = true;
      } catch (e: any) {
        console.error("Supabase update status failed:", e.message);
      }
    }

    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    setInquiries(updated);
    saveToLocal("inquiries", updated);
    if (!synced) {
      toast.success("Inquiry status updated locally!");
    }
  };

  // Update Inquiry Notes
  const updateInquiryNotes = async (id: string, notes: string) => {
    let synced = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("inquiries")
          .update({ notes })
          .eq("id", id);
        if (error) throw error;

        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, notes } : inq));
        toast.success("Inquiry notes saved!");
        synced = true;
      } catch (e: any) {
        console.error("Supabase update notes failed:", e.message);
      }
    }

    const updated = inquiries.map(inq => inq.id === id ? { ...inq, notes } : inq);
    setInquiries(updated);
    saveToLocal("inquiries", updated);
    if (!synced) {
      toast.success("Inquiry notes saved locally!");
    }
  };

  // Delete Inquiry
  const deleteInquiry = async (id: string) => {
    let synced = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("inquiries")
          .delete()
          .eq("id", id);
        if (error) throw error;

        setInquiries(prev => prev.filter(inq => inq.id !== id));
        toast.success("Inquiry deleted successfully!");
        synced = true;
      } catch (e: any) {
        console.error("Supabase delete inquiry failed:", e.message);
      }
    }

    const updated = inquiries.filter(inq => inq.id !== id);
    setInquiries(updated);
    saveToLocal("inquiries", updated);
    if (!synced) {
      toast.success("Inquiry deleted locally!");
    }
  };

  // Update Section Data (stats, testimonials, etc.)
  const updateSection = async (key: string, data: any) => {
    // Update local state first
    switch (key) {
      case "stats": setStats(data); break;
      case "services": setServices(data); break;
      case "industries": setIndustries(data); break;
      case "trustPoints": setTrustPoints(data); break;
      case "processSteps": setProcessSteps(data); break;
      case "testimonials": setTestimonials(data); break;
      case "values": setValues(data); break;
      case "techMarqueeItems": setTechMarqueeItems(data); break;
      case "challenges": setChallenges(data); break;
      case "solutionCategories": setSolutionCategories(data); break;
      case "caseStudies": setCaseStudies(data); break;
      case "saasArchitecture": setSaasArchitecture(data); break;
      case "saasFeatures": setSaasFeatures(data); break;
      case "saasWhyUs": setSaasWhyUs(data); break;
      case "techStack": setTechStack(data); break;
    }

    let synced = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("site_content")
          .upsert({ key, value: data, updated_at: new Date().toISOString() });
        if (error) throw error;
        toast.success(`CMS section '${key}' updated in database!`);
        synced = true;
      } catch (e: any) {
        console.error("Supabase update section failed:", e.message);
      }
    }

    // Local Storage Fallback
    saveToLocal(key, data);
    if (!synced) {
      toast.success(`CMS section '${key}' saved locally!`);
    }
  };

  // Update site-wide settings
  const updateSettings = async (data: SiteSettings) => {
    setSettings(data);
    let synced = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("site_content")
          .upsert({ key: "settings", value: data, updated_at: new Date().toISOString() });
        if (error) throw error;
        toast.success("Site settings updated in database!");
        synced = true;
      } catch (e: any) {
        console.error("Supabase settings update failed:", e.message);
      }
    }

    saveToLocal("settings", data);
    if (!synced) {
      toast.success("Site settings saved locally!");
    }
  };

  // Reset to Defaults
  const resetToDefaults = async () => {
    if (window.confirm("Are you sure you want to restore default template values? All custom edits will be lost.")) {
      setStats(defaultData.stats);
      setServices(defaultData.services);
      setIndustries(defaultData.industries);
      setTrustPoints(defaultData.trustPoints);
      setProcessSteps(defaultData.processSteps);
      setTestimonials(defaultData.testimonials);
      setValues(defaultData.values);
      setTechMarqueeItems(defaultData.techMarqueeItems);
      setChallenges(defaultData.challenges);
      setSolutionCategories(defaultData.solutionCategories);
      setCaseStudies(defaultData.caseStudies);
      setSaasArchitecture(defaultData.saasArchitecture);
      setSaasFeatures(defaultData.saasFeatures);
      setSaasWhyUs(defaultData.saasWhyUs);
      setTechStack(defaultData.techStack);
      setSettings(DEFAULT_SETTINGS);

      if (isSupabaseConfigured && supabase) {
        try {
          const seedItems = [
            { key: "stats", value: defaultData.stats },
            { key: "services", value: defaultData.services },
            { key: "industries", value: defaultData.industries },
            { key: "trustPoints", value: defaultData.trustPoints },
            { key: "processSteps", value: defaultData.processSteps },
            { key: "testimonials", value: defaultData.testimonials },
            { key: "values", value: defaultData.values },
            { key: "techMarqueeItems", value: defaultData.techMarqueeItems },
            { key: "challenges", value: defaultData.challenges },
            { key: "solutionCategories", value: defaultData.solutionCategories },
            { key: "caseStudies", value: defaultData.caseStudies },
            { key: "saasArchitecture", value: defaultData.saasArchitecture },
            { key: "saasFeatures", value: defaultData.saasFeatures },
            { key: "saasWhyUs", value: defaultData.saasWhyUs },
            { key: "techStack", value: defaultData.techStack },
            { key: "settings", value: DEFAULT_SETTINGS }
          ];

          for (const item of seedItems) {
            await supabase.from("site_content").upsert(item);
          }
          toast.success("CMS successfully restored to baseline defaults in database!");
          return;
        } catch (e: any) {
          console.error("Supabase reset failed:", e.message);
        }
      }

      // Reset Local Storage
      const keys = [
        "stats", "services", "industries", "trustPoints", "processSteps",
        "testimonials", "values", "techMarqueeItems", "challenges",
        "solutionCategories", "caseStudies", "saasArchitecture",
        "saasFeatures", "saasWhyUs", "techStack", "settings", "analytics"
      ];
      keys.forEach(k => localStorage.removeItem(`scalex_${k}`));
      loadFromLocalStorage();
      toast.success("CMS successfully restored to baseline defaults locally!");
    }
  };

  const trackPageView = async (path: string) => {
    if (path.toLowerCase().startsWith("/admin")) return;

    // Detect actual device
    const userAgent = navigator.userAgent || "";
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
    const device = isMobile ? "Mobile" : "Desktop";

    let city = "Unknown Location";
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const ipData = await res.json();
        if (ipData && ipData.city) {
          city = ipData.city;
          if (ipData.country_code) {
            city += `, ${ipData.country_code}`;
          }
        }
      }
    } catch (e) {
      console.warn("Visitor Geo-IP lookup failed:", e);
    }

    setAnalytics((prev: any) => {
      const updatedViews = { ...(prev?.pageViews || {}) };
      updatedViews[path] = (updatedViews[path] || 0) + 1;

      const dateStr = new Date().toISOString().split("T")[0];
      const updatedDaily = { ...(prev?.dailyViews || {}) };
      updatedDaily[dateStr] = (updatedDaily[dateStr] || 0) + 1;

      const newActivity = {
        id: Math.random().toString(36).substring(2, 9),
        path,
        timestamp: new Date().toISOString(),
        city,
        device
      };

      const updatedActivity = [newActivity, ...(prev?.recentActivity || [])].slice(0, 50);

      const nextAnalytics = {
        pageViews: updatedViews,
        dailyViews: updatedDaily,
        recentActivity: updatedActivity
      };

      setTimeout(async () => {
        saveToLocal("analytics", nextAnalytics);
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase
              .from("site_content")
              .upsert({ key: "analytics", value: nextAnalytics, updated_at: new Date().toISOString() });
          } catch (e) {
            console.error("Failed to sync analytics to Supabase:", e);
          }
        }
      }, 0);

      return nextAnalytics;
    });
  };

  return (
    <SiteDataContext.Provider
      value={{
        isSupabase: isSupabaseConfigured,
        loading,
        stats,
        services,
        industries,
        trustPoints,
        processSteps,
        testimonials,
        values,
        techMarqueeItems,
        inquiries,
        settings,
        challenges,
        solutionCategories,
        caseStudies,
        saasArchitecture,
        saasFeatures,
        saasWhyUs,
        techStack,
        analytics,
        trackPageView,
        addInquiry,
        updateInquiryStatus,
        updateInquiryNotes,
        deleteInquiry,
        updateSection,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
};
