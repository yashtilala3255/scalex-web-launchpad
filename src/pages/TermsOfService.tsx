import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const generalSections = [
  {
    title: "Definitions",
    content: "• \"Agreement\" refers to these Terms of Use/Service and any legal updates or schedules attached.\n• \"Service\" refers to the ScaleXWeb web/mobile/SaaS platforms, careers portal, application forms, and CMS dashboards.\n• \"User\" (also \"you\" or \"your\") refers to any visitor, client, or job seeker accessing our Service.\n• \"We,\" \"us,\" or \"our\" refers to ScaleXWeb Solution, registered under the Ministry of MSME, India.",
  },
  {
    title: "1. ACCOUNTS",
    content: "To access certain features of our Careers Portal or CMS Dashboards, you must register a candidate or admin account. You represent that all registration credentials you provide are truthful, accurate, and current. You are entirely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized credentials access.",
  },
  {
    title: "2. ACCESS RIGHTS AND PRIVILEGES",
    content: "ScaleXWeb grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Service strictly for personal, job search, client portfolio audits, or recruiter administrative purposes. Any commercial utilization of our site assets, content duplication, or unauthorized crawling is strictly prohibited. Access privileges may be suspended or revoked at our sole discretion.",
  },
  {
    title: "3. INFORMATION SECURITY",
    content: "We implement security measures, including HTTPS encryption and database level role-based access control, to protect candidate credentials and client logs. However, you acknowledge that no digital transmission over the internet or storage system can be guaranteed 100% secure. You agree to cooperate in implementing secure account passwords and immediately report any discovered security vulnerabilities.",
  },
  {
    title: "4. USER CODE OF CONDUCT",
    content: "You agree not to engage in prohibited conduct, including: (a) uploading files containing viruses, Trojan horses, or malicious scripts; (b) scraping database content, bypassing API security walls, or flooding the Service; (c) submitting falsified job applications, plagiarizing resumes, or claiming unearned professional certifications; and (d) posting abusive, offensive, or harassing content.",
  },
  {
    title: "5. DISCLAIMERS",
    content: "The Service and all content are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including merchantability or fitness for a particular purpose. We do not guarantee that the Service will be uninterrupted, error-free, or secure. Any reliance on the materials or job openings is at your own risk.",
  },
  {
    title: "6. BINDING AGREEMENT",
    content: "These Terms constitute a legally binding agreement between you and ScaleXWeb. By accessing the Service, you signify your irrevocable acceptance of these Terms. If you are accepting on behalf of an enterprise, you represent that you hold full authorization to bind that entity to this Agreement.",
  },
  {
    title: "7. UPDATING THESE TERMS",
    content: "We reserve the sole right to revise and update these Terms at any time. When updates are published, the \"Last updated\" date will be revised. Continued utilization of our Service following publication of revised Terms represents your binding acceptance of the updated terms. If you do not agree to the new terms, you must terminate your account.",
  },
  {
    title: "8. COMMUNICATION",
    content: "By creating an account, you consent to receive electronic communications from us, including recruitment updates, job alerts, dashboard newsletters, and security notices. You may opt-out of optional notifications by adjusting your dashboard settings or clicking the unsubscribe link in our emails.",
  },
];

