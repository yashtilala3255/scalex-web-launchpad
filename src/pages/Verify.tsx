import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Award, Calendar, Hash, Mail, ArrowRight, Search, AlertCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobService } from "@/lib/jobService";
import { Certificate } from "@/types/jobPortal";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 25 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export const Verify = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError(null);
      let data = await jobService.getCertificatesByEmail(email.trim());

      // Seed a local mock if searching test@gmail.com
      if (email.trim().toLowerCase() === "test@gmail.com") {
        const mockCert: Certificate = {
          id: "test-cert-id",
          candidate_name: "Yash Patel",
          program_name: "Full-Stack Web Development Internship",
          certificate_type: "internship_completion",
          issue_date: new Date().toISOString().split('T')[0],
          certificate_id: "SCALEX-TEST-2026",
          recipient_email: "test@gmail.com",
          description: "Completed 3 months of unpaid internship program with outstanding performance."
        };

        try {
          const stored = localStorage.getItem("scalex_certificates");
          const localCerts = stored ? JSON.parse(stored) : [];
          if (!localCerts.some((c: any) => c.id === "test-cert-id")) {
            localCerts.push(mockCert);
            localStorage.setItem("scalex_certificates", JSON.stringify(localCerts));
          }
        } catch (e) {
          console.error("Failed to seed localStorage:", e);
        }

        if (data.length === 0) {
          data = [mockCert];
        }
      }

      setCerts(data);
      setSearched(true);
    } catch (err: any) {
      console.error("Error searching certificates:", err);
      setError("An error occurred while fetching certificates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "project_completion":
        return "Project Completion";
      case "internship_completion":
        return "Internship Completion";
      case "internship_participation":
        return "Internship Participation";
      default:
        return "Certificate of Excellence";
    }
  };

  return (
    <Layout>
      <SEO 
        title="Verify Certificate | ScaleXWeb Solution" 
        description="Verify ScaleXWeb program or internship completion certificates online by entering your registered email ID." 
        path="/verify" 
      />
      <PageHero
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Verify", path: "/verify" }]}
        headline="Certificate Verification"
        subheadline="Verify and retrieve your official ScaleXWeb program & internship certificates."
        badge="Credentials"
      />

      <section className="section-padding bg-background">
        <div className="container-tight max-w-4xl mx-auto space-y-10">
          
          {/* SEARCH FORM PANEL */}
          <motion.div 
            {...fadeUp}
            className="gradient-border bg-card rounded-3xl p-6 md:p-10 shadow-lg text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-black text-foreground">Verify Your Credentials</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter your registered email address below. We'll scan our secure credentials ledger to retrieve all certificates issued to you.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="e.g. yash@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 text-xs h-11 rounded-xl w-full focus:ring-primary focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white rounded-xl h-11 px-6 text-xs gap-1.5 font-bold shrink-0 shadow-md glow-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Retrieve Certificates
                  </>
                )}
              </Button>
            </form>
            <div className="text-[10px] text-muted-foreground pt-1.5">
              For testing, you can try:{" "}
              <button
                type="button"
                onClick={() => setEmail("test@gmail.com")}
                className="text-primary hover:underline font-semibold"
              >
                test@gmail.com
              </button>
            </div>
          </motion.div>

          {/* RESULTS AREA */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center text-xs text-muted-foreground"
              >
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Searching certificates ledger...
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto border border-rose-500/20 bg-rose-500/5 rounded-2xl p-5 text-center flex flex-col items-center gap-3"
              >
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <span className="text-xs font-semibold text-rose-500">{error}</span>
              </motion.div>
            )}

            {searched && !loading && !error && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <h3 className="text-sm font-bold text-foreground">
                    Search Results ({certs.length} certificates found)
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono bg-secondary/20 px-2.5 py-1 rounded-full border border-border/30">
                    Query: {email}
                  </span>
                </div>

                {certs.length === 0 ? (
                  <div className="border border-dashed border-border bg-card/20 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                    <Award className="w-10 h-10 text-muted-foreground/50 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-sm">No Records Located</h4>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        We couldn't find any issued certificates associated with <strong className="text-foreground">{email}</strong>. 
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Please double-check your spelling, try another email, or email us at <a href="mailto:info@scalexweb.tech" className="text-primary hover:underline font-semibold">info@scalexweb.tech</a> for support.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {certs.map((cert) => (
                      <div 
                        key={cert.id}
                        className="gradient-border bg-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-primary/20"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
                              <Award className="w-6 h-6" />
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                              {getTypeName(cert.certificate_type)}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-left">
                            <h4 className="text-base font-bold text-foreground">{cert.candidate_name}</h4>
                            <p className="text-muted-foreground text-[11px] font-semibold">{cert.program_name}</p>
                            
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/10">
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono uppercase font-bold tracking-wider">
                                  <Calendar className="w-3 h-3 text-muted-foreground/60" /> Issue Date
                                </span>
                                <span className="font-semibold text-foreground text-[11px]">
                                  {new Date(cert.issue_date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[9px] text-muted-foreground flex items-center gap-1 font-mono uppercase font-bold tracking-wider">
                                  <Hash className="w-3 h-3 text-muted-foreground/60" /> ID Number
                                </span>
                                <span className="font-mono font-bold text-foreground text-[11px] select-all">
                                  {cert.certificate_id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-border/20">
                          <Link to={`/verify-certificate/${cert.id}`}>
                            <Button 
                              variant="outline"
                              className="w-full text-xs h-10 rounded-xl gap-1.5 border-border hover:bg-primary hover:border-primary hover:text-white font-bold transition-all duration-300"
                            >
                              View Official Certificate <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </Layout>
  );
};

export default Verify;
