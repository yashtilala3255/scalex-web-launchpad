import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Lock, Search, Download, ArrowLeft, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CURRENT_POLICY_VERSION } from "@/constants/policies";
import { trackEvent } from "@/lib/analytics";

interface ProfileCompliance {
  id: string;
  full_name: string;
  email: string;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  privacy_accepted: boolean;
  privacy_accepted_at: string | null;
  cookie_accepted: boolean;
  cookie_accepted_at: string | null;
  policy_version: string | null;
}

const AdminCompliance = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("scalex_admin_auth") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [profiles, setProfiles] = useState<ProfileCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showOutdatedOnly, setShowOutdatedOnly] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadComplianceData();
    trackEvent("admin_compliance_viewed");
  }, [isAuthenticated]);

  const loadComplianceData = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, terms_accepted, terms_accepted_at, privacy_accepted, privacy_accepted_at, cookie_accepted, cookie_accepted_at, policy_version")
        .order("terms_accepted_at", { ascending: false, nullsFirst: false });

      if (error) {
        throw error;
      }
      setProfiles(data || []);
    } catch (err) {
      console.error("Error loading compliance data:", err);
      toast.error("Failed to load compliance database");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "recruiter@scalex.web" && passwordInput === "ScaleXCareerRecruit2026") {
      sessionStorage.setItem("scalex_admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Welcome back to Compliance Panel!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      (p.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(search.toLowerCase());

    const isOutdated = p.policy_version !== CURRENT_POLICY_VERSION;
    
    if (showOutdatedOnly) {
      return matchesSearch && isOutdated;
    }
    return matchesSearch;
  });

  const handleExportCSV = () => {
    if (filteredProfiles.length === 0) {
      toast.error("No records to export");
      return;
    }

    trackEvent("admin_compliance_exported", {
      record_count: filteredProfiles.length
    });

    const headers = [
      "Full Name",
      "Email",
      "Terms Accepted",
      "Terms Accepted At",
      "Privacy Accepted",
      "Privacy Accepted At",
      "Cookie Accepted",
      "Cookie Accepted At",
      "Policy Version"
    ];

    const rows = filteredProfiles.map((p) => [
      p.full_name || "",
      p.email || "",
      p.terms_accepted ? "YES" : "NO",
      p.terms_accepted_at ? new Date(p.terms_accepted_at).toLocaleString("en-IN") : "",
      p.privacy_accepted ? "YES" : "NO",
      p.privacy_accepted_at ? new Date(p.privacy_accepted_at).toLocaleString("en-IN") : "",
      p.cookie_accepted ? "YES" : "NO",
      p.cookie_accepted_at ? new Date(p.cookie_accepted_at).toLocaleString("en-IN") : "",
      p.policy_version || "1.0"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `policy_compliance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Authentication Guard Screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <SEO title="Compliance Access Control | ScaleXWeb" description="Log in to view legal and policy compliance statuses." path="/admin/compliance" />
        <section className="section-padding bg-background min-h-[85vh] flex items-center justify-center relative">
          <div className="absolute inset-0 mesh-bg opacity-10" />
          <div className="absolute inset-0 dot-grid opacity-30" />
          
          <div className="max-w-md w-full relative z-10 px-4">
            <div className="border border-border bg-card rounded-3xl p-8 md:p-10 shadow-lg text-center space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground">Compliance Database Access</h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Please authenticate with your administrative credentials to audit user policy acceptances and download GDPR reports.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs text-left">
                <div>
                  <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Email / Username</label>
                  <Input
                    type="email"
                    required
                    placeholder="recruiter@scalex.web"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/80 mb-1.5 block">Password</label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bg-background/60 border-border/50 text-xs h-10 rounded-xl"
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl mt-4">
                  Authenticate Audit Session
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Policy Consent & Compliance Audit | ScaleXWeb" description="Review GDPR policy acceptances and download CSV reports." path="/admin/compliance" />
      <section className="section-padding bg-background min-h-screen relative z-10 pt-28">
        <div className="container-tight">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Recruiter Dashboard
              </Link>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-primary" /> Policy Compliance Registry
              </h1>
              <p className="text-xs text-muted-foreground">
                Audit system users for terms, privacy, and cookie consent in compliance with WCAG/GDPR guidelines.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} className="bg-primary hover:bg-primary/95 text-white rounded-xl h-10 text-xs gap-1.5 font-bold">
                <Download className="w-4 h-4" /> Export CSV (GDPR Report)
              </Button>
            </div>
          </div>

          <div className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
            {/* Search and Filters Header */}
            <div className="p-4 border-b border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-secondary/10">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search user name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 text-xs h-9 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={() => setShowOutdatedOnly(!showOutdatedOnly)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    showOutdatedOnly
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      : "border-border bg-background hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Outdated Policy Versions Only
                </button>
                <span className="text-[10px] font-mono text-muted-foreground uppercase bg-secondary/30 px-2.5 py-1 rounded-lg">
                  {filteredProfiles.length} audited
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary mx-auto mb-3" />
                Auditing user accounts...
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="p-12 text-center">
                <ShieldCheck className="w-8 h-8 text-muted-foreground/60 mx-auto mb-3" />
                <h4 className="font-bold text-foreground text-sm">No Audits Found</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                  No registered profiles match the filtered compliance criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-secondary/20 border-b border-border/40 text-muted-foreground font-mono font-bold text-[10px] uppercase tracking-wider">
                      <th className="p-4 pl-6">Audited Candidate</th>
                      <th className="p-4 text-center">Terms Consent</th>
                      <th className="p-4 text-center">Privacy Consent</th>
                      <th className="p-4 text-center">Cookie Consent</th>
                      <th className="p-4 pr-6 text-center">Policy Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredProfiles.map((p) => {
                      const hasCurrentVersion = p.policy_version === CURRENT_POLICY_VERSION;
                      return (
                        <tr key={p.id} className="hover:bg-secondary/5 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="space-y-1">
                              <span className="font-bold text-foreground block">{p.full_name || "Anonymous Candidate"}</span>
                              <span className="text-[10px] text-muted-foreground block font-mono">{p.email || "-"}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              {p.terms_accepted ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> Accepted
                                </Badge>
                              ) : (
                                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <XCircle className="w-3 h-3" /> Missing
                                </Badge>
                              )}
                              {p.terms_accepted_at && (
                                <span className="text-[9px] text-muted-foreground font-medium">{formatDate(p.terms_accepted_at)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              {p.privacy_accepted ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> Accepted
                                </Badge>
                              ) : (
                                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <XCircle className="w-3 h-3" /> Missing
                                </Badge>
                              )}
                              {p.privacy_accepted_at && (
                                <span className="text-[9px] text-muted-foreground font-medium">{formatDate(p.privacy_accepted_at)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex flex-col items-center gap-0.5">
                              {p.cookie_accepted ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" /> Accepted
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20 rounded-full px-2 gap-1 py-0.5 text-[9px] font-bold">
                                  <XCircle className="w-3 h-3 opacity-60" /> Essential Only
                                </Badge>
                              )}
                              {p.cookie_accepted_at && (
                                <span className="text-[9px] text-muted-foreground font-medium">{formatDate(p.cookie_accepted_at)}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-center">
                            <div className="inline-flex items-center gap-1.5 justify-center">
                              <span className="font-mono font-bold text-xs text-foreground">
                                {p.policy_version || "1.0"}
                              </span>
                              {!hasCurrentVersion && (
                                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold uppercase tracking-wider text-[8px] rounded px-1.5 py-0.5">
                                  Outdated
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
};

export default AdminCompliance;
