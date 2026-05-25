import React from "react";
import SEO from "@/components/SEO";
import { Wrench, Mail, Phone, Lock } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const MaintenancePage = () => {
  const { settings } = useSiteData();

  const displaySiteName = settings?.siteName || "ScaleXWeb";
  const contactEmail = settings?.contactEmail || "info@scalexweb.com";
  const contactPhone = settings?.contactPhone || "+91 98765 43210";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <SEO title={`Maintenance Mode | ${displaySiteName}`} description="We are currently performing scheduled maintenance." />
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
      <div className="absolute inset-0 mesh-bg opacity-80" />
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="orb w-[500px] h-[500px] bg-primary/15 -top-40 -left-40 animate-pulse-glow" />
      <div className="orb w-[300px] h-[300px] bg-accent/12 bottom-0 right-0 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-lg p-8 md:p-12 gradient-border bg-card rounded-3xl glow-sm relative z-10 mx-4 text-center">
        {/* Animated Wrench Icon */}
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 glow-primary relative">
          <Wrench className="w-7 h-7 text-white animate-bounce" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-0 rounded-2xl bg-white/10 animate-ping opacity-30" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground mb-4">
          Under Scheduled <br />
          <span className="gradient-text">Maintenance</span>
        </h1>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          We are currently upgrading our systems to provide you with a faster, more secure digital experience. We will be back online shortly.
        </p>
       
        {/* Contact Info */}
        <div className="space-y-4 pt-6 border-t border-border/40 text-xs">
          <p className="text-foreground/70 font-semibold mb-2">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a 
              href={`mailto:${contactEmail}`} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-all text-muted-foreground hover:text-foreground"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>{contactEmail}</span>
            </a>
            <a 
              href={`tel:${contactPhone}`} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 transition-all text-muted-foreground hover:text-foreground"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>{contactPhone}</span>
            </a>
          </div>
        </div>

        {/* Dynamic Logo brand watermark */}
        <p className="text-[10px] text-muted-foreground/40 mt-10">
          © {new Date().getFullYear()} {displaySiteName}. All rights reserved.
        </p>

        
      </div>
    </div>
  );
};

export default MaintenancePage;
