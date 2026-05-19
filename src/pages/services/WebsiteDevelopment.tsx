import ServicePageTemplate from "@/components/sections/ServicePageTemplate";

const WebsiteDevelopment = () => (
  <ServicePageTemplate
    breadcrumbName="Website Development"
    path="/services/website-development"
    seoTitle="Website Development Services in Ahmedabad | ScaleXWeb"
    seoDescription="Custom website design and development by ScaleXWeb — corporate sites, landing pages, e-commerce, and portals built for speed, SEO, and conversion."
    serviceName="Website Development"
    headline="Website Design and Development Services in Ahmedabad"
    subheadline="From stunning landing pages to complex enterprise portals — we craft websites that perform, convert, and scale."
    ctaText="Get a Free Website Quote"
    sections={[
      {
        title: "Professional Website Design for Businesses",
        description: "A great business website is mobile-first, fast-loading, SEO-optimized, and conversion-focused. We build every site with these principles at its core, ensuring your online presence works as hard as you do.",
        bullets: ["Corporate Websites", "Portfolio & Personal Sites", "Landing Pages", "Blog & Content Platforms", "Membership & Community Sites"],
      },
      {
        title: "Web Development Services That Scale",
        description: "Every website we build is engineered for speed, security, and scalability. We use modern tech stacks and custom development approaches — never cookie-cutter templates. Our architecture focuses on Core Web Vitals and performance benchmarks.",
        bullets: ["Custom development vs template approach", "Performance-first architecture", "Core Web Vitals optimization", "Scalable infrastructure design"],
      },
      {
        title: "E-Commerce Website Development",
        description: "Full e-commerce capabilities including product catalogs, payment gateways, inventory management, order management, and customer accounts. We work with Shopify, WooCommerce, Magento, or build fully custom solutions.",
        bullets: ["Shopify & WooCommerce", "Custom E-Commerce Platforms", "Payment Gateway Integration", "Inventory & Order Management"],
      },
      {
        title: "Portal Development & ERP Solutions",
        description: "Custom portals for HR, vendors, clients, and admin dashboards. ERP integration with SAP, Zoho, or custom solutions. We build employee self-service portals, B2B vendor management, and data analytics dashboards.",
      },
      {
        title: "SEO, Digital Marketing & Growth Support",
        description: "We don't just build — we help you grow. Post-launch growth services include on-page SEO, technical SEO, Google Analytics setup, CRO (Conversion Rate Optimization), and content strategy guidance.",
      },
    ]}
    processSteps={[
      { title: "Discovery & Requirements", desc: "Deep-dive sessions to understand your business, audience, and goals." },
      { title: "Strategy & Planning", desc: "Sitemap, content strategy, tech stack selection, and project scoping." },
      { title: "UI/UX Design", desc: "Wireframes, mockups, and interactive prototypes for your approval." },
      { title: "Development", desc: "Pixel-perfect front-end and robust back-end development in agile sprints." },
      { title: "Testing & QA", desc: "Cross-browser, cross-device testing and performance optimization." },
      { title: "Launch & Support", desc: "Deployment, monitoring, and ongoing maintenance support." },
    ]}
    techStack={{
      Frontend: ["React.js", "Next.js", "Vue.js", "Tailwind CSS", "TypeScript"],
      Backend: ["Node.js", "Express.js", "Laravel", "Python / Django"],
      CMS: ["WordPress", "Webflow", "Shopify", "WooCommerce"],
      Database: ["PostgreSQL", "MySQL", "MongoDB"],
      DevOps: ["AWS", "Vercel", "Docker", "CI/CD"],
    }}
    ctaHeadline="Ready to Build a Website That Works as Hard as You Do?"
    ctaSubheadline="Let's talk about your project. Free consultation, no commitment."
  />
);

export default WebsiteDevelopment;
