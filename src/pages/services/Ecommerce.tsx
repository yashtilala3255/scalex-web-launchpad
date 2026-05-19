import ServicePageTemplate from "@/components/sections/ServicePageTemplate";

const Ecommerce = () => (
  <ServicePageTemplate
    breadcrumbName="E-Commerce"
    path="/services/ecommerce"
    seoTitle="E-Commerce Website Development Services | ScaleXWeb"
    seoDescription="High-converting Shopify, WooCommerce, and custom e-commerce stores built by ScaleXWeb — optimized for SEO, UX, and revenue growth."
    serviceName="E-Commerce Development"
    headline="End-to-End E-Commerce Solutions"
    subheadline="We build high-converting online stores that grow your revenue — from catalog to checkout to repeat purchase."
    ctaText="Build My Store"
    sections={[
      {
        title: "Platform Expertise",
        description: "Whether you need a quick Shopify store or a fully custom e-commerce platform, we have the expertise to deliver. We work with the best platforms and can build custom solutions tailored to your specific requirements.",
        bullets: ["Shopify & Shopify Plus", "WooCommerce & WordPress", "Magento / Adobe Commerce", "Custom E-Commerce Platforms"],
      },
      {
        title: "E-Commerce Features That Drive Sales",
        description: "We build stores with every feature you need to maximize conversions — from intuitive product catalogs and seamless checkout to inventory management, customer accounts, and advanced analytics.",
        bullets: ["Payment gateway integration (Stripe, Razorpay, PayPal)", "Inventory & order management", "Customer accounts & wishlists", "Mobile shopping optimization", "Marketing automation & email"],
      },
      {
        title: "Performance & SEO for E-Commerce",
        description: "Speed and discoverability are critical for e-commerce success. We optimize every store for Core Web Vitals, implement structured data for rich snippets, and build SEO-friendly product pages that rank.",
      },
    ]}
    processSteps={[
      { title: "Discovery & Strategy", desc: "Understand your products, audience, and competitive landscape." },
      { title: "Platform Selection", desc: "Choose the right e-commerce platform for your needs and budget." },
      { title: "Design & UX", desc: "Create a shopping experience that converts browsers into buyers." },
      { title: "Development", desc: "Build your store with all required integrations and features." },
      { title: "Testing & Optimization", desc: "Cross-device testing, checkout flow optimization, and speed tuning." },
      { title: "Launch & Growth", desc: "Go live, set up analytics, and implement growth strategies." },
    ]}
    techStack={{
      Platforms: ["Shopify", "WooCommerce", "Magento", "Custom"],
      Frontend: ["React.js", "Next.js", "Tailwind CSS"],
      Backend: ["Node.js", "Laravel", "Python"],
      Payments: ["Stripe", "Razorpay", "PayPal"],
      Analytics: ["Google Analytics 4", "Hotjar", "Mixpanel"],
    }}
    ctaHeadline="Ready to Build Your Online Store?"
    ctaSubheadline="Let's create an e-commerce experience that drives revenue and delights customers."
  />
);

export default Ecommerce;
