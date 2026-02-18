import ServicePageTemplate from "@/components/sections/ServicePageTemplate";

const SaasDevelopment = () => (
  <ServicePageTemplate
    breadcrumbName="SaaS Development"
    path="/services/saas-development"
    headline="Custom SaaS Platform Development"
    subheadline="From MVP to enterprise-scale SaaS — we architect, build, and launch platforms that scale."
    ctaText="Start Your SaaS Project"
    sections={[
      {
        title: "SaaS Architecture Overview",
        description: "We build SaaS platforms using proven architectural patterns — multi-tenancy, microservices, and API-first design. Our platforms are built for scale from day one with secure, cost-efficient infrastructure.",
        bullets: ["Multi-tenant data isolation", "Microservices architecture", "API-first design (REST/GraphQL)", "Cloud-native deployment"],
      },
      {
        title: "SaaS Features We Build",
        description: "From user authentication and subscription billing to role management, analytics dashboards, and third-party integrations — we build the complete feature set your SaaS product needs to succeed.",
        bullets: ["Authentication & SSO (OAuth, MFA)", "Subscription billing (Stripe, Razorpay)", "Role-based access control", "Admin dashboards & analytics", "API integrations & webhooks", "White-labeling & custom branding"],
      },
      {
        title: "Pricing Model Consultation",
        description: "We don't just build the platform — we help you design the right pricing strategy. Whether it's freemium, tiered, usage-based, or enterprise pricing, we architect the billing infrastructure to support your model.",
      },
    ]}
    processSteps={[
      { title: "Discovery & Validation", desc: "Validate your SaaS concept and define the MVP scope." },
      { title: "Architecture Design", desc: "System architecture, data modeling, and infrastructure planning." },
      { title: "UI/UX Design", desc: "Dashboard design, user flows, and design system creation." },
      { title: "MVP Development", desc: "Build core features in agile sprints with continuous feedback." },
      { title: "Testing & Security", desc: "Security audits, performance testing, and compliance checks." },
      { title: "Launch & Scale", desc: "Production deployment, monitoring, and scaling strategy." },
    ]}
    techStack={{
      Frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"],
      Backend: ["Node.js", "Express", "Django", "FastAPI"],
      Database: ["PostgreSQL", "MongoDB", "Redis"],
      "Auth & Billing": ["OAuth 2.0", "Stripe", "Razorpay"],
      "Cloud & DevOps": ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD"],
      Monitoring: ["Sentry", "DataDog", "Grafana"],
    }}
    ctaHeadline="Ready to Build Your SaaS Platform?"
    ctaSubheadline="From MVP to enterprise scale — let's build your SaaS together."
  />
);

export default SaasDevelopment;
