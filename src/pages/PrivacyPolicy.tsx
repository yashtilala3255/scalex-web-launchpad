import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const generalSections = [
  {
    title: "Non-Personal Information",
    content: "We collect non-personal information that does not identify you individually, such as your browser type, device metadata, operating system version, page loading speeds, referring website URLs, exit pages, and clickstream data. This information is used for diagnostic analytics, performance tracking, and optimization of our carrier/dashboard services.",
  },
  {
    title: "COOKIES",
    content: "We use cookies and similar tracking technologies (such as local storage tokens and device identifiers) to improve your experience on our website, remember your settings, and secure account sessions. You can choose to accept, reject, or manage cookie preferences through our consent banner. Please refer to our Cookie Policy for more details.",
  },
  {
    title: "USE OF THE INFORMATION:",
    content: "We use your personal information to process job applications, verify candidate identity, manage recruiter alerts, respond to project inquiries, compile analytics, and deliver high-performance development services. We ensure your information is processed lawfully, fairly, and transparently.",
  },
  {
    title: "THIRD-PARTY SERVICES",
    content: "To support our operations and deliver high-performance experiences, we share data with compliant third-party subprocessors. This includes: Formspree (for secure contact form processing), Supabase (for secure cloud database storage, applicant profile hosting, private resume file storage, inquiry logs, and analytics persistence), Google Analytics (for tracking general traffic and anonymous user statistics), and Stripe / Razorpay (for secure payment processing). All subprocessors are vetted for compliance with privacy regulations like GDPR.",
  },
  {
    title: "DISCLOSURE OF INFORMATION",
    content: "We do not sell or trade your personal information. We may disclose your information if required by law, to enforce our site policies, protect our rights, or in connection with a corporate sale, merger, or restructuring, provided the receiving party agrees to uphold similar privacy standards.",
  },
  {
    title: "YOUR CHOICES ABOUT YOUR INFORMATION",
    content: "You have control over your data. You may request access to, correction of, or deletion of your personal data by contacting our compliance officer. You can also opt-out of marketing communications by clicking unsubscribe or updating your preferences in your candidate dashboard.",
  },
  {
    title: "EXCLUSION",
    content: "This Privacy Policy does not apply to any information you submit in public forums, third-party sites linked from our platform, or unsolicited communications. Any information shared in public remains public and is outside our data safety protections.",
  },
  {
    title: "SEVERABILITY",
    content: "If any provision of this Privacy Policy is found by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall remain fully intact and in force.",
  },
  {
    title: "GOVERNING LAW AND DISPUTE RESOLUTION",
    content: "This Privacy Policy and any disputes arising from it shall be governed by the laws of India. Any legal proceedings or arbitration arising from or in connection with this policy shall be resolved exclusively within the courts of Ahmedabad, Gujarat, India.",
  },
  {
    title: "FOREIGN JURISDICTION",
    content: "ScaleXWeb is headquartered in Ahmedabad, India. If you access our services from outside India, you consent to the transfer, storage, and processing of your information in India, where data protection standards may differ from your home country.",
  },
  {
    title: "CHANGES TO THE PRIVACY POLICY",
    content: "We reserve the right to update this Privacy Policy at any time. When updates are published, we will notify users through our site banner or revise the 'Last updated' date. Continued use represents acceptance of changes.",
  },
  {
    title: "CONTACT",
    content: "For inquiries regarding your privacy rights, data storage, or to request record deletion, please contact us at scalexwebsolution@gmail.com or write to us at ScaleXWeb Solution, Ahmedabad, Gujarat, India.",
  },
  {
    title: "APPLICABLE LAW AND JURISDICTION",
    content: "All matters relating to your access to, or use of, the careers portal and services are governed by the laws of India. The courts of Ahmedabad, Gujarat, India shall have exclusive jurisdiction over any claims.",
  },
];

