import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly to us when you fill out our contact form, including your name, email address, phone number, company name, and project description. We may also collect technical information such as your IP address, browser type, and pages visited when you use our website.",
  },
  {
    title: "How We Use Your Information",
    content: "We use the information we collect to respond to your inquiries, provide our services, send project updates and communications relevant to your project, improve our website and services, and comply with legal obligations. We do not sell, rent, or share your personal information with third parties for their marketing purposes.",
  },
  {
    title: "Data Security",
    content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Third-Party Services",
    content: "Our website uses third-party services including Google Fonts (typography), Formspree (contact form processing), and Google Analytics (website analytics). These services may collect information about your use of our website in accordance with their own privacy policies.",
  },
  {
    title: "Cookies",
    content: "We use essential cookies to ensure our website functions correctly. We may also use analytics cookies to understand how visitors interact with our website. You can control cookie settings through your browser settings. Disabling certain cookies may affect the functionality of our website.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal information that we hold. You may also request that we restrict the processing of your data or object to its processing. To exercise these rights, please contact us at scalexwebsolution@gmail.com.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated date. We encourage you to review this Privacy Policy periodically.",
  },
  {
    title: "Contact Us",
    content: "If you have any questions about this Privacy Policy or our data practices, please contact us at scalexwebsolution@gmail.com or write to us at ScaleXWeb Solution, Ahmedabad, Gujarat, India.",
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
        <motion.div {...fadeUp} className="gradient-border bg-card rounded-2xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            ScaleXWeb Solution ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.06 }} className="gradient-border bg-card rounded-2xl p-7">
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