const internshipSections = [
  {
    title: "1. Introduction & Acceptance",
    content: "These Terms of Service (\"Terms\") govern your participation in the ScaleXWeb Solution Unpaid Internship Program. By submitting an application or joining the internship, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not apply or participate in the internship program.",
  },
  {
    title: "2. Nature of the Internship",
    content: "2.1 Unpaid Program:\nThis internship is entirely unpaid. No salary, stipend, allowance, or monetary compensation of any kind will be provided by ScaleXWeb Solution during or after the internship. By applying, you explicitly acknowledge and accept that:\n• You will not receive any financial compensation\n• This internship is for learning, experience, and portfolio-building purposes only\n• You are not an employee of ScaleXWeb Solution\n• No employment contract or job offer is implied by participation in this program\n\n2.2 Duration:\nThe standard internship duration is 3 to 6 months, as agreed upon during onboarding. The exact start and end dates will be confirmed via email.\n\n2.3 Mode:\nThe internship may be conducted remotely (work from home) or on-site at our Ahmedabad, Gujarat office, as mutually agreed. Remote interns are expected to have their own devices, internet connection, and required software.",
  },
  {
    title: "3. Roles & Responsibilities",
    content: "As an intern, you agree to:\n• Dedicate reasonable time and effort to assigned tasks and projects as discussed during onboarding\n• Attend check-in meetings, reviews, and calls as scheduled\n• Submit work on time and communicate proactively about delays or blockers\n• Maintain professional conduct in all communications with the ScaleXWeb team\n• Keep any confidential company information, client details, or internal project data strictly private\n• Use only approved tools and platforms for work\n• Not share, publish, or post any work-in-progress content from ScaleXWeb projects without prior written approval",
  },
  {
    title: "4. Intellectual Property",
    content: "4.1 Ownership of Work:\nAll designs, creatives, mockups, code, content, or any other work produced by you during the internship using ScaleXWeb resources, briefs, or direction are the sole intellectual property of ScaleXWeb Solution.\n\n4.2 Portfolio Usage:\nYou may include completed and published internship work in your personal portfolio, Behance, Dribbble, or similar platforms only after the work has been publicly released by ScaleXWeb Solution, and only with proper credit (\"Created during internship at ScaleXWeb Solution\").\n\n4.3 Confidential Work:\nWork that has not been publicly released by ScaleXWeb may not be shared publicly without written approval.",
  },
  {
    title: "5. Certificate of Completion",
    content: "5.1 Eligibility:\nUpon successfully completing the internship, you will receive an official Certificate of Internship Completion from ScaleXWeb Solution, provided that:\n• You have completed the agreed internship duration\n• All assigned tasks and projects have been satisfactorily delivered\n• You have maintained professional conduct throughout\n• You have not violated any terms outlined in this agreement\n\n5.2 Certificate of Participation:\nAn Internship Participation Certificate may be issued to interns who joined the program but did not complete the full duration, at the sole discretion of ScaleXWeb Solution.\n\n5.3 Verification:\nAll certificates include a unique certificate number and QR code linking to www.scalexweb.tech/verify, allowing employers or institutions to verify authenticity at any time.\n\n5.4 Revocation:\nScaleXWeb Solution reserves the right to revoke a certificate if the intern provided false information, violated confidentiality obligations, or engaged in misconduct.",
  },
  {
    title: "6. Termination",
    content: "6.1 By the Intern:\nYou may exit the internship at any time by providing at least 7 days' written notice via email to info@scalexweb.tech. Early exit without notice may affect your eligibility for a certificate or reference.\n\n6.2 By ScaleXWeb Solution:\nScaleXWeb Solution reserves the right to terminate an internship at any time if:\n• The intern violates these Terms\n• The intern engages in unprofessional, dishonest, or disrespectful conduct\n• The intern fails to perform assigned tasks without reasonable cause\n• Business circumstances require it\n\nIn case of termination by ScaleXWeb without cause, a Participation Certificate will be issued for the time completed.",
  },
  {
    title: "7. Confidentiality",
    content: "During and after the internship, you agree not to disclose or misuse any confidential information belonging to ScaleXWeb Solution, including but not limited to:\n• Client names, project details, or business strategies\n• Internal designs, source files, or unreleased products\n• Internal processes, pricing, or team information\n• Any information explicitly marked as confidential\n\nThis confidentiality obligation continues for 1 year after the end of the internship.",
  },
  {
    title: "8. No Employment Guarantee",
    content: "Participation in this internship does not guarantee any offer of employment, paid internship, or freelance contract from ScaleXWeb Solution. Any future engagement will be at the sole discretion of ScaleXWeb Solution and communicated separately and formally.",
  },
  {
    title: "9. Limitation of Liability",
    content: "ScaleXWeb Solution shall not be liable for any direct, indirect, or incidental damages arising from your participation in the internship, including but not limited to loss of data, time, opportunity, or income.",
  },
  {
    title: "10. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.",
  },
  {
    title: "11. Amendments",
    content: "ScaleXWeb Solution reserves the right to update or modify these Terms at any time. Changes will be communicated via email or posted at www.scalexweb.tech/terms-of-service. Continued participation after changes are posted constitutes acceptance of the updated Terms.",
  },
  {
    title: "12. Contact",
    content: "ScaleXWeb Solution\n📧 info@scalexweb.tech\n🌐 www.scalexweb.tech\n📍 Ahmedabad, Gujarat, India",
  },
];

const TermsOfService = () => {
  const [activeTab, setActiveTab] = useState<"general" | "internship">("general");

  return (
    <Layout>
      <SEO 
        title="Terms of Service | ScaleXWeb Solution" 
        description="ScaleXWeb Solution's terms of service — governing the use of our website and digital agency services." 
        path="/terms-of-service" 
      />
      <PageHero
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms-of-service" }]}
        headline="Terms of Service"
        subheadline={activeTab === "general" ? "Last updated: June 2026" : "Effective Date: July 09, 2026"}
        badge="Legal"
      />
      <section className="section-padding bg-background">
        <div className="container-tight max-w-3xl mx-auto">
          {/* Tab Selector */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-300 ${
                activeTab === "general"
                  ? "bg-primary text-white border-primary shadow-md glow-sm"
                  : "bg-card/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/75"
              }`}
            >
              General Terms of Service
            </button>
            <button
              onClick={() => setActiveTab("internship")}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-300 ${
                activeTab === "internship"
                  ? "bg-primary text-white border-primary shadow-md glow-sm"
                  : "bg-card/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/75"
              }`}
            >
              Internship Terms of Service
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "general" ? (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border border-border bg-card rounded-xl p-8 mb-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Please read these Terms of Service carefully before using ScaleXWeb Solution's website or engaging our services. These terms constitute a legally binding agreement between you and ScaleXWeb Solution.
                  </p>
                </div>
                {generalSections.map((section, i) => (
                  <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.04 }} className="border border-border bg-card rounded-xl p-7 hover:border-primary/20 transition-all duration-300">
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-3">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="internship"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border border-border bg-card rounded-xl p-8 mb-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Please read these Terms of Service carefully before participating in ScaleXWeb Solution's Unpaid Internship Program. These terms constitute a legally binding agreement between you and ScaleXWeb Solution.
                  </p>
                </div>
                {internshipSections.map((section, i) => (
                  <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.04 }} className="border border-border bg-card rounded-xl p-7 hover:border-primary/20 transition-all duration-300">
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-3">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;