const internshipSections = [
  {
    title: "1. Introduction",
    content: "ScaleXWeb Solution (\"we\", \"our\", \"us\") is committed to protecting the personal information of all internship applicants and interns. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your personal information when you apply for or participate in our Unpaid Internship Program. By submitting an internship application or joining our program, you agree to the terms of this Privacy Policy.",
  },
  {
    title: "2. Information We Collect",
    content: "From Application:\n• Full name, email address, phone number\n• City, state, and country of residence\n• Educational qualification, institution name, and year of study\n• Resume / CV and portfolio links (Behance, Dribbble, GitHub, etc.)\n• Cover letter or personal statement\n• Social media handles (if provided)\n\nDuring Internship:\n• Work submitted during the internship (designs, files, creatives)\n• Attendance and task completion records\n• Performance notes and feedback\n• Communication records (emails, messages)\n\nAutomatically:\n• IP address and browser/device information (when accessing our portal or verification system)",
  },
  {
    title: "3. How We Use Your Information",
    content: "• To review and process your internship application\n• To communicate with you regarding your application status, onboarding, tasks, and internship progress\n• To issue your official Certificate of Internship Completion or Participation at the end of the program\n• To maintain internal records of interns and their contributions\n• To provide LinkedIn recommendations upon request\n• To improve our internship program based on feedback\n• To verify your identity for certificate issuance and QR verification at www.scalexweb.tech/verify\n\nWe do not use your information for advertising, marketing to third parties, or any commercial purpose unrelated to your internship.",
  },
  {
    title: "4. Data Sharing & Disclosure",
    content: "We do not sell, rent, or trade your personal information to any third party. We may share your data only in the following limited cases:\n\n• Service providers: Tools we use internally (e.g., Supabase for database, email services for communication) — only to the extent necessary to operate the program\n• Legal requirements: If required by law, court order, or government authority\n• Your consent: If you explicitly ask us to share your information (e.g., for a reference or recommendation)",
  },
  {
    title: "5. Data Storage & Security",
    content: "Your personal data is stored securely using Supabase with encrypted connections and role-based access control. Only authorized ScaleXWeb team members can access intern records.\n\nWe retain your data for up to 2 years after the internship ends for certificate verification and reference purposes. After this period, your data will be deleted unless you request otherwise.",
  },
  {
    title: "6. Certificate Verification",
    content: "Upon completion of the internship, your name, certificate number, role, and duration will be stored in our public verification system at www.scalexweb.tech/verify.\n\nThis information is intentionally publicly accessible so that employers, institutions, or anyone can verify the authenticity of your certificate by scanning the QR code. By accepting the certificate, you consent to this limited public display of your name and internship details.",
  },
  {
    title: "7. Your Rights",
    content: "• Access: Request a copy of the data we hold about you\n• Correction: Request correction of inaccurate information\n• Deletion: Request deletion of your data (subject to certificate verification requirements)\n• Withdrawal: Withdraw your application or exit the internship program at any time\n• Objection: Object to any specific use of your data\n\nTo exercise any of these rights, email us at: info@scalexweb.tech",
  },
  {
    title: "8. Cookies",
    content: "Our website (www.scalexweb.tech) uses cookies as described in our Cookie Policy. The internship application portal may use session cookies to maintain your login state. No tracking or advertising cookies are used in connection with the internship program.",
  },
  {
    title: "9. Children's Privacy",
    content: "Our internship program is open only to individuals who are 18 years of age or older. We do not knowingly collect personal information from anyone under 18. If we discover that an applicant is under 18, their application will be withdrawn and their data deleted.",
  },
  {
    title: "10. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. Any changes will be posted on www.scalexweb.tech/privacy-policy with the updated effective date. Continued participation in the internship program after changes are posted constitutes your acceptance of the updated policy.",
  },
  {
    title: "11. Contact Us",
    content: "ScaleXWeb Solution\n📧 info@scalexweb.tech\n🌐 www.scalexweb.tech\n📍 Ahmedabad, Gujarat, India",
  },
];

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState<"general" | "internship">("general");

  return (
    <Layout>
      <SEO 
        title="Privacy Policy | ScaleXWeb Solution" 
        description="ScaleXWeb Solution's privacy policy — how we collect, use, and protect your personal information." 
        path="/privacy-policy" 
      />
      <PageHero
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]}
        headline="Privacy Policy"
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
              General Website Policy
            </button>
            <button
              onClick={() => setActiveTab("internship")}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-300 ${
                activeTab === "internship"
                  ? "bg-primary text-white border-primary shadow-md glow-sm"
                  : "bg-card/40 border-border/30 text-muted-foreground hover:text-foreground hover:bg-card/75"
              }`}
            >
              Internship Program Policy
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
                    ScaleXWeb Solution ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
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
                    ScaleXWeb Solution ("we," "our," or "us") is committed to protecting the personal information of all internship applicants and interns. This Privacy Policy explains what data we collect, how we use it, and your rights when you participate in our Unpaid Internship Program.
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

export default PrivacyPolicy;
