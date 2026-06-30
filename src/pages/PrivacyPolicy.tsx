import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
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

const PrivacyPolicy = () => (
  <Layout>
    <SEO title="Privacy Policy | ScaleXWeb Solution" description="ScaleXWeb Solution's privacy policy — how we collect, use, and protect your personal information." path="/privacy-policy" />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]}
      headline="Privacy Policy"
      subheadline="Last updated: June 2026"
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
