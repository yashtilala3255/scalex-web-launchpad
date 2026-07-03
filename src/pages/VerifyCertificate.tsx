import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Award, Calendar, Hash, FileText, ArrowLeft, Printer, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jobService } from "@/lib/jobService";
import { Certificate } from "@/types/jobPortal";
import logoImage from "@/assets/logo.png";

export const VerifyCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await jobService.getCertificateById(id);
        if (data) {
          setCert(data);
        } else {
          setError("Certificate not found or has been revoked.");
        }
      } catch (err: any) {
        console.error("Error fetching certificate:", err);
        setError("Unable to verify certificate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [id]);

  const getTypeName = (type: string) => {
    switch (type) {
      case "project_completion":
        return "Project Completion Certificate";
      case "internship_completion":
        return "Internship Completion Certificate";
      case "internship_participation":
        return "Internship Participation Certificate";
      default:
        return "Certificate of Excellence";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy text-foreground flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Verifying Certificate Authenticity...</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-navy text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-red-500/20 bg-card rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto">
            <ShieldCheck className="w-8 h-8 opacity-60" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black">Verification Failed</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">{error || "This certificate could not be verified."}</p>
          </div>
          <Link to="/jobs">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-xs">
              Go to Careers Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const certTypeName = getTypeName(cert.certificate_type);
  const verifyUrl = `${window.location.origin}/verify-certificate/${cert.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const renderCertificateContent = () => {
    switch (cert.certificate_type) {
      case "internship_participation":
        return (
          <div 
            id="certificate-print-area"
            className="w-full aspect-[1.414/1] bg-white rounded-3xl relative overflow-hidden shadow-2xl border-4 border-slate-100"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#1a1a1a",
              minHeight: "450px"
            }}
          >
            {/* Blue diagonal polygon strips on top-left */}
            <svg className="absolute top-0 left-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M 0,0 L 200,0 L 0,200 Z" fill="#0033aa" />
              <path d="M 0,0 L 150,0 L 0,150 Z" fill="#0055cc" />
              <path d="M 0,0 L 100,0 L 0,100 Z" fill="#0088ff" />
              <line x1="0" y1="120" x2="120" y2="0" stroke="#00d8ff" strokeWidth="2.5" />
              <line x1="0" y1="160" x2="160" y2="0" stroke="#0088ff" strokeWidth="2.5" />
            </svg>

            {/* Blue diagonal polygon strips on bottom-right */}
            <svg className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="none">
              <path d="M 200,200 L 0,200 L 200,0 Z" fill="#0033aa" />
              <path d="M 200,200 L 50,200 L 200,50 Z" fill="#0055cc" />
              <path d="M 200,200 L 100,200 L 200,100 Z" fill="#0088ff" />
              <line x1="200" y1="80" x2="80" y2="200" stroke="#00d8ff" strokeWidth="2.5" />
              <line x1="200" y1="40" x2="40" y2="200" stroke="#0088ff" strokeWidth="2.5" />
            </svg>

            {/* Top-Left gold rosette badge */}
            <div className="absolute top-8 left-12 flex flex-col items-center">
              <svg className="w-14 h-20 drop-shadow-md" viewBox="0 0 100 150">
                <polygon points="35,90 20,140 45,120 45,90" fill="#fbbf24" />
                <polygon points="65,90 80,140 55,120 55,90" fill="#fbbf24" />
                <polygon points="35,90 25,140 48,122 48,90" fill="#d97706" opacity="0.3" />
                <circle cx="50" cy="55" r="35" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
                <circle cx="50" cy="55" r="28" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="50" cy="55" r="24" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="3,3" />
              </svg>
            </div>

            {/* Top-Right Logo and Branding */}
            <div className="absolute top-8 right-12 flex flex-col items-center gap-1">
              <img src={logoImage} alt="ScaleXWeb Logo" className="h-9 w-auto filter brightness-95" />
              <span className="text-[8px] font-black tracking-widest text-slate-800 uppercase font-sans">Scalexweb</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest font-sans">Solution</span>
            </div>

            {/* Center Content Body */}
            <div className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-12 flex flex-col items-center text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-widest uppercase leading-none">
                Certificate
              </h1>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wider uppercase mt-1">
                Of Internship Participation
              </h2>
              
              <p className="text-[10px] sm:text-xs italic text-slate-500 mt-6">presented to :</p>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif leading-none mt-2 pb-1" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {cert.candidate_name}
              </h3>
              <div className="w-7/12 h-[3px] bg-blue-600 mx-auto rounded-full mt-1.5" />

              <p className="text-[10px] sm:text-xs text-slate-650 mt-5">for the participation at</p>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1">
                {cert.program_name}
              </h4>
              {cert.description ? (
                <p 
                  className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed max-w-md mx-auto pt-1.5"
                  dangerouslySetInnerHTML={{ __html: cert.description.replace(/\n/g, "<br/>") }}
                />
              ) : (
                <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed max-w-md mx-auto pt-1.5">
                  for successfully dedicating and actively participating in the virtual professional experience program. 
                  Demonstrated collaborative skills, focus, and diligence during training.
                </p>
              )}
            </div>

            {/* Bottom Left QR Verification */}
            <div className="absolute bottom-8 left-12 flex flex-col items-center gap-1.5">
              <img src={qrCodeUrl} alt="Verify QR Code" className="w-12 h-12 bg-white" />
              <span className="text-[8px] font-black text-blue-700 tracking-wider font-sans uppercase">Scan To Verify</span>
            </div>

            {/* Bottom Center Signature */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
              <div className="font-serif italic text-blue-650 text-xl tracking-widest font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                yashpatel
              </div>
              <div className="w-32 h-px bg-slate-350 mx-auto mt-1" />
              <span className="text-[9px] font-bold text-slate-900 block mt-1">Yash Patel</span>
              <span className="text-[7px] font-semibold text-slate-400 block uppercase tracking-widest">Program Director</span>
            </div>
          </div>
        );
      case "internship_completion": {
        const issueDate = new Date(cert.issue_date);
        const months = ["June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May"];
        // To make it look like the reference, if the month is August 2025, let's use the actual month or calculate a 2-month span.
        const monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const endMonth = monthsFull[issueDate.getMonth()];
        const startMonthIndex = (issueDate.getMonth() - 2 + 12) % 12;
        const startMonth = monthsFull[startMonthIndex];
        const issueYear = issueDate.getFullYear();

        return (
          <div 
            id="certificate-print-area"
            className="w-full aspect-[1.414/1] bg-white rounded-3xl relative overflow-hidden shadow-2xl border-4 border-slate-100"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#1a1a1a",
              minHeight: "450px"
            }}
          >
            {/* Elegant outer double border frame lines matching image */}
            <div className="absolute inset-4 border border-[#cbd5e1] pointer-events-none rounded-xl" />
            <div className="absolute inset-[20px] border-[2px] border-slate-700/80 pointer-events-none rounded-lg" />
            <div className="absolute inset-[28px] border border-[#a0aec0] pointer-events-none rounded-md" />

            {/* Parallel Bands - Top Left Corner */}
            <svg className="absolute top-0 left-0 w-28 h-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 35,0 0,35" fill="#1a202c" />
              <polygon points="0,40 0,55 55,0 40,0" fill="#2c7a7b" />
              <polygon points="0,60 0,70 70,0 60,0" fill="#4a5568" />
              <polygon points="0,75 0,85 85,0 75,0" fill="#cbd5e1" />
            </svg>

            {/* Parallel Bands - Top Right Corner */}
            <svg className="absolute top-0 right-0 w-28 h-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 65,0 100,35" fill="#1a202c" />
              <polygon points="100,40 100,55 45,0 60,0" fill="#2c7a7b" />
              <polygon points="100,60 100,70 30,0 40,0" fill="#4a5568" />
              <polygon points="100,75 100,85 15,0 25,0" fill="#cbd5e1" />
            </svg>

            {/* Parallel Bands - Bottom Left Corner */}
            <svg className="absolute bottom-0 left-0 w-28 h-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 35,100 0,65" fill="#1a202c" />
              <polygon points="0,60 0,45 55,100 40,100" fill="#2c7a7b" />
              <polygon points="0,40 0,30 70,100 60,100" fill="#4a5568" />
              <polygon points="0,25 0,15 85,100 75,100" fill="#cbd5e1" />
            </svg>

            {/* Parallel Bands - Bottom Right Corner */}
            <svg className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,100 65,100 100,65" fill="#1a202c" />
              <polygon points="100,60 100,45 45,100 60,100" fill="#2c7a7b" />
              <polygon points="100,40 100,30 30,100 40,100" fill="#4a5568" />
              <polygon points="100,25 100,15 15,100 25,100" fill="#cbd5e1" />
            </svg>

            {/* Top-Left Logo and Branding */}
            <div className="absolute top-10 left-12 flex flex-col items-center gap-1">
              <img src={logoImage} alt="ScaleXWeb Logo" className="h-9 w-auto filter brightness-95" />
              <span className="text-[8px] font-black tracking-widest text-[#1a202c] uppercase font-sans">Scalexweb</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest font-sans">Solution</span>
            </div>

            {/* Center Content Body */}
            <div className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-8 flex flex-col items-center text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2c7a7b] tracking-[0.15em] uppercase leading-none">
                Certificate
              </h1>
              <h2 className="text-xs sm:text-sm font-extrabold text-[#1a202c] tracking-[0.2em] uppercase mt-2">
                Of Internship Completion
              </h2>
              
              <p className="text-[10px] sm:text-xs text-slate-500 mt-8 font-sans">This certificate is proudly presented to</p>
              
              <h3 className="text-3.5xl sm:text-4.5xl font-bold text-[#2c7a7b] font-serif leading-none mt-2 pb-1" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {cert.candidate_name}
              </h3>
              
              {/* Scroll motif ornament */}
              <div className="flex items-center justify-center gap-2 text-[#2c7a7b]/40 py-1.5 w-64 mx-auto">
                <span className="w-12 h-px bg-current opacity-45" />
                <span className="text-xs shrink-0">❦ ⚜ ❦</span>
                <span className="w-12 h-px bg-current opacity-45" />
              </div>

              {cert.description ? (
                <p 
                  className="text-[9.5px] sm:text-[10.5px] text-slate-650 leading-relaxed max-w-md mx-auto mt-4 font-sans"
                  dangerouslySetInnerHTML={{ __html: cert.description.replace(/\n/g, "<br/>") }}
                />
              ) : (
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-650 leading-relaxed max-w-md mx-auto mt-4 font-sans">
                  For successfully completing the <span className="font-extrabold text-slate-900">"{cert.program_name}"</span> held between {startMonth} and {endMonth} {issueYear}. Your commitment to personal growth and excellence has been truly inspiring.
                </p>
              )}
              
              <div className="text-[10px] sm:text-xs text-[#1a202c] font-extrabold mt-5 font-sans">
                Date: {endMonth} {issueDate.getDate()}, {issueYear}
              </div>
            </div>

            {/* Bottom Left Signature */}
            <div className="absolute bottom-10 left-12 flex flex-col items-start text-left pl-2">
              <div className="font-serif italic text-[#2c7a7b] text-base tracking-widest font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                yashpatel
              </div>
              <div className="w-32 h-px bg-slate-350 mt-1" />
              <span className="text-[9px] font-bold text-[#1a202c] block mt-1 font-sans">Yash Patel</span>
              <span className="text-[7.5px] font-semibold text-slate-400 block uppercase tracking-widest font-sans">Program Director</span>
            </div>

            {/* Bottom Right QR Verification */}
            <div className="absolute bottom-10 right-24 flex items-center gap-2.5">
              <img src={qrCodeUrl} alt="Verify QR Code" className="w-12 h-12 bg-white" />
              <div className="text-left leading-tight text-[#2c7a7b]">
                <span className="text-[10px] font-extrabold uppercase block tracking-wider font-sans">Scan</span>
                <span className="text-[10px] font-extrabold uppercase block tracking-wider font-sans">To Verify</span>
              </div>
            </div>
          </div>
        );
      }

      case "project_completion":
      default:
        return (
          <div 
            id="certificate-print-area"
            className="w-full aspect-[1.414/1] bg-white rounded-3xl relative overflow-hidden shadow-2xl border-4 border-slate-100"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#1a1a1a",
              minHeight: "450px"
            }}
          >
            {/* Elegant thin inner border */}
            <div className="absolute inset-4 border border-emerald-600/20 pointer-events-none rounded-xl" />

            {/* Emerald Waves Corner - Top Left */}
            <svg className="absolute top-0 left-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 0,0 Q 50,0 0,50 Z" fill="#047857" opacity="0.15" />
              <path d="M 0,0 Q 75,0 0,75 Z" fill="#10b981" opacity="0.1" />
              <path d="M 0,0 C 40,20 20,40 0,80 Z" fill="#34d399" opacity="0.08" />
            </svg>
            {/* Emerald Waves Corner - Top Right */}
            <svg className="absolute top-0 right-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 100,0 Q 50,0 100,50 Z" fill="#047857" opacity="0.15" />
              <path d="M 100,0 Q 25,0 100,75 Z" fill="#10b981" opacity="0.1" />
            </svg>
            {/* Emerald Waves Corner - Bottom Left */}
            <svg className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 0,100 Q 50,100 0,50 Z" fill="#047857" opacity="0.15" />
              <path d="M 0,100 C 40,80 20,60 0,20 Z" fill="#34d399" opacity="0.08" />
            </svg>
            {/* Emerald Waves Corner - Bottom Right */}
            <svg className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 100,100 Q 50,100 100,50 Z" fill="#047857" opacity="0.15" />
            </svg>

            {/* Top Left Gold rosette seal */}
            <div className="absolute top-8 left-12 flex flex-col items-center">
              <svg className="w-14 h-20 drop-shadow-md" viewBox="0 0 100 150">
                <polygon points="35,90 20,140 45,120 45,90" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <polygon points="65,90 80,140 55,120 55,90" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="50" cy="55" r="35" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
                <circle cx="50" cy="55" r="28" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="50" cy="55" r="24" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="3,3" />
              </svg>
            </div>

            {/* Top-Right Logo and Branding */}
            <div className="absolute top-8 right-12 flex flex-col items-center gap-1">
              <img src={logoImage} alt="ScaleXWeb Logo" className="h-9 w-auto filter brightness-95" />
              <span className="text-[8px] font-black tracking-widest text-slate-800 uppercase font-sans">Scalexweb</span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest font-sans">Solution</span>
            </div>

            {/* Center Content Body */}
            <div className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-12 flex flex-col items-center text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-widest uppercase leading-none">
                Certificate
              </h1>
              <h2 className="text-xs sm:text-sm font-extrabold text-emerald-700 tracking-wider uppercase mt-1">
                Of Project Completion
              </h2>
              
              <p className="text-[10px] sm:text-xs text-slate-550 italic mt-6">This is to certify that</p>
              
              <h3 className="text-2xl sm:text-4xl font-bold text-emerald-850 font-serif leading-none mt-2 pb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {cert.candidate_name}
              </h3>
              
              {/* Horizontal line with circles */}
              <div className="flex items-center justify-center py-1 text-emerald-800 mt-1">
                <svg className="w-48 h-2" viewBox="0 0 200 10">
                  <circle cx="10" cy="5" r="3.5" fill="currentColor" />
                  <line x1="10" y1="5" x2="190" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="190" cy="5" r="3.5" fill="currentColor" />
                </svg>
              </div>

              {cert.description ? (
                <p 
                  className="text-[9.5px] sm:text-xs text-slate-600 leading-relaxed max-w-md mx-auto mt-4"
                  dangerouslySetInnerHTML={{ __html: cert.description.replace(/\n/g, "<br/>") }}
                />
              ) : (
                <p className="text-[9.5px] sm:text-xs text-slate-600 leading-relaxed max-w-md mx-auto mt-4">
                  has successfully completed a professional training program. 
                  Their dedication and commitment to the learning process are truly commendable.
                </p>
              )}
              
              <div className="text-[9.5px] sm:text-xs text-slate-900 font-bold mt-4">
                Awarded on {new Date(cert.issue_date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
            </div>

            {/* Bottom Left Signature */}
            <div className="absolute bottom-8 left-12 flex flex-col items-start text-left">
              <div className="font-serif italic text-emerald-800 text-base tracking-widest font-bold" style={{ fontFamily: "'Great Vibes', cursive" }}>
                yashpatel
              </div>
              <div className="w-32 h-px bg-slate-350 mt-1" />
              <span className="text-[9px] font-bold text-slate-900 block mt-1">Yash Patel</span>
              <span className="text-[7px] font-semibold text-slate-400 block uppercase tracking-widest">Program Director</span>
            </div>

            {/* Bottom Right QR Verification */}
            <div className="absolute bottom-8 right-12 flex flex-col items-center gap-1.5">
              <img src={qrCodeUrl} alt="Verify QR Code" className="w-12 h-12 bg-white" />
              <span className="text-[8px] font-black text-emerald-800 tracking-wider font-sans uppercase">Scan To Verify</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Verification Header Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-4 no-print">
        <div className="container max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-black text-emerald-400">Verified Original Certificate</h2>
              <p className="text-[10px] text-muted-foreground">This certificate has been issued by ScaleXWeb Solutions and is fully authenticated.</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="h-10 border-border text-xs rounded-xl gap-2 font-bold hover:bg-card"
            >
              <Printer className="w-4 h-4" /> Print / Download PDF
            </Button>
            <Link to="/jobs">
              <Button variant="ghost" className="h-10 text-xs gap-1.5 hover:bg-card">
                <ArrowLeft className="w-4 h-4" /> Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container max-w-5xl px-4 pt-10 grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Verification Details (no-print) */}
        <div className="lg:col-span-1 space-y-6 no-print text-left">
          <div className="border border-border bg-card rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold pb-3 border-b border-border/40">Credential Status</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold">CERTIFICATE TYPE</span>
                  <span className="font-bold text-foreground block pt-0.5">{certTypeName}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Hash className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold">CERTIFICATE ID</span>
                  <span className="font-mono font-bold text-foreground block pt-0.5">{cert.certificate_id}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-semibold">DATE OF ISSUANCE</span>
                  <span className="font-bold text-foreground block pt-0.5">
                    {cert.issue_date ? (
                      (() => {
                        const d = new Date(cert.issue_date);
                        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        });
                      })()
                    ) : "N/A"}
                  </span>
                </div>
              </div>

              {cert.recipient_email && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-semibold">RECIPIENT EMAIL</span>
                    <span className="font-semibold text-foreground block pt-0.5 font-mono break-all">{cert.recipient_email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border border-border bg-card rounded-2xl p-6 text-center space-y-4 shadow-sm">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Share Credential</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">Anyone scanning this certificate's QR code can verify its authenticity online.</p>
            <div className="bg-white p-3.5 rounded-xl inline-block shadow-sm">
              <img src={qrCodeUrl} alt="Verification QR Code" className="w-32 h-32" />
            </div>
          </div>
        </div>

        {/* Right Side: Certificate Preview */}
        <div className="lg:col-span-2 flex items-center justify-center">
          {renderCertificateContent()}
        </div>

      </div>

      {/* Global CSS for printing certificates cleanly */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          #certificate-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw !important;
            height: 70.7vw !important; /* Standard 1.414 aspect ratio */
            border: none !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyCertificate;
