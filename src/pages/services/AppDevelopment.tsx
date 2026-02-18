import ServicePageTemplate from "@/components/sections/ServicePageTemplate";

const AppDevelopment = () => (
  <ServicePageTemplate
    breadcrumbName="App Development"
    path="/services/app-development"
    headline="Custom Mobile & Web App Development"
    subheadline="Turn your idea into a powerful, scalable application — built for performance, designed for users."
    ctaText="Discuss Your App Idea"
    sections={[
      {
        title: "Transform Ideas Into Powerful Applications",
        description: "From concept validation to app store launch, we build applications that users love. Our team specializes in Native iOS & Android, Cross-platform (React Native / Flutter), Progressive Web Apps, and Web Applications.",
        bullets: ["Native iOS & Android Development", "Cross-platform with React Native & Flutter", "Progressive Web Apps (PWA)", "Web Applications with React & Next.js"],
      },
      {
        title: "User-Centered Design Process",
        description: "We start with UX research and user journey mapping to ensure your app solves real problems. Our design process includes wireframing, prototyping, and iterative user testing before a single line of code is written.",
      },
      {
        title: "Robust Backend & API Architecture",
        description: "Every app needs a solid backend. We architect scalable APIs, real-time data sync, secure authentication, payment integrations, and cloud infrastructure to support your application at any scale.",
        bullets: ["RESTful & GraphQL APIs", "Real-time data with WebSockets", "OAuth 2.0 & MFA authentication", "Payment integration (Stripe, Razorpay)"],
      },
    ]}
    processSteps={[
      { title: "Idea Validation", desc: "Validate your concept with market research and competitive analysis." },
      { title: "UX Research", desc: "User journey mapping and experience design." },
      { title: "UI Design & Prototyping", desc: "High-fidelity designs and interactive prototypes." },
      { title: "Architecture Planning", desc: "Tech stack selection and system architecture design." },
      { title: "Agile Development", desc: "Iterative sprints with continuous feedback loops." },
      { title: "Testing & QA", desc: "Unit, integration, UAT, and performance testing." },
      { title: "Launch & Support", desc: "App store submission and post-launch support." },
    ]}
    techStack={{
      "Cross-Platform": ["React Native", "Flutter"],
      "Native iOS": ["Swift", "SwiftUI"],
      "Native Android": ["Kotlin", "Jetpack Compose"],
      "Web App": ["React.js", "Next.js", "TypeScript"],
      "Backend / API": ["Node.js", "Express", "Django", "FastAPI", "GraphQL"],
      Database: ["PostgreSQL", "MongoDB", "Firebase", "Supabase"],
    }}
    ctaHeadline="Ready to Build Your App?"
    ctaSubheadline="Get a free app consultation and turn your idea into reality."
  />
);

export default AppDevelopment;
