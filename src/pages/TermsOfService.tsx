import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
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

const TermsOfService = () => (
  <Layout>
    <SEO title="Terms of Service | ScaleXWeb Solution" description="ScaleXWeb Solution's terms of service — governing the use of our website and digital agency services." path="/terms-of-service" />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms-of-service" }]}
      headline="Terms of Service"
      subheadline="Last updated: June 2026"
      badge="Legal"
    />
    <section className="section-padding bg-background">
      <div className="container-tight max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="border border-border bg-card rounded-xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using ScaleXWeb Solution's website or engaging our services. These terms constitute a legally binding agreement between you and ScaleXWeb Solution.
          </p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border bg-card rounded-xl p-7 hover:border-primary/20 transition-all duration-300">
              <h2 className="text-xl font-heading font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default TermsOfService;
