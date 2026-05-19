import ServicePageTemplate from "@/components/sections/ServicePageTemplate";

const UiUxDesign = () => (
  <ServicePageTemplate
    breadcrumbName="UI/UX Design"
    path="/services/ui-ux-design"
    seoTitle="UI/UX Design Services for Web & Mobile | ScaleXWeb"
    seoDescription="Research-driven UI/UX design by ScaleXWeb — wireframes, prototypes, and design systems that turn user insight into measurable business results."
    serviceName="UI/UX Design"
    headline="UI/UX Design That Converts & Delights"
    subheadline="Human-centered design backed by research, data, and creative excellence."
    ctaText="Get a Design Consultation"
    sections={[
      {
        title: "Our Design Philosophy",
        description: "Great design is invisible — it guides users effortlessly toward their goals. We believe in research-driven, human-centered design that balances aesthetics with functionality. Every decision is backed by data and user insights.",
      },
      {
        title: "Design Services We Offer",
        description: "From initial research to final design systems, we cover every aspect of the design process to ensure your product looks great and works even better.",
        bullets: ["UX Research & User Interviews", "Wireframing & Information Architecture", "UI Design & Visual Design", "Design Systems & Component Libraries", "Interactive Prototyping", "Usability Testing & Accessibility Audits"],
      },
      {
        title: "Accessibility & Inclusive Design",
        description: "We design for everyone. Our products meet WCAG 2.1 AA standards, ensuring your digital product is accessible to users with disabilities. Inclusive design isn't just ethical — it expands your market reach.",
      },
    ]}
    processSteps={[
      { title: "Research & Discovery", desc: "User interviews, competitive analysis, and stakeholder workshops." },
      { title: "Information Architecture", desc: "Sitemap, user flows, and content strategy." },
      { title: "Wireframing", desc: "Low-fidelity wireframes to validate structure and layout." },
      { title: "Visual Design", desc: "High-fidelity designs with your brand identity." },
      { title: "Prototyping", desc: "Interactive prototypes for stakeholder review and user testing." },
      { title: "Design Handoff", desc: "Developer-ready specs, design tokens, and component documentation." },
    ]}
    techStack={{
      Design: ["Figma", "Adobe XD", "Framer"],
      Prototyping: ["Figma Prototyping", "InVision", "Maze"],
      Research: ["Hotjar", "UserTesting", "Google Analytics"],
      "Design Systems": ["Storybook", "Figma Tokens", "Style Dictionary"],
    }}
    ctaHeadline="Ready to Elevate Your Product's Design?"
    ctaSubheadline="Let's create a design that your users will love and your business will benefit from."
  />
);

export default UiUxDesign;
