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
    title: "Termination",
    content: "Either party may terminate a project with 14 days written notice. Upon termination, the client is responsible for payment of all work completed to date. Deliverables completed and paid for will be provided to the client upon termination.",
  },
  {
    title: "Governing Law",
    content: "These Terms of Service are governed by the laws of Gujarat, India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Ahmedabad, Gujarat.",
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
        <motion.div {...fadeUp} className="gradient-border bg-card rounded-2xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service carefully before using ScaleXWeb Solution's website or engaging our services. These terms constitute a legally binding agreement between you and ScaleXWeb Solution.
          </p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.05 }} className="gradient-border bg-card rounded-2xl p-7">
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
