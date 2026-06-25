import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
  {
    title: "Information We Collect (Data Inventory)",
    content: "We collect information that you directly provide to us when filling out our contact, lead, or newsletter forms. This data inventory includes: name, email address, phone number, company name, and project description text. Additionally, we collect device identifiers, IP addresses, browser types, and behavioral usage statistics when you navigate our site.",
  },
  {
    title: "How We Use Your Information (Purpose)",
    content: "The collected data is used exclusively to evaluate project scopes, respond to user inquiries, provide custom development quotes, personalize user experiences, perform site analytics, and verify form authenticity. We do not use your personal information for automated profiling or behavioral ad-targeting.",
  },
  {
    title: "Third-Party Service Disclosures",
    content: "To support our development operations and deliver high-performance experiences, we share data with compliant third-party subprocessors. This includes: Formspree (for secure contact form processing), Supabase (for secure cloud database storage, inquiry logs, and analytics persistence), ipapi.co (for IP-based visitor geolocation lookup to personalize local service views), Google Fonts (for rendering typography, which processes temporary asset delivery requests), Vercel (for high-speed global web hosting and secure infrastructure delivery logs), Google Analytics (for tracking general traffic and anonymous user statistics), and Stripe / Razorpay (for optional billing & transaction processing compliance). All subprocessors are bound by confidentiality terms and vetted for compliance with privacy regulations like GDPR and CCPA.",
  },
  {
    title: "Data Retention & Deletion",
    content: "We retain lead inquiries and associated personal data only for as long as necessary to service your project requests, typically up to 12 months for standard inquiries, or for the duration of an active development agreement. Once this period expires or upon a verified user deletion request, data is permanently erased from our production databases.",
  },
  {
    title: "User Rights & Data Portability",
    content: "Under GDPR, CCPA, and similar data regulations, you hold the right to access, edit, restrict, or delete any personal information we store. You may also request a portable copy of your data or withdraw your consent at any time. To exercise any of these user rights, contact our data compliance officer at scalexwebsolution@gmail.com.",
  },
  {
    title: "Children's Privacy (COPPA & GDPR)",
    content: "Our website and agency services are not intended for or directed to minors under the age of 13 (or 16 in the EU). We do not knowingly collect personal data from children. If we discover that a minor has submitted personal information without parental consent, we will delete it immediately from our servers.",
  },
  {
    title: "Cookies & Consent Management",
    content: "We use essential cookies to maintain site security and session state. We also use performance/analytics cookies to track site traffic. You can adjust your cookie preferences directly in your browser. Users can disable non-essential tracking cookies without affecting access to our website.",
  },
  {
    title: "Data Security Measures",
    content: "We apply rigorous technical security controls. All data in transit is encrypted using industry-standard TLS/HTTPS protocols. Data stored at rest in our databases is encrypted, and access is restricted using strict role-based access control (RBAC). In the event of a data breach, we maintain a response plan to notify affected users within 72 hours.",
  },
  {
    title: "Changes to This Policy",
    content: "We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated 'Last updated' date. Continued use of our website represents your acceptance of the updated terms.",
  },
  {
    title: "Contact Us",
    content: "If you have questions regarding our data practices, cookie policy, or user rights, please contact us at scalexwebsolution@gmail.com or write to us at ScaleXWeb Solution, Ahmedabad, Gujarat, India.",
  },
];

const PrivacyPolicy = () => (
  <Layout>
    <SEO title="Privacy Policy | ScaleXWeb Solution" description="ScaleXWeb Solution's privacy policy — how we collect, use, and protect your personal information." path="/privacy-policy" />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]}
      headline="Privacy Policy"
      subheadline="Last updated: May 2025"
      badge="Legal"
    />
    <section className="section-padding bg-background">
      <div className="container-tight max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="border border-border bg-card rounded-xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            ScaleXWeb Solution ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.06 }} className="border border-border bg-card rounded-xl p-7 hover:border-primary/20 transition-all duration-300">
              <h2 className="text-xl font-heading font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
