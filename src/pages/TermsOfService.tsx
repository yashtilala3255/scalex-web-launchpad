import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using the ScaleXWeb Solution website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services. These terms apply to all visitors, users, and clients.",
  },
  {
    title: "Permitted Use & Prohibited Conduct",
    content: "You are granted a non-exclusive, non-transferable, revocable license to access our website for informational and project inquiry purposes. You agree not to use our services or website for any unlawful activities, including transmitting malware, scraping content, attempting unauthorized server access, submitting false/fraudulent inquiry data, or violating the intellectual property rights of others.",
  },
  {
    title: "Right to Modify Terms",
    content: "We reserve the right to update, modify, or replace these Terms of Service at any time. Any revisions will be indicated by an updated 'Last updated' timestamp. Your continued use of the website or our services following any changes constitutes your binding acceptance of the modified Terms of Service.",
  },
  {
    title: "User-Generated Content & Submission Ownership",
    content: "When you submit project inquiries, ideas, mockups, or attachments through our contact forms, you grant ScaleXWeb Solution a non-exclusive, worldwide, royalty-free license to use, store, and process this information to evaluate your request and prepare quotes. You warrant that you own or have the necessary intellectual property rights for all content you submit and that it does not infringe on third-party rights.",
  },
  {
    title: "Services",
    content: "ScaleXWeb Solution provides digital services including website development, mobile application development, SaaS platform development, e-commerce solutions, and UI/UX design. The specific scope, timeline, and deliverables for each project are defined in individual project agreements signed between ScaleXWeb Solution and the client.",
  },
  {
    title: "Intellectual Property",
    content: "Upon full payment of all invoices, clients receive full ownership of all custom-developed code, designs, and digital assets created specifically for their project. ScaleXWeb Solution retains the right to use general methodologies, frameworks, and proprietary tools developed independently. We may display completed projects in our portfolio unless explicitly agreed otherwise.",
  },
  {
    title: "Payment Terms",
    content: "Payment schedules are defined in individual project agreements. Typically, projects require a deposit before work begins, with milestone-based payments throughout the project. Final delivery is contingent on full payment. Late payments may result in project delays. All prices are in INR or USD as specified in the project agreement.",
  },
  {
    title: "Project Changes & Revisions",
    content: "Changes to project scope after work has begun may result in additional costs and timeline adjustments. We follow a formal change request process for all scope modifications. Revision rounds are defined in each project agreement. Additional revisions beyond the agreed number will be billed at our standard hourly rate.",
  },
  {
    title: "Confidentiality",
    content: "We treat all client information, business data, and project details as strictly confidential. We do not share client information with third parties without express written consent. Clients may request a Non-Disclosure Agreement (NDA) before project commencement.",
  },
  {
    title: "Limitation of Liability",
    content: "ScaleXWeb Solution's liability for any claims arising from our services is limited to the amount paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, special, or consequential damages. We do not warrant that our services will meet all specific business requirements or be error-free.",
  },
  {
    title: "Termination & Suspension",
    content: "Either party may terminate an active project with 14 days written notice. Additionally, we reserve the right to suspend or terminate your access to our website, CMS dashboard, or project portals immediately and without notice if we detect a breach of these Terms of Service, fraudulent activity, or abusive behavior.",
  },
  {
    title: "Governing Law & Dispute Resolution",
    content: "These Terms of Service are governed by the laws of Gujarat, India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Ahmedabad, Gujarat, India.",
  },
  {
    title: "Contact Us",
    content: "For questions about these Terms of Service, please contact us at scalexwebsolution@gmail.com or write to us at ScaleXWeb Solution, Ahmedabad, Gujarat, India.",
  },
];

const TermsOfService = () => (
  <Layout>
    <SEO title="Terms of Service | ScaleXWeb Solution" description="ScaleXWeb Solution's terms of service — governing the use of our website and digital agency services." path="/terms-of-service" />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms-of-service" }]}
      headline="Terms of Service"
      subheadline="Last updated: May 2025"
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
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default TermsOfService;
