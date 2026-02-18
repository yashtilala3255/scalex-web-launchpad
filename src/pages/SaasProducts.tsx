import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion } from "framer-motion";
import {
  Shield, Server, Globe, Cloud, Lock, GitBranch,
  UserCheck, CreditCard, Database, Users, BarChart3, Bell,
  Webhook, Flag, Brush, ClipboardList, Headphones, Download,
} from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const architecture = [
  { icon: Database, name: "Multi-Tenancy", desc: "Isolated data per tenant with shared infrastructure for cost efficiency." },
  { icon: Server, name: "Microservices", desc: "Modular, independently deployable services for resilience and scale." },
  { icon: Globe, name: "API-First", desc: "Every feature exposed via REST/GraphQL APIs for maximum integration flexibility." },
  { icon: Cloud, name: "Cloud-Native", desc: "Designed for AWS/GCP/Azure with auto-scaling and 99.9% uptime SLA." },
  { icon: Lock, name: "Security", desc: "SOC2-ready, GDPR-compliant, role-based access control, end-to-end encryption." },
  { icon: GitBranch, name: "DevOps", desc: "Automated CI/CD pipelines, containerization, infrastructure as code." },
];

const features = [
  { icon: UserCheck, name: "Authentication & SSO" },
  { icon: CreditCard, name: "Subscription & Billing" },
  { icon: Database, name: "Multi-Tenant Architecture" },
  { icon: Users, name: "Role-Based Access Control" },
  { icon: BarChart3, name: "Admin Dashboard & Analytics" },
  { icon: Bell, name: "Notifications & Alerts" },
  { icon: Webhook, name: "API Integrations & Webhooks" },
  { icon: Flag, name: "Feature Flags & Metering" },
  { icon: Brush, name: "White-Labeling" },
  { icon: ClipboardList, name: "Audit Logs" },
  { icon: Headphones, name: "Support Module" },
  { icon: Download, name: "Data Export & Reporting" },
];

const SaasProducts = () => (
  <Layout>
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "SaaS Products", path: "/saas-products" }]}
      headline="Modern SaaS Products Built for Scale"
      subheadline="Explore our proprietary SaaS offerings — or let us build your custom platform from the ground up."
      ctaText="Build Custom SaaS"
      ctaLink="/contact"
    />

    {/* Architecture */}
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Architecture</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Modern SaaS Architecture</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Our approach to SaaS development is built on proven patterns that ensure scalability, security, and maintainability.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architecture.map((a, i) => (
            <motion.div key={a.name} {...stagger} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border">
              <a.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-heading font-semibold text-foreground mb-2">{a.name}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section-padding bg-navy">
      <div className="container-tight">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">SaaS Features We Build</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.name} {...stagger} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4 text-center">
              <f.icon className="w-7 h-7 text-accent mx-auto mb-2" />
              <p className="text-sm font-medium text-primary-foreground/80">{f.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <SectionCTA
      headline="Have a SaaS Idea? Let's Build It Together."
      subheadline="From MVP validation to enterprise scale — our team has built it all."
      primaryCTA="Start Your SaaS Journey"
      primaryLink="/contact"
    />
  </Layout>
);

export default SaasProducts;
