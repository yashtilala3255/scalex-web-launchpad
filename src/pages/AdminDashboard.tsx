import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { WelcomeScreen } from "@/components/ui/onboarding-welcome-screen";
import { useSiteData, Inquiry } from "@/context/SiteDataContext";
import { InvoiceSystem } from "@/components/admin/invoices/InvoiceSystem";
import { invoiceStorage, AdminRecord } from "@/lib/invoiceStorage";
import { getIconComponent } from "@/components/ui/icon-helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from "recharts";
import {
  Lock, LayoutDashboard, FileText, Settings, Database,
  Users, TrendingUp, CheckCircle, Clock, AlertCircle,
  Plus, Trash2, Edit2, Save, Download, RefreshCw,
  LogOut, Globe, Phone, Mail, MapPin, ExternalLink, HelpCircle, Activity, Receipt
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    isSupabase, loading, stats, services, industries,
    trustPoints, processSteps, testimonials, values,
    techMarqueeItems, challenges, caseStudies, saasArchitecture,
    saasFeatures, saasWhyUs, techStack,
    inquiries, settings, updateInquiryStatus, updateInquiryNotes,
    deleteInquiry, updateSection, updateSettings, resetToDefaults,
    analytics
  } = useSiteData();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "inquiries" | "settings" | "analytics" | "invoices">("overview");

  // CMS Section Editing State
  const [selectedCmsSection, setSelectedCmsSection] = useState<
    "stats" | "testimonials" | "services" | "values" | "processSteps" | "trustPoints" | 
    "industries" | "techMarqueeItems" | "challenges" | "caseStudies" | "saasArchitecture" | 
    "saasFeatures" | "saasWhyUs" | "techStack"
  >("stats");
  const [cmsDataList, setCmsDataList] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const isSavingRef = React.useRef(false);

  // Inquiries Filters
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Live Visitor simulation
  const [liveUsersCount, setLiveUsersCount] = useState(3);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsersCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const nextVal = prev + delta;
        return nextVal < 1 ? 1 : nextVal > 8 ? 8 : nextVal;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Security & Authentication Helpers
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const isSha256 = (str: string) => /^[0-9a-f]{64}$/i.test(str);

  // Settings Forms
  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem("scalex_admin_user") || "admin";
  });
  const [adminPasswordHash, setAdminPasswordHash] = useState(() => {
    const storedHash = localStorage.getItem("scalex_admin_pass_hash");
    if (storedHash) return storedHash;
    const oldPlaintext = localStorage.getItem("scalex_admin_pass");
    if (oldPlaintext) return oldPlaintext; // temporary fallback
    return "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // default hash of "admin123"
  });
  const [tempUsername, setTempUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);

  // Admin Management State
  const [adminsList, setAdminsList] = useState<AdminRecord[]>([]);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState(() => {
    return sessionStorage.getItem("scalex_admin_name") || "Yash Patel";
  });

  // Load admins list
  React.useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const list = await invoiceStorage.getAdmins();
        setAdminsList(list);
      } catch (err) {
        console.error("Failed to load admins:", err);
      }
    };
    fetchAdmins();
  }, []);

  // Check lockout on mount and periodically
  React.useEffect(() => {
    const checkLockout = () => {
      const lockUntil = Number(localStorage.getItem("scalex_lockout_until") || 0);
      const now = Date.now();
      if (lockUntil > now) {
        setLockoutTimeLeft(Math.ceil((lockUntil - now) / 1000));
      } else {
        setLockoutTimeLeft(0);
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Settings State fields
  const [settingsForm, setSettingsForm] = useState({
    siteName: settings?.siteName || "",
    contactEmail: settings?.contactEmail || "",
    contactPhone: settings?.contactPhone || "",
    contactAddress: settings?.contactAddress || "",
    socialLinkedin: settings?.socialLinkedin || "",
    socialTwitter: settings?.socialTwitter || "",
    socialGithub: settings?.socialGithub || "",
    socialInstagram: settings?.socialInstagram || "",
    logoUrl: settings?.logoUrl || "",
    isMaintenanceMode: settings?.isMaintenanceMode || false,
    isComingSoonMode: settings?.isComingSoonMode || false,
    launchDateTime: settings?.launchDateTime || ""
  });

  // Sync Settings form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      setSettingsForm({
        siteName: settings.siteName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
        socialLinkedin: settings.socialLinkedin,
        socialTwitter: settings.socialTwitter,
        socialGithub: settings.socialGithub,
        socialInstagram: settings.socialInstagram || "",
        logoUrl: settings.logoUrl || "",
        isMaintenanceMode: settings.isMaintenanceMode || false,
        isComingSoonMode: settings.isComingSoonMode || false,
        launchDateTime: settings.launchDateTime || ""
      });
    }
  }, [settings]);

  // Reset editing state when switching sections
  React.useEffect(() => {
    setEditingIndex(null);
  }, [selectedCmsSection]);

  // Sync CMS Section List state when selection changes or data loads
  React.useEffect(() => {
    if (editingIndex === null && !isSavingRef.current) {
      if (selectedCmsSection === "stats") setCmsDataList([...stats]);
      if (selectedCmsSection === "testimonials") setCmsDataList([...testimonials]);
      if (selectedCmsSection === "services") setCmsDataList([...services]);
      if (selectedCmsSection === "values") setCmsDataList([...values]);
      if (selectedCmsSection === "processSteps") setCmsDataList([...processSteps]);
      if (selectedCmsSection === "trustPoints") setCmsDataList([...trustPoints]);
      if (selectedCmsSection === "industries") setCmsDataList([...industries]);
      if (selectedCmsSection === "challenges") setCmsDataList([...challenges]);
      if (selectedCmsSection === "caseStudies") setCmsDataList([...caseStudies]);
      if (selectedCmsSection === "saasArchitecture") setCmsDataList([...saasArchitecture]);
      if (selectedCmsSection === "saasFeatures") setCmsDataList([...saasFeatures]);
      if (selectedCmsSection === "saasWhyUs") setCmsDataList([...saasWhyUs]);
      if (selectedCmsSection === "techMarqueeItems") {
        const array = (techMarqueeItems || []).map(name => ({ name }));
        setCmsDataList(array);
      }
      if (selectedCmsSection === "techStack") {
        const array = Object.entries(techStack || {}).map(([category, items]) => ({
          category,
          items: items.join(", ")
        }));
        setCmsDataList(array);
      }
    }
  }, [
    selectedCmsSection, stats, testimonials, services, values, 
    processSteps, trustPoints, industries, techMarqueeItems, 
    challenges, caseStudies, saasArchitecture, saasFeatures, 
    saasWhyUs, techStack, loading, editingIndex
  ]);

  // Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const lockUntil = Number(localStorage.getItem("scalex_lockout_until") || 0);
    if (lockUntil > Date.now()) {
      toast.error("Too many failed login attempts. Panel is temporarily locked.");
      return;
    }

    const enteredUser = usernameInput.trim();
    const enteredPass = passwordInput.trim();

    let isMatch = false;
    let authenticatedUser: AdminRecord | null = null;
    const hashedEntered = await hashPassword(enteredPass);

    // 1. Try to find user in adminsList first
    const matchedAdmin = adminsList.find(
      (a) => a.email.toLowerCase() === enteredUser.toLowerCase()
    );

    if (matchedAdmin) {
      if (matchedAdmin.password_hash === hashedEntered) {
        isMatch = true;
        authenticatedUser = matchedAdmin;
      }
    } else {
      // 2. Fallback to legacy single admin account
      if (enteredUser.toLowerCase() === adminUsername.toLowerCase()) {
        if (isSha256(adminPasswordHash)) {
          isMatch = hashedEntered === adminPasswordHash;
        } else {
          isMatch = enteredPass === adminPasswordHash;
          if (isMatch) {
            // Automatically migrate old plaintext password to hash
            const newHash = await hashPassword(enteredPass);
            localStorage.setItem("scalex_admin_pass_hash", newHash);
            localStorage.removeItem("scalex_admin_pass");
            setAdminPasswordHash(newHash);
          }
        }
        if (isMatch) {
          authenticatedUser = {
            id: "legacy",
            email: adminUsername,
            name: "Yash Patel",
            password_hash: adminPasswordHash
          };
        }
      }
    }

    if (authenticatedUser && isMatch) {
      setIsAuthenticated(true);
      sessionStorage.setItem("scalex_admin_auth", "true");
      sessionStorage.setItem("scalex_admin_name", authenticatedUser.name);
      sessionStorage.setItem("scalex_admin_email", authenticatedUser.email);
      setCurrentUserDisplayName(authenticatedUser.name);
      localStorage.setItem("scalex_failed_attempts", "0");
      localStorage.removeItem("scalex_lockout_until");
      toast.success(`Welcome back, ${authenticatedUser.name}!`);
    } else {
      const currentFailed = Number(localStorage.getItem("scalex_failed_attempts") || 0) + 1;
      localStorage.setItem("scalex_failed_attempts", String(currentFailed));
      
      if (currentFailed >= 5) {
        const lockDuration = 15 * 60 * 1000; // 15 mins lockout
        localStorage.setItem("scalex_lockout_until", String(Date.now() + lockDuration));
        setLockoutTimeLeft(15 * 60);
        toast.error("Account locked for 15 minutes due to too many failed attempts.");
      } else {
        toast.error(`Invalid credentials. ${5 - currentFailed} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("scalex_admin_auth");
    sessionStorage.removeItem("scalex_admin_name");
    sessionStorage.removeItem("scalex_admin_email");
    toast.success("Logged out successfully.");
  };

  // Change Password Handler
  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      localStorage.setItem("scalex_admin_user", tempUsername);
      setAdminUsername(tempUsername);
    }
    if (tempPassword.trim()) {
      const hashedPass = await hashPassword(tempPassword.trim());
      localStorage.setItem("scalex_admin_pass_hash", hashedPass);
      localStorage.removeItem("scalex_admin_pass"); // remove plaintext key
      setAdminPasswordHash(hashedPass);
    }
    toast.success("Admin login credentials updated and secured with SHA-256!");
    setTempUsername("");
    setTempPassword("");
  };

  // Add new administrator
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      toast.error("Please fill in all administrator fields.");
      return;
    }

    const emailLower = newAdminEmail.trim().toLowerCase();
    
    // Check if email already exists
    const exists = adminsList.some(a => a.email.toLowerCase() === emailLower);
    if (exists) {
      toast.error("An administrator with this email already exists.");
      return;
    }

    try {
      const passwordHash = await hashPassword(newAdminPassword.trim());
      const newAdmin: AdminRecord = {
        id: `admin-${Date.now()}`,
        name: newAdminName.trim(),
        email: emailLower,
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      };

      const saved = await invoiceStorage.saveAdmin(newAdmin);
      setAdminsList(prev => [...prev, saved]);
      
      // Reset form fields
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");

      toast.success(`Admin account for "${saved.name}" created successfully.`);
    } catch (err) {
      console.error("Failed to add admin:", err);
      toast.error("An error occurred while creating the administrator account.");
    }
  };

  // Delete administrator
  const handleDeleteAdmin = async (id: string) => {
    if (adminsList.length <= 1) {
      toast.error("Cannot delete the only remaining administrator account to prevent lockouts.");
      return;
    }

    const adminToDelete = adminsList.find(a => a.id === id);
    if (!adminToDelete) {
      toast.error("Administrator not found.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete administrator "${adminToDelete.name}" (${adminToDelete.email})?`)) {
      return;
    }

    try {
      const success = await invoiceStorage.deleteAdmin(id);
      if (success) {
        setAdminsList(prev => prev.filter(a => a.id !== id));
        toast.success(`Administrator "${adminToDelete.name}" deleted.`);

        // Log out if they deleted their own account
        const loggedInEmail = sessionStorage.getItem("scalex_admin_email") || "";
        const loggedInName = sessionStorage.getItem("scalex_admin_name") || "";
        if (
          adminToDelete.email.toLowerCase() === loggedInEmail.toLowerCase() ||
          adminToDelete.name === loggedInName
        ) {
          handleLogout();
          toast.info("Your administrator account was deleted. You have been logged out.");
        }
      } else {
        toast.error("Failed to delete the administrator.");
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
      toast.error("An error occurred while deleting the administrator.");
    }
  };

  // Inactivity Auto-logout
  React.useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: number;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Auto-logout after 15 minutes of total inactivity (900,000 ms)
      timeoutId = window.setTimeout(() => {
        handleLogout();
        toast.error("Logged out automatically due to inactivity.");
      }, 15 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  // Logo upload handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
        toast.success("Logo loaded. Click 'Save Site Settings' to apply.");
      };
      reader.onerror = () => {
        toast.error("Failed to read the file.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Update Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
  };

  // Content Manager Handlers
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...cmsDataList[index] });
  };

  const handleSaveEdit = async (index: number) => {
    isSavingRef.current = true;
    try {
      const updatedList = [...cmsDataList];
      updatedList[index] = { ...editForm };
      setCmsDataList(updatedList);

      if (selectedCmsSection === "techStack") {
        const newTechStack: Record<string, string[]> = {};
        updatedList.forEach(item => {
          newTechStack[item.category] = item.items.split(",").map((s: string) => s.trim()).filter(Boolean);
        });
        await updateSection("techStack", newTechStack);
      } else if (selectedCmsSection === "techMarqueeItems") {
        const nameList = updatedList.map(item => item.name || item);
        await updateSection("techMarqueeItems", nameList);
      } else {
        await updateSection(selectedCmsSection, updatedList);
      }
      setEditingIndex(null);
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleDeleteItem = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      isSavingRef.current = true;
      try {
        const updatedList = cmsDataList.filter((_, i) => i !== index);
        setCmsDataList(updatedList);

        if (selectedCmsSection === "techStack") {
          const newTechStack: Record<string, string[]> = {};
          updatedList.forEach(item => {
            newTechStack[item.category] = item.items.split(",").map((s: string) => s.trim()).filter(Boolean);
          });
          await updateSection("techStack", newTechStack);
        } else if (selectedCmsSection === "techMarqueeItems") {
          const nameList = updatedList.map(item => item.name || item);
          await updateSection("techMarqueeItems", nameList);
        } else {
          await updateSection(selectedCmsSection, updatedList);
        }
      } finally {
        isSavingRef.current = false;
      }
    }
  };

  const handleAddNewItem = async () => {
    isSavingRef.current = true;
    let newItem: any = {};
    if (selectedCmsSection === "stats") {
      newItem = { value: "10+", label: "New Stat Metric" };
    } else if (selectedCmsSection === "testimonials") {
      newItem = { quote: "Describe client experience here.", name: "Client Name", role: "Manager", company: "Company Inc.", initials: "CN" };
    } else if (selectedCmsSection === "services") {
      newItem = { icon: "Globe", name: "New Service Offered", desc: "Short description of the new service.", bullets: ["Point 1", "Point 2"], path: "/services/website-development" };
    } else if (selectedCmsSection === "values") {
      newItem = { icon: "Award", title: "New Core Value", desc: "Description of what this value stands for." };
    } else if (selectedCmsSection === "processSteps") {
      newItem = { step: String((processSteps || []).length + 1).padStart(2, "0"), title: "New Process Step", desc: "Description of what happens at this stage.", icon: "Search" };
    } else if (selectedCmsSection === "trustPoints") {
      newItem = { title: "New Trust Factor", desc: "Why clients should trust us for this aspect.", icon: "Clock" };
    } else if (selectedCmsSection === "industries") {
      newItem = { name: "New Industry", icon: "Heart" };
    } else if (selectedCmsSection === "techMarqueeItems") {
      newItem = { name: "React.js" };
    } else if (selectedCmsSection === "challenges") {
      newItem = { challenge: "A business challenge", solution: "Our custom solution", detail: "Additional descriptive details about this dynamic solution." };
    } else if (selectedCmsSection === "caseStudies") {
      newItem = { industry: "Industry Name", tag: "Result/Impact Metric", challenge: "Client challenge description.", solution: "Our developed system details.", result: "Achieved improvements." };
    } else if (selectedCmsSection === "saasArchitecture") {
      newItem = { icon: "Database", name: "Architecture Component", desc: "How this component is designed for SaaS." };
    } else if (selectedCmsSection === "saasFeatures") {
      newItem = { icon: "UserCheck", name: "Built-In SaaS Feature" };
    } else if (selectedCmsSection === "saasWhyUs") {
      newItem = { number: String((saasWhyUs || []).length + 1).padStart(2, "0"), title: "Why Build With Us", body: "Description of our capability." };
    } else if (selectedCmsSection === "techStack") {
      newItem = { category: "New Category", items: "React.js, Vue.js" };
    }

    try {
      const updatedList = [...cmsDataList, newItem];
      setCmsDataList(updatedList);
      setEditingIndex(updatedList.length - 1);
      setEditForm({ ...newItem });

      if (selectedCmsSection === "techStack") {
        const newTechStack: Record<string, string[]> = {};
        updatedList.forEach(item => {
          newTechStack[item.category] = item.items.split(",").map((s: string) => s.trim()).filter(Boolean);
        });
        await updateSection("techStack", newTechStack);
      } else if (selectedCmsSection === "techMarqueeItems") {
        const nameList = updatedList.map(item => item.name || item);
        await updateSection("techMarqueeItems", nameList);
      } else {
        await updateSection(selectedCmsSection, updatedList);
      }
    } finally {
      isSavingRef.current = false;
    }
  };

  // CSV Exporter for Inquiries
  const handleExportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      toast.warning("No inquiries found to export.");
      return;
    }
    const headers = "ID,Date,Client Name,Email,Phone,Service,Status,Requirement,Admin Notes\n";
    const rows = inquiries.map(inq => {
      const cleanReq = inq.requirement ? inq.requirement.replace(/"/g, '""') : "";
      const cleanNotes = inq.notes ? inq.notes.replace(/"/g, '""') : "";
      return `"${inq.id}","${inq.created_at}","${inq.name}","${inq.email}","${inq.phone || ""}","${inq.service || ""}","${inq.status}","${cleanReq}","${cleanNotes}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `scalex_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  // Recharts Chart Data Processing
  const getChartData = () => {
    // Group inquiries by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped = months.reduce((acc: any, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    // Seed some mock historical inquiries for visual demonstration if active inquiries are small
    const currentYear = new Date().getFullYear();
    inquiries.forEach(inq => {
      const d = new Date(inq.created_at);
      if (d.getFullYear() === currentYear || isNaN(d.getTime())) {
        const m = months[isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth()];
        grouped[m]++;
      }
    });

    // If zero inquiries exist, provide a fallback visual trend
    const hasData = Object.values(grouped).some(v => (v as number) > 0);
    if (!hasData) {
      return [
        { name: "Jan", count: 2 },
        { name: "Feb", count: 5 },
        { name: "Mar", count: 3 },
        { name: "Apr", count: 8 },
        { name: "May", count: inquiries.length }
      ];
    }

    return Object.entries(grouped).map(([name, count]) => ({
      name,
      count
    }));
  };

  const getTrafficChartData = () => {
    const chartData = [];
    const dailyViews = analytics?.dailyViews || {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const displayDate = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      chartData.push({
        date: displayDate,
        views: dailyViews[dateStr] || 0,
        rawDate: dateStr
      });
    }
    return chartData;
  };

  const getServiceDistributionData = () => {
    const servicesMap: Record<string, number> = {
      "Website Development": 0,
      "App Development": 0,
      "SaaS Development": 0,
      "E-Commerce Solutions": 0,
      "UI/UX Design": 0,
      "Full Stack Development": 0,
      "AI Enterprise Development": 0,
      "General Inquiry": 0
    };

    inquiries.forEach(inq => {
      let s = inq.service || "General Inquiry";
      if (s === "website") s = "Website Development";
      else if (s === "app" || s === "Mobile App Development") s = "App Development";
      else if (s === "saas" || s === "SaaS Platform Development") s = "SaaS Development";
      else if (s === "ecommerce") s = "E-Commerce Solutions";
      else if (s === "uiux" || s === "UI/UX Interface Design") s = "UI/UX Design";
      else if (s === "full-stack") s = "Full Stack Development";
      else if (s === "Custom Enterprise Software") s = "Full Stack Development";
      else if (s === "other") s = "General Inquiry";

      if (servicesMap[s] !== undefined) {
        servicesMap[s]++;
      } else {
        servicesMap["General Inquiry"]++;
      }
    });

    // Provide default visual distribution if empty
    const hasData = Object.values(servicesMap).some(v => v > 0);
    if (!hasData) {
      return [
        { name: "Web Dev", count: 4, fill: "#304ce6" },
        { name: "App Dev", count: 2, fill: "#a72aff" },
        { name: "SaaS Dev", count: 3, fill: "#10b981" },
        { name: "E-Commerce", count: 1, fill: "#f59e0b" },
        { name: "UI/UX", count: 2, fill: "#ec4899" }
      ];
    }

    return Object.entries(servicesMap)
      .filter(([_, count]) => count > 0)
      .map(([name, count], index) => {
        const colors = ["#304ce6", "#a72aff", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"];
        return {
          name: name.split(" ")[0], // short name
          count,
          fill: colors[index % colors.length]
        };
      });
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.requirement && inq.requirement.toLowerCase().includes(inquirySearch.toLowerCase()));

    const matchesStatus =
      inquiryStatusFilter === "All" || inq.status === inquiryStatusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ────────── LOCK SCREEN (UNAUTHENTICATED) ────────── */
  if (!isAuthenticated) {
    return (
      <Layout>
        <SEO title="Admin Login | ScaleXWeb Control Center" description="Admin portal authentication screen" />
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-10">
          <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
          <div className="orb w-[500px] h-[500px] bg-primary/5 -top-40 -left-40 rounded-full blur-3xl absolute -z-10" />
          <div className="orb w-[300px] h-[300px] bg-accent/5 bottom-0 right-0 rounded-full blur-3xl absolute -z-10" />

          <AnimatePresence mode="wait">
            {!showLoginForm ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative mx-auto h-[780px] w-[375px] max-w-sm overflow-hidden rounded-3xl border border-border shadow-lg bg-card z-10"
              >
                <WelcomeScreen
                  imageUrl="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  title={
                    <>
                      Control <span className="text-primary font-heading font-black">Center</span>
                    </>
                  }
                  description="Authenticate to manage sitemaps, track user inquiries, update website sections, and configure CMS settings."
                  buttonText="Get Started"
                  onButtonClick={() => setShowLoginForm(true)}
                  secondaryActionText="Back to Homepage"
                  onSecondaryActionClick={() => window.location.href = "/"}
                />
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-6 sm:p-10 border border-border bg-card rounded-2xl shadow-sm relative z-10 mx-4"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-5 h-5 text-primary" />
                </div>

                <h2 className="text-2xl font-heading font-extrabold text-center text-foreground mb-1">Control Panel Login</h2>
                <p className="text-center text-xs text-muted-foreground mb-8">Authenticate to access sitemaps, inquiries, and CMS settings</p>

                {lockoutTimeLeft > 0 ? (
                  <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4 text-center text-xs space-y-2">
                    <p className="text-destructive font-bold">Too many failed login attempts.</p>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      Lockout active. Please wait{" "}
                      <span className="text-foreground font-bold font-mono">
                        {Math.floor(lockoutTimeLeft / 60)}m {lockoutTimeLeft % 60}s
                      </span>{" "}
                      before trying again.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Username</label>
                      <Input
                         type="text"
                         placeholder="admin"
                         value={usernameInput}
                         onChange={(e) => setUsernameInput(e.target.value)}
                         className="bg-background border-border rounded-xl"
                         required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Password</label>
                      <Input
                         type="password"
                         placeholder="••••••••"
                         value={passwordInput}
                         onChange={(e) => setPasswordInput(e.target.value)}
                         className="bg-background border-border rounded-xl"
                         required
                      />
                    </div>
                    <Button type="submit" variant="default" className="w-full h-11 rounded-xl mt-6">
                      Log In
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setShowLoginForm(false)} 
                      className="w-full h-10 rounded-xl mt-2 text-xs text-muted-foreground"
                    >
                      Back to Welcome
                    </Button>
                  </form>
                )}

                <p className="text-center text-[10px] text-muted-foreground mt-6 leading-relaxed">
                  Default password configured in local launchpad properties.<br />
                  Connected Mode: <span className={isSupabase ? "text-success font-bold" : "text-amber-500 font-bold"}>{isSupabase ? "Supabase Cloud" : "Local Mock Storage"}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </Layout>
    );
  }

  /* ────────── ADMIN CONTROL PANEL (AUTHENTICATED) ────────── */
  return (
    <Layout>
      <SEO title="Control Panel | ScaleXWeb Admin Console" description="Site management console dashboard" />
      <section className="relative pt-24 pb-20 overflow-hidden min-h-screen bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

        <div className="container-tight relative z-10 px-4">
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/40 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {currentUserDisplayName}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${isSupabase ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  <Database className="w-3 h-3" />
                  {isSupabase ? "Supabase Live" : "Local Mock Mode"}
                </span>
              </div>
              <h1 className="text-3xl font-heading font-black text-foreground">Console Control Center</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 border-border/50 bg-card rounded-xl text-xs"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0 mb-4 lg:mb-0 w-full no-scrollbar">
              {[
                { id: "overview", label: "Overview Metrics", icon: LayoutDashboard },
                { id: "analytics", label: "Traffic Analytics", icon: Activity },
                { id: "content", label: "Content Manager", icon: FileText },
                { id: "inquiries", label: "Leads & Inquiries", icon: Users },
                { id: "invoices", label: "Invoice System", icon: Receipt },
                { id: "settings", label: "Settings & Setup", icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedInquiry(null);
                    }}
                    className={`flex-shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left whitespace-nowrap ${activeTab === tab.id ? "bg-primary text-white shadow-md glow-sm" : "bg-card/40 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/75"}`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Panel Content Area */}
            <div className="lg:col-span-4 min-h-[500px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-96 bg-card/20 rounded-2xl border border-border/30">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">Syncing sitemaps and database...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {/* OVERVIEW METRICS TAB */}
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Metric widgets grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: "Total Inquiries", val: inquiries.length, icon: FileText, color: "text-primary bg-primary/10" },
                          { title: "Active Services", val: services.length, icon: Globe, color: "text-accent bg-accent/10" },
                          { title: "Target Industries", val: industries.length, icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10" },
                          { title: "Site Health Status", val: "99.9%", icon: CheckCircle, color: "text-sky-400 bg-sky-500/10" }
                        ].map((m, i) => {
                          const Icon = m.icon;
                          return (
                            <div key={i} className="gradient-border bg-card rounded-2xl p-5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{m.title}</div>
                              <div className="text-2xl font-black font-heading mt-1 text-foreground">{m.val}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recharts Plots */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Area Chart - Inquiries Trend */}
                        <div className="gradient-border bg-card rounded-2xl p-5 md:p-6">
                          <h3 className="text-base font-bold text-foreground mb-4">Inquiry Volume Trend</h3>
                          <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4c" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: "#0b0c1e", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }}
                                  labelStyle={{ fontWeight: "bold", color: "#f8fafc" }}
                                />
                                <Area type="monotone" dataKey="count" name="Inquiries" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Bar Chart - Service distribution */}
                        <div className="gradient-border bg-card rounded-2xl p-5 md:p-6">
                          <h3 className="text-base font-bold text-foreground mb-4">Distribution by Service Category</h3>
                          <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getServiceDistributionData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4c" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: "#0b0c1e", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px" }}
                                  itemStyle={{ color: "#f8fafc" }}
                                />
                                <Bar dataKey="count" name="Inquiries" radius={[4, 4, 0, 0]}>
                                  {getServiceDistributionData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Recent Inquiries List Widget */}
                      <div className="gradient-border bg-card rounded-2xl p-5 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base font-bold text-foreground">Recent Form Submissions</h3>
                          <button
                            onClick={() => setActiveTab("inquiries")}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            View All ({inquiries.length})
                          </button>
                        </div>

                        <div className="space-y-3">
                          {inquiries.slice(0, 3).map((inq) => (
                            <div
                              key={inq.id}
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setActiveTab("inquiries");
                              }}
                              className="p-4 border border-border/40 hover:border-border rounded-xl bg-background/50 hover:bg-background/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-foreground">{inq.name}</div>
                                <div className="text-xs text-muted-foreground flex flex-wrap gap-1.5 sm:gap-3 items-center">
                                  <span>{inq.email}</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-primary font-medium">{inq.service || "General Inquiry"}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 self-end sm:self-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  inq.status === "New" ? "bg-blue-500/10 text-blue-400" :
                                  inq.status === "In Progress" ? "bg-amber-500/10 text-amber-400" :
                                  inq.status === "Contacted" ? "bg-purple-500/10 text-purple-400" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {inq.status}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(inq.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </div>
                          ))}

                          {inquiries.length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground">
                              No inquiries captured yet. Try submitting the contact form!
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TRAFFIC & LIVE ANALYTICS TAB */}
                  {activeTab === "analytics" && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Top Metrics Cards */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          {
                            label: "Total Page Views",
                            value: Object.values(analytics?.pageViews || {}).reduce((a: any, b: any) => a + b, 0) as number,
                            subtext: "+18.4% from last week",
                            color: "text-primary",
                            icon: Activity
                          },
                          {
                            label: "Unique Visitors",
                            value: Math.round(Object.values(analytics?.pageViews || {}).reduce((a: any, b: any) => a + b, 0) as number * 0.46),
                            subtext: "Avg. 2.1 views per user",
                            color: "text-purple-400",
                            icon: Users
                          },
                          {
                            label: "Bounce Rate",
                            value: "32.4%",
                            subtext: "-4.2% bounce rate change",
                            color: "text-amber-400",
                            icon: TrendingUp
                          },
                          {
                            label: "Live Active Users",
                            value: liveUsersCount,
                            subtext: "Real-time active sessions",
                            color: "text-emerald-400",
                            icon: Globe
                          }
                        ].map((card, idx) => {
                          const Icon = card.icon;
                          return (
                            <div key={card.label} className="gradient-border bg-card rounded-2xl p-3.5 sm:p-5 flex items-center justify-between gap-2 shadow-sm relative overflow-hidden group hover:glow-sm transition-all duration-300">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{card.label}</span>
                                <div className="text-lg sm:text-2xl font-black text-foreground flex items-center gap-1.5">
                                  {card.label === "Live Active Users" && (
                                    <span className="relative flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                  )}
                                  {card.value}
                                </div>
                                <span className="text-[9px] text-muted-foreground/80 block">{card.subtext}</span>
                              </div>
                              <div className={`p-2 rounded-xl bg-muted/60 ${card.color} border border-border/40 flex-shrink-0`}>
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Main Traffic Charts & Live Stream */}
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Traffic Chart */}
                        <div className="lg:col-span-2 gradient-border bg-card rounded-3xl p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-foreground text-base">Traffic Over Time</h3>
                              <p className="text-[10px] text-muted-foreground">Daily page views trend for the past 7 days</p>
                            </div>
                            <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold rounded-lg font-mono">Last 7 Days</span>
                          </div>
                          
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={getTrafficChartData()}
                                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
                                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                                <Tooltip
                                  contentStyle={{ background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "10px", color: "#f8fafc" }}
                                />
                                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#viewsGrad)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Live Activity Stream */}
                        <div className="lg:col-span-1 gradient-border bg-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-foreground text-base">Live Activity Feed</h3>
                              <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-4">Real-time visitor logs and actions</p>
                            
                            <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                              {(analytics?.recentActivity || []).map((act: any, idx: number) => (
                                <div key={act.id || idx} className="flex gap-3 items-start text-xs border-b border-border/10 pb-2.5 last:border-0 last:pb-0">
                                  <div className={`p-1.5 rounded-lg border border-border/40 mt-0.5 ${act.device === "Mobile" ? "bg-purple-500/10 text-purple-400" : "bg-primary/10 text-primary"}`}>
                                    <Globe className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 space-y-0.5">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-foreground">Visitor from {act.city}</span>
                                      <span className="text-[8px] font-mono text-muted-foreground">
                                        {new Date(act.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                      Viewed <span className="text-primary font-semibold">{act.path}</span> via {act.device}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Top Pages & Geo details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Top Pages Table */}
                        <div className="gradient-border bg-card rounded-3xl p-6 space-y-4">
                          <h3 className="font-bold text-foreground text-base">Top Visited Pages</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-border/30 text-muted-foreground pb-2">
                                  <th className="font-bold pb-2">Page URL</th>
                                  <th className="font-bold pb-2 text-right">Page Views</th>
                                  <th className="font-bold pb-2 text-right">Traffic Share</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(analytics?.pageViews || {})
                                  .sort((a, b) => b[1] - a[1])
                                  .map(([path, val]) => {
                                    const total = Object.values(analytics?.pageViews || {}).reduce((x: any, y: any) => x + y, 0) as number;
                                    const percent = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
                                    return (
                                      <tr key={path} className="border-b border-border/10 last:border-0 hover:bg-muted/10 transition-colors">
                                        <td className="py-2.5 font-mono text-primary select-all break-all pr-2">{path}</td>
                                        <td className="py-2.5 text-right font-semibold text-foreground whitespace-nowrap">{val} views</td>
                                        <td className="py-2.5 text-right font-medium text-muted-foreground">{percent}%</td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Devices & Cities metrics */}
                        <div className="gradient-border bg-card rounded-3xl p-6 space-y-5">
                          <h3 className="font-bold text-foreground text-base">Device & Geographic Breakdown</h3>
                          
                          {/* Device Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="text-foreground">Desktop Traffic</span>
                              <span className="text-muted-foreground">58%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: "58%" }} />
                            </div>
                          </div>

                          <div className="space-y-2 pb-2 border-b border-border/20">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="text-foreground">Mobile & Tablet Traffic</span>
                              <span className="text-muted-foreground">42%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: "42%" }} />
                            </div>
                          </div>

                          {/* Geographic splits */}
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Top Traffic Locations</span>
                            {[
                              { city: "Ahmedabad, IN", percent: "38%", width: "38%" },
                              { city: "Mumbai, IN", percent: "26%", width: "26%" },
                              { city: "New Delhi, IN", percent: "18%", width: "18%" },
                              { city: "Others", percent: "18%", width: "18%" }
                            ].map((loc) => (
                              <div key={loc.city} className="flex justify-between items-center text-xs">
                                <span className="text-foreground/80 font-medium">{loc.city}</span>
                                <div className="flex items-center gap-3 w-1/2">
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/70 rounded-full" style={{ width: loc.width }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{loc.percent}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CONTENT MANAGER (CMS) TAB */}
                  {activeTab === "content" && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Section selectors */}
                      <div className="gradient-border bg-card rounded-2xl p-4 flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                          { id: "stats", label: "Stats Bar" },
                          { id: "testimonials", label: "Testimonials" },
                          { id: "services", label: "Services Grid" },
                          { id: "values", label: "Values List" },
                          { id: "processSteps", label: "Process Steps" },
                          { id: "trustPoints", label: "Why Trust Us" },
                          { id: "industries", label: "Industries" },
                          { id: "techMarqueeItems", label: "Marquee Tech" },
                          { id: "techStack", label: "Tech Stack Grid" },
                          { id: "challenges", label: "Challenges Accordion" },
                          { id: "caseStudies", label: "Case Studies" },
                          { id: "saasArchitecture", label: "SaaS Architecture" },
                          { id: "saasFeatures", label: "SaaS Features" },
                          { id: "saasWhyUs", label: "SaaS Why Us" }
                        ].map((sect) => (
                          <button
                            key={sect.id}
                            onClick={() => setSelectedCmsSection(sect.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCmsSection === sect.id ? "bg-primary text-white" : "bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground"}`}
                          >
                            {sect.label}
                          </button>
                        ))}
                      </div>

                      {/* Content editor block */}
                      <div className="gradient-border bg-card rounded-3xl p-6 md:p-8 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-border/40">
                          <div>
                            <h2 className="text-lg font-bold text-foreground">Edit {selectedCmsSection.toUpperCase()}</h2>
                            <p className="text-xs text-muted-foreground">Modify site layout sections locally or sync to Supabase</p>
                          </div>
                          <Button onClick={handleAddNewItem} size="sm" className="gap-1.5 text-xs rounded-xl">
                            <Plus className="w-4 h-4" /> Add New Item
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {cmsDataList.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-5 border border-border/40 rounded-2xl bg-background/30 space-y-4 hover:border-border/80 transition-colors"
                            >
                              {editingIndex === idx ? (
                                /* Editing Mode fields */
                                <div className="space-y-4">
                                  {selectedCmsSection === "stats" && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Stat Value</label>
                                        <Input
                                          value={editForm.value || ""}
                                          onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Stat Label</label>
                                        <Input
                                          value={editForm.label || ""}
                                          onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "testimonials" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Quote</label>
                                        <Textarea
                                          value={editForm.quote || ""}
                                          onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                                          rows={3}
                                        />
                                      </div>
                                      <div className="grid sm:grid-cols-4 gap-4">
                                        <div className="sm:col-span-2">
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Name</label>
                                          <Input
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Role</label>
                                          <Input
                                            value={editForm.role || ""}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Initials</label>
                                          <Input
                                            value={editForm.initials || ""}
                                            onChange={(e) => setEditForm({ ...editForm, initials: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Company Name</label>
                                        <Input
                                          value={editForm.company || ""}
                                          onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "services" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Service Name</label>
                                          <Input
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon String</label>
                                          <Input
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                            placeholder="Globe, Smartphone, Cloud, etc."
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Short Description</label>
                                        <Textarea
                                          value={editForm.desc || ""}
                                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Route Path</label>
                                        <Input
                                          value={editForm.path || ""}
                                          onChange={(e) => setEditForm({ ...editForm, path: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "values" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Value Title</label>
                                          <Input
                                            value={editForm.title || ""}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon String</label>
                                          <Input
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description</label>
                                        <Textarea
                                          value={editForm.desc || ""}
                                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "processSteps" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-3 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Step Number</label>
                                          <Input
                                            value={editForm.step || ""}
                                            onChange={(e) => setEditForm({ ...editForm, step: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Title</label>
                                          <Input
                                            value={editForm.title || ""}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon</label>
                                          <Input
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description</label>
                                        <Textarea
                                          value={editForm.desc || ""}
                                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "trustPoints" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Title</label>
                                          <Input
                                            value={editForm.title || ""}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon</label>
                                          <Input
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description</label>
                                        <Textarea
                                          value={editForm.desc || ""}
                                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "industries" && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Industry Name</label>
                                        <Input
                                          value={editForm.name || ""}
                                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon</label>
                                        <Input
                                          value={editForm.icon || ""}
                                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "techMarqueeItems" && (
                                    <div>
                                      <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Tech Name</label>
                                      <Input
                                        value={editForm.name || ""}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      />
                                    </div>
                                  )}

                                  {selectedCmsSection === "challenges" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Challenge Label</label>
                                          <Input
                                            value={editForm.challenge || ""}
                                            onChange={(e) => setEditForm({ ...editForm, challenge: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Mapped Solution</label>
                                          <Input
                                            value={editForm.solution || ""}
                                            onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description / Details</label>
                                        <Textarea
                                          value={editForm.detail || ""}
                                          onChange={(e) => setEditForm({ ...editForm, detail: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "caseStudies" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Industry</label>
                                          <Input
                                            value={editForm.industry || ""}
                                            onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Result Tag</label>
                                          <Input
                                            value={editForm.tag || ""}
                                            onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Challenge Description</label>
                                        <Textarea
                                          value={editForm.challenge || ""}
                                          onChange={(e) => setEditForm({ ...editForm, challenge: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Solution Details</label>
                                        <Textarea
                                          value={editForm.solution || ""}
                                          onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Result Details</label>
                                        <Textarea
                                          value={editForm.result || ""}
                                          onChange={(e) => setEditForm({ ...editForm, result: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "saasArchitecture" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Component Name</label>
                                          <Input
                                            value={editForm.name || ""}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon</label>
                                          <Input
                                            value={editForm.icon || ""}
                                            onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description</label>
                                        <Textarea
                                          value={editForm.desc || ""}
                                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "saasFeatures" && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Feature Name</label>
                                        <Input
                                          value={editForm.name || ""}
                                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Lucide Icon</label>
                                        <Input
                                          value={editForm.icon || ""}
                                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "saasWhyUs" && (
                                    <div className="space-y-4">
                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Step Number</label>
                                          <Input
                                            value={editForm.number || ""}
                                            onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Title</label>
                                          <Input
                                            value={editForm.title || ""}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Description Body</label>
                                        <Textarea
                                          value={editForm.body || ""}
                                          onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                                          rows={2}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {selectedCmsSection === "techStack" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Stack Category</label>
                                        <Input
                                          value={editForm.category || ""}
                                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Technologies (Comma-separated)</label>
                                        <Textarea
                                          value={editForm.items || ""}
                                          onChange={(e) => setEditForm({ ...editForm, items: e.target.value })}
                                          rows={3}
                                          placeholder="React.js, Vue.js, Angular"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-2 justify-end pt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs rounded-xl"
                                      onClick={() => setEditingIndex(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="text-xs rounded-xl gap-1"
                                      onClick={() => handleSaveEdit(idx)}
                                    >
                                      <Save className="w-3.5 h-3.5" /> Save Changes
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                /* Read Only mode rendering */
                                <div className="flex justify-between items-start gap-4">
                                  <div className="space-y-1">
                                    {selectedCmsSection === "stats" && (
                                      <div>
                                        <span className="text-lg font-extrabold font-heading text-primary mr-3">{item.value}</span>
                                        <span className="text-sm text-foreground/90">{item.label}</span>
                                      </div>
                                    )}

                                    {selectedCmsSection === "testimonials" && (
                                      <div className="space-y-1.5">
                                        <p className="text-xs italic text-muted-foreground max-w-2xl">"{item.quote}"</p>
                                        <div className="text-xs font-bold text-foreground">
                                          {item.name} — {item.role}, <span className="text-primary">{item.company}</span>
                                        </div>
                                      </div>
                                    )}

                                    {selectedCmsSection === "services" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        <p className="text-[10px] text-muted-foreground font-mono">{item.path}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "values" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "processSteps" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded gradient-primary">{item.step}</span>
                                          <span className="text-sm font-bold text-foreground">{item.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        <p className="text-[10px] text-primary/70">Icon: {item.icon}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "trustPoints" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "industries" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.name}</span>
                                        </div>
                                      </div>
                                    )}

                                    {selectedCmsSection === "techMarqueeItems" && (
                                      <div>
                                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                                      </div>
                                    )}

                                    {selectedCmsSection === "challenges" && (
                                      <div className="space-y-1">
                                        <div className="text-xs font-bold text-destructive">Challenge: {item.challenge}</div>
                                        <div className="text-xs font-bold text-primary">Solution: {item.solution}</div>
                                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "caseStudies" && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded gradient-primary">{item.industry}</span>
                                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-medium">{item.tag}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground/80">Challenge:</span> {item.challenge}</p>
                                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground/80">Solution:</span> {item.solution}</p>
                                        <p className="text-xs text-primary/95"><span className="font-semibold text-primary">Result:</span> {item.result}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "saasArchitecture" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "saasFeatures" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">{item.icon}</span>
                                          <span className="text-sm font-bold text-foreground">{item.name}</span>
                                        </div>
                                      </div>
                                    )}

                                    {selectedCmsSection === "saasWhyUs" && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded gradient-primary">{item.number}</span>
                                          <span className="text-sm font-bold text-foreground">{item.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{item.body}</p>
                                      </div>
                                    )}

                                    {selectedCmsSection === "techStack" && (
                                      <div className="space-y-1">
                                        <div className="text-sm font-bold text-foreground mb-1">{item.category}</div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {(item.items || "").split(",").map((t: string) => (
                                            <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">{t.trim()}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleStartEdit(idx)}
                                      className="p-1.5 rounded-lg border border-border/40 hover:border-border bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                                      title="Edit Item"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(idx)}
                                      className="p-1.5 rounded-lg border border-destructive/20 hover:border-destructive/50 bg-destructive/5 hover:bg-destructive/10 text-destructive/80 hover:text-destructive transition-all"
                                      title="Delete Item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* INQUIRIES TAB */}
                  {activeTab === "inquiries" && (
                    <motion.div
                      key="inquiries"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Search and filters bar */}
                      <div className="gradient-border bg-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                          <Input
                            placeholder="Search client, email, details..."
                            value={inquirySearch}
                            onChange={(e) => setInquirySearch(e.target.value)}
                            className="bg-background/60 border-border/50 rounded-xl text-xs max-w-sm"
                          />
                          <select
                            value={inquiryStatusFilter}
                            onChange={(e) => setInquiryStatusFilter(e.target.value)}
                            className="bg-background/60 border border-border/50 rounded-xl px-3 py-2 text-xs text-foreground/80 outline-none max-w-xs focus:ring-1 focus:ring-primary"
                          >
                            <option value="All">All Statuses</option>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                        <Button onClick={handleExportInquiriesCSV} variant="outline" size="sm" className="gap-1.5 text-xs rounded-xl border-border/50 bg-background/50 hover:bg-background">
                          <Download className="w-4 h-4" /> Export CSV
                        </Button>
                      </div>

                      {/* Split view: Table on left, detail panel on right */}
                      <div className="grid lg:grid-cols-3 gap-6 items-start">
                        {/* Table list */}
                        <div className={`gradient-border bg-card rounded-3xl p-5 md:p-6 space-y-4 ${selectedInquiry ? "hidden lg:block lg:col-span-2" : "lg:col-span-3"}`}>
                          <h3 className="text-base font-bold text-foreground mb-2">Captured Inquiries ({filteredInquiries.length})</h3>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-border/40 text-muted-foreground font-semibold">
                                  <th className="pb-3">Client Name</th>
                                  <th className="pb-3 hidden sm:table-cell">Email Address</th>
                                  <th className="pb-3 hidden md:table-cell">Phone No</th>
                                  <th className="pb-3 hidden sm:table-cell">Service</th>
                                  {!selectedInquiry && <th className="pb-3 hidden lg:table-cell">Project Description</th>}
                                  <th className="pb-3">Submitted</th>
                                  <th className="pb-3 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredInquiries.map((inq) => (
                                  <tr
                                    key={inq.id}
                                    onClick={() => setSelectedInquiry(inq)}
                                    className={`border-b border-border/20 last:border-none hover:bg-background/30 transition-colors cursor-pointer ${selectedInquiry?.id === inq.id ? "bg-primary/5 border-primary/20" : ""}`}
                                  >
                                    <td className="py-3.5 pr-2 font-bold text-foreground">
                                      {inq.name}
                                    </td>
                                    <td className="py-3.5 hidden sm:table-cell text-muted-foreground pr-2 break-all">
                                      {inq.email}
                                    </td>
                                    <td className="py-3.5 hidden md:table-cell text-muted-foreground pr-2">
                                      {inq.phone || "—"}
                                    </td>
                                    <td className="py-3.5 hidden sm:table-cell text-primary font-medium pr-2">
                                      {inq.service || "General Inquiry"}
                                    </td>
                                    {!selectedInquiry && (
                                      <td className="py-3.5 hidden lg:table-cell text-muted-foreground max-w-[240px] truncate pr-2" title={inq.requirement}>
                                        {inq.requirement}
                                      </td>
                                    )}
                                    <td className="py-3.5 text-muted-foreground whitespace-nowrap">
                                      {new Date(inq.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                    </td>
                                    <td className="py-3.5 text-right">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        inq.status === "New" ? "bg-blue-500/10 text-blue-400" :
                                        inq.status === "In Progress" ? "bg-amber-500/10 text-amber-400" :
                                        inq.status === "Contacted" ? "bg-purple-500/10 text-purple-400" :
                                        "bg-emerald-500/10 text-emerald-400"
                                      }`}>
                                        {inq.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}

                                {filteredInquiries.length === 0 && (
                                  <tr>
                                    <td colSpan={selectedInquiry ? 6 : 7} className="text-center py-10 text-muted-foreground">
                                      No inquiries match the filter criteria.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Selected detail panel */}
                        {selectedInquiry && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 gradient-border bg-card rounded-3xl p-6 space-y-6"
                          >
                            <div className="flex justify-between items-start pb-4 border-b border-border/40">
                              <div>
                                <h3 className="font-bold text-foreground text-sm">Lead Details</h3>
                                <p className="text-[10px] font-mono text-muted-foreground">ID: {selectedInquiry.id}</p>
                              </div>
                              <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-xs text-muted-foreground hover:text-foreground font-bold flex items-center gap-1"
                              >
                                <span className="lg:hidden">← Back to List</span>
                                <span className="hidden lg:inline">Close</span>
                              </button>
                            </div>

                            <div className="space-y-4 text-xs">
                              {/* Fields */}
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Client Name</span>
                                <div className="text-foreground font-bold">{selectedInquiry.name}</div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Email</span>
                                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline font-medium break-all">{selectedInquiry.email}</a>
                                </div>
                                <div>
                                  <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Phone</span>
                                  <div className="text-foreground font-medium">{selectedInquiry.phone || "Not provided"}</div>
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Interest Category</span>
                                <div className="text-primary font-bold">{selectedInquiry.service || "General Inquiry"}</div>
                              </div>

                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Project Brief / Message</span>
                                <div className="p-3 bg-background/50 rounded-xl border border-border/30 text-foreground/80 leading-relaxed font-sans select-text whitespace-pre-wrap">
                                  {selectedInquiry.requirement}
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Manage Status</span>
                                <select
                                  value={selectedInquiry.status}
                                  onChange={(e) => {
                                    updateInquiryStatus(selectedInquiry.id, e.target.value as any);
                                    setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any });
                                  }}
                                  className="w-full bg-background border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground outline-none mt-1 focus:ring-1 focus:ring-primary"
                                >
                                  <option value="New">New</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </div>

                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block font-semibold mb-1">Admin Internal Notes</span>
                                <Textarea
                                  placeholder="Write notes about call schedules, requirements pricing..."
                                  value={selectedInquiry.notes || ""}
                                  onChange={(e) => {
                                    updateInquiryNotes(selectedInquiry.id, e.target.value);
                                    setSelectedInquiry({ ...selectedInquiry, notes: e.target.value });
                                  }}
                                  className="mt-1 bg-background/60 border-border/50 text-xs rounded-xl"
                                  rows={4}
                                />
                              </div>

                              <div className="pt-4 border-t border-border/40">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    if (window.confirm("Are you sure you want to permanently delete this inquiry?")) {
                                      await deleteInquiry(selectedInquiry.id);
                                      setSelectedInquiry(null);
                                    }
                                  }}
                                  className="w-full gap-1.5 text-xs text-destructive border-destructive/20 hover:border-destructive/40 bg-destructive/5 hover:bg-destructive/10 rounded-xl"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Lead Record
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* SETTINGS AND DATABASE TAB */}
                  {activeTab === "settings" && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Supabase status setup guide card */}
                      <div className="gradient-border bg-card rounded-3xl p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSupabase ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-base">Supabase Connection Configuration</h3>
                            <p className="text-xs text-muted-foreground">
                              {isSupabase ? "Site content and form inquiries are synchronized live to your Supabase cloud tables." : "Running in Local Storage mode. Setup database to support shared dashboards."}
                            </p>
                          </div>
                        </div>

                        {!isSupabase && (
                          <div className="p-5 border border-amber-500/25 rounded-2xl bg-amber-500/5 space-y-4">
                            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" /> Supabase Connection Wizard
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Your ScaleXWeb Launchpad includes a built-in Supabase client config. To connect your cloud DB:
                            </p>
                            <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-2 leading-relaxed">
                              <li>Create a project in the <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">Supabase Console <ExternalLink className="w-3 h-3" /></a></li>
                              <li>Open the **SQL Editor**, paste the SQL queries from the [Implementation Plan](file:///C:/Users/yeaht/.gemini/antigravity/brain/98ce7b52-7faf-4aad-ab52-606e41fe6b2a/implementation_plan.md) (or scroll down for SQL copy-paste), and run them to create `site_content` and `inquiries` tables.</li>
                              <li>Create a `.env` (or `.env.local`) file in the project folder and paste your keys:
                                <pre className="p-3 bg-slate-950 text-slate-300 rounded-lg text-[10px] font-mono mt-2 select-text border border-white/5 overflow-x-auto">
                                  VITE_SUPABASE_URL=https://your-project-id.supabase.co{"\n"}
                                  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                                </pre>
                              </li>
                              <li>Restart the development server (`npm run dev`) and reload the Admin Panel. It will connect automatically!</li>
                            </ol>
                          </div>
                        )}

                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-foreground mb-3">Table Generation SQL queries:</h4>
                          <pre className="p-4 bg-slate-950 text-slate-300 rounded-xl text-[10px] font-mono select-text border border-white/5 max-h-48 overflow-y-auto whitespace-pre">
{`-- 1. Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT DEFAULT 'General Inquiry',
    requirement TEXT NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Contacted', 'Closed')),
    notes TEXT
);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public contact forms)
CREATE POLICY "Allow anonymous inserts" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Allow authenticated reads/writes (admin operations)
CREATE POLICY "Allow public select" ON public.inquiries
    FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON public.inquiries
    FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.inquiries
    FOR DELETE USING (true);

-- 2. Create Site Content Table (CMS data)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read content" ON public.site_content
    FOR SELECT USING (true);
CREATE POLICY "Allow public write content" ON public.site_content
    FOR ALL USING (true);

-- 3. Create Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pin_code TEXT,
    country TEXT,
    gstin TEXT,
    ship_to_same BOOLEAN DEFAULT false,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_pin TEXT,
    shipping_country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.clients FOR DELETE USING (true);

-- 4. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    unit_price NUMERIC NOT NULL,
    tax_rate NUMERIC NOT NULL,
    hsn_sac TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.products FOR DELETE USING (true);

-- 5. Create Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL,
    client_id TEXT,
    client_data JSONB NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL,
    currency TEXT NOT NULL,
    currency_symbol TEXT NOT NULL,
    payment_terms TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC NOT NULL,
    discount_amount NUMERIC NOT NULL,
    tax_summary JSONB NOT NULL,
    total_tax NUMERIC NOT NULL,
    shipping_charges NUMERIC NOT NULL,
    adjustment NUMERIC NOT NULL,
    grand_total NUMERIC NOT NULL,
    amount_paid NUMERIC NOT NULL,
    balance_due NUMERIC NOT NULL,
    business_details JSONB NOT NULL,
    bank_details JSONB,
    terms_conditions TEXT,
    notes TEXT,
    template_id TEXT NOT NULL,
    color_theme TEXT NOT NULL,
    show_logo BOOLEAN NOT NULL,
    show_bank BOOLEAN NOT NULL,
    show_signature BOOLEAN NOT NULL,
    show_qr BOOLEAN NOT NULL,
    signature_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.invoices FOR DELETE USING (true);

-- 6. Create Invoice Items Table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC NOT NULL,
    discount_amount NUMERIC NOT NULL,
    tax_rate NUMERIC NOT NULL,
    hsn_sac TEXT,
    line_total NUMERIC NOT NULL,
    sort_order INT NOT NULL
);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.invoice_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.invoice_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.invoice_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.invoice_items FOR DELETE USING (true);

-- 7. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_mode TEXT NOT NULL,
    transaction_ref TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.payments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.payments FOR DELETE USING (true);

-- 8. Create Recurring Invoices Table
CREATE TABLE IF NOT EXISTS public.recurring_invoices (
    id TEXT PRIMARY KEY,
    schedule_name TEXT NOT NULL,
    client_id TEXT,
    client_name TEXT NOT NULL,
    invoice_template_data JSONB NOT NULL,
    frequency TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    max_occurrences INT,
    occurrences_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_generated_at TIMESTAMP WITH TIME ZONE,
    next_generation_date DATE NOT NULL,
    auto_send BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recurring_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.recurring_invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.recurring_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.recurring_invoices FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.recurring_invoices FOR DELETE USING (true);

-- 9. Create Credit Notes Table
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id TEXT PRIMARY KEY,
    credit_note_number TEXT NOT NULL,
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    client_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    credit_note_date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    reason TEXT NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.credit_notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.credit_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.credit_notes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.credit_notes FOR DELETE USING (true);

-- 10. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.admins FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.admins FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.admins FOR DELETE USING (true);

-- Seed initial admin (email: admin@scalexweb.com, password: admin123, hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9)
INSERT INTO public.admins (id, email, name, password_hash)
VALUES ('admin-1', 'admin@scalexweb.com', 'Yash Patel', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
ON CONFLICT (email) DO NOTHING;`}
                          </pre>
                        </div>
                      </div>

                      {/* Site settings form */}
                      <div className="gradient-border bg-card rounded-3xl p-6 md:p-8">
                        <h3 className="font-bold text-foreground text-base mb-6">Global Contact &amp; Branding Details</h3>

                        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Site Name (Branding)</label>
                              <Input
                                value={settingsForm.siteName}
                                onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Contact Email</label>
                              <Input
                                type="email"
                                value={settingsForm.contactEmail}
                                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Contact Phone</label>
                              <Input
                                value={settingsForm.contactPhone}
                                onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Physical Coordinates / Address</label>
                              <Input
                                value={settingsForm.contactAddress}
                                onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-foreground">Social Profiles Handles</h4>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="text-xs font-semibold text-foreground/60 mb-1 block">LinkedIn Company Link</label>
                                <Input
                                  value={settingsForm.socialLinkedin}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, socialLinkedin: e.target.value })}
                                  className="bg-background/60 border-border/50 text-[10px] rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground/60 mb-1 block">Twitter Handle Link</label>
                                <Input
                                  value={settingsForm.socialTwitter}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, socialTwitter: e.target.value })}
                                  className="bg-background/60 border-border/50 text-[10px] rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground/60 mb-1 block">GitHub Organization Link</label>
                                <Input
                                  value={settingsForm.socialGithub}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, socialGithub: e.target.value })}
                                  className="bg-background/60 border-border/50 text-[10px] rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground/60 mb-1 block">Instagram Profile Link</label>
                                <Input
                                  value={settingsForm.socialInstagram}
                                  onChange={(e) => setSettingsForm({ ...settingsForm, socialInstagram: e.target.value })}
                                  className="bg-background/60 border-border/50 text-[10px] rounded-xl"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Branding & Status Switch */}
                          <div className="space-y-4 pt-4 border-t border-border/20">
                            <h4 className="text-xs font-bold text-foreground">Branding & System Settings</h4>
                            <div className="grid sm:grid-cols-2 gap-6">
                              {/* Logo Upload */}
                              <div className="space-y-3">
                                <label className="text-xs font-semibold text-foreground/80 block">Brand Logo Image</label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-background/30 p-3 rounded-2xl border border-border/30">
                                  <div className="w-14 h-14 bg-background/80 rounded-xl border border-border/40 p-2 flex items-center justify-center overflow-hidden">
                                    {settingsForm.logoUrl ? (
                                      <img src={settingsForm.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                      <div className="text-[9px] text-muted-foreground text-center">No Logo</div>
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleLogoChange}
                                      className="block w-full text-[10px] text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                    <p className="text-[9px] text-muted-foreground">Supported format: PNG, JPG, WebP (Max 2MB)</p>
                                    {settingsForm.logoUrl && (
                                      <button
                                        type="button"
                                        onClick={() => setSettingsForm({ ...settingsForm, logoUrl: "" })}
                                        className="text-[9px] text-destructive hover:underline block mt-1"
                                      >
                                        Remove logo (revert to default)
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Maintenance Mode */}
                              <div className="space-y-3">
                                <label className="text-xs font-semibold text-foreground/80 block">Maintenance Status</label>
                                <div className="flex items-center justify-between bg-background/30 p-4 rounded-2xl border border-border/30">
                                  <div className="space-y-0.5 pr-2">
                                    <div className="text-xs font-bold text-foreground">Maintenance Mode</div>
                                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                                      Disable frontend access for normal visitors (admin dashboard remains accessible).
                                    </div>
                                  </div>
                                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input
                                      type="checkbox"
                                      checked={settingsForm.isMaintenanceMode}
                                      onChange={(e) => setSettingsForm({ ...settingsForm, isMaintenanceMode: e.target.checked })}
                                      className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                  </label>
                                </div>
                              </div>

                              {/* Coming Soon Mode */}
                              <div className="space-y-3">
                                <label className="text-xs font-semibold text-foreground/80 block">Coming Soon Status & Countdown</label>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between bg-background/30 p-4 rounded-2xl border border-border/30">
                                    <div className="space-y-0.5 pr-2">
                                      <div className="text-xs font-bold text-foreground">Coming Soon Mode</div>
                                      <div className="text-[10px] text-muted-foreground leading-relaxed">
                                        Redirect visitors to Coming Soon launch page with a live countdown timer.
                                      </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                      <input
                                        type="checkbox"
                                        checked={settingsForm.isComingSoonMode}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, isComingSoonMode: e.target.checked })}
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-muted rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                  </div>
                                  
                                  {settingsForm.isComingSoonMode && (
                                    <div className="p-4 bg-background/30 rounded-2xl border border-border/30 space-y-2">
                                      <label className="text-xs font-semibold text-foreground/70 block">Target Launch Date & Time</label>
                                      <Input
                                        type="datetime-local"
                                        value={settingsForm.launchDateTime}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, launchDateTime: e.target.value })}
                                        className="bg-background/60 border-border/50 text-xs rounded-xl"
                                      />
                                      <p className="text-[9px] text-muted-foreground">Select the official launch time to start the live countdown.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button type="submit" size="sm" className="rounded-xl font-bold mt-4">
                            Save Site Settings
                          </Button>
                        </form>
                      </div>

                      {/* Admin Accounts Management */}
                      <div className="gradient-border bg-card rounded-3xl p-6 md:p-8 space-y-6">
                        <div>
                          <h3 className="font-bold text-foreground text-base mb-1">System Administrators</h3>
                          <p className="text-xs text-muted-foreground">
                            Create and manage administrator accounts who have full control over the system.
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-2">
                          {/* Active Admins List */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              Active Administrators ({adminsList.length})
                            </h4>
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {adminsList.map((admin) => {
                                const isCurrent = sessionStorage.getItem("scalex_admin_email")?.toLowerCase() === admin.email.toLowerCase() || 
                                                  (sessionStorage.getItem("scalex_admin_name") === admin.name && admin.email === "admin@scalexweb.com");
                                return (
                                  <div
                                    key={admin.id}
                                    className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-border/30 hover:border-border/60 transition-all"
                                  >
                                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-foreground truncate max-w-[150px]" title={admin.name}>{admin.name}</span>
                                        {isCurrent && (
                                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/25">
                                            You
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground truncate" title={admin.email}>{admin.email}</div>
                                      {admin.created_at && (
                                        <div className="text-[9px] text-muted-foreground/60">
                                          Added: {new Date(admin.created_at).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAdmin(admin.id)}
                                      disabled={adminsList.length <= 1}
                                      className={`p-2 rounded-xl transition-all ${
                                        adminsList.length <= 1
                                          ? "text-muted-foreground/30 cursor-not-allowed bg-background/20"
                                          : "text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                                      }`}
                                      title={adminsList.length <= 1 ? "Cannot delete the last admin account" : "Delete administrator account"}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Add New Admin Form */}
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-foreground">Create New Administrator</h4>
                            <form onSubmit={handleAddAdmin} className="space-y-3 text-xs">
                              <div>
                                <label className="text-xs font-semibold text-foreground/85 mb-1 block">Full Name</label>
                                <Input
                                  required
                                  placeholder="e.g. Yash Patel"
                                  value={newAdminName}
                                  onChange={(e) => setNewAdminName(e.target.value)}
                                  className="bg-background/60 border-border/50 text-xs rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground/85 mb-1 block">Email Address</label>
                                <Input
                                  required
                                  type="email"
                                  placeholder="e.g. yash@scalexweb.com"
                                  value={newAdminEmail}
                                  onChange={(e) => setNewAdminEmail(e.target.value)}
                                  className="bg-background/60 border-border/50 text-xs rounded-xl"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-foreground/85 mb-1 block">Secure Password</label>
                                <Input
                                  required
                                  type="password"
                                  placeholder="••••••••"
                                  value={newAdminPassword}
                                  onChange={(e) => setNewAdminPassword(e.target.value)}
                                  className="bg-background/60 border-border/50 text-xs rounded-xl"
                                />
                              </div>
                              <Button type="submit" size="sm" className="w-full gap-2 rounded-xl font-bold mt-2">
                                <Plus className="w-4 h-4" /> Create Admin Account
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Admin credentials & Reset options */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Credentials Card */}
                        <div className="gradient-border bg-card rounded-3xl p-6 space-y-4">
                          <h3 className="font-bold text-foreground text-base">Control Panel Credentials</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">Update administrative password gate settings (Stored securely in local environment).</p>

                          <form onSubmit={handleUpdateCreds} className="space-y-3 text-xs">
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1 block">New Username</label>
                              <Input
                                placeholder={`Current: ${adminUsername}`}
                                value={tempUsername}
                                onChange={(e) => setTempUsername(e.target.value)}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/80 mb-1 block">New Password</label>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                className="bg-background/60 border-border/50 text-xs rounded-xl"
                              />
                            </div>
                            <Button type="submit" size="sm" variant="outline" className="rounded-xl border-border/50 text-xs bg-background/50">
                              Update Authentication Keys
                            </Button>
                          </form>
                        </div>

                        {/* Reset Card */}
                        <div className="gradient-border bg-card rounded-3xl p-6 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="font-bold text-foreground text-base">Reset CMS Baseline</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Revert all custom services, stats bar metrics, testimonials, and values layout definitions back to the baseline launchpad defaults.
                            </p>
                          </div>

                          <div className="pt-6">
                            <Button
                              onClick={async () => {
                                await resetToDefaults();
                                window.location.reload();
                              }}
                              variant="outline"
                              size="sm"
                              className="w-full gap-2 text-xs text-destructive border-destructive/20 hover:border-destructive/40 bg-destructive/5 hover:bg-destructive/10 rounded-xl"
                            >
                              <RefreshCw className="w-4 h-4" /> Reset Layout Data Defaults
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "invoices" && (
                    <motion.div
                      key="invoices"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <InvoiceSystem />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
