import {
  Globe, Smartphone, Cloud, ShoppingCart, Palette, Heart, GraduationCap, Building2,
  ShoppingBag, Landmark, Truck, Factory, Plane, Scale, Rocket, Clock, MessageSquare,
  Layers, HeartHandshake, Target, Search, Lightbulb, PenTool, Code, TestTube, Send,
  Shield, Award,
} from "lucide-react";

export const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Industries Served" },
  { value: "98%", label: "Client Satisfaction" },
];

export const services = [
  {
    icon: Globe,
    name: "Website Development",
    desc: "Custom, high-performance websites built for results.",
    bullets: ["Responsive Design", "SEO Optimized", "Fast Loading"],
    path: "/services/website-development",
  },
  {
    icon: Smartphone,
    name: "App Development",
    desc: "Native and cross-platform mobile & web applications.",
    bullets: ["iOS & Android", "React Native", "Progressive Web Apps"],
    path: "/services/app-development",
  },
  {
    icon: Cloud,
    name: "SaaS Development",
    desc: "End-to-end SaaS platform architecture and development.",
    bullets: ["Multi-Tenancy", "Scalable APIs", "Subscription Billing"],
    path: "/services/saas-development",
  },
  {
    icon: ShoppingCart,
    name: "E-Commerce Solutions",
    desc: "High-converting online stores that grow your revenue.",
    bullets: ["Shopify & Custom", "Payment Integration", "Inventory Management"],
    path: "/services/ecommerce",
  },
  {
    icon: Palette,
    name: "UI/UX Design",
    desc: "Human-centered design backed by research and data.",
    bullets: ["User Research", "Wireframing", "Design Systems"],
    path: "/services/ui-ux-design",
  },
];

export const industries = [
  { icon: Heart, name: "Healthcare" },
  { icon: GraduationCap, name: "Education & EdTech" },
  { icon: Building2, name: "Real Estate" },
  { icon: ShoppingBag, name: "Retail & E-Commerce" },
  { icon: Landmark, name: "Finance & FinTech" },
  { icon: Truck, name: "Logistics" },
  { icon: Factory, name: "Manufacturing" },
  { icon: Plane, name: "Hospitality & Travel" },
  { icon: Scale, name: "Legal Services" },
  { icon: Rocket, name: "SaaS Startups" },
];

export const trustPoints = [
  { icon: Clock, title: "On-Time Delivery", desc: "We respect deadlines as much as you do." },
  { icon: MessageSquare, title: "Transparent Communication", desc: "Weekly updates, no surprises, full visibility." },
  { icon: Layers, title: "Scalable Architecture", desc: "Built to grow with your business, not against it." },
  { icon: HeartHandshake, title: "Post-Launch Support", desc: "We don't disappear after go-live." },
  { icon: Target, title: "Agile Methodology", desc: "Iterative sprints that adapt to your evolving needs." },
  { icon: Rocket, title: "ROI-Focused", desc: "Every decision driven by business impact, not vanity metrics." },
];

export const processSteps = [
  { icon: Search, step: "01", title: "Discovery & Analysis", desc: "Deep-dive sessions to understand your goals and business context." },
  { icon: Lightbulb, step: "02", title: "Strategy & Planning", desc: "Roadmap, tech stack selection, and detailed project scoping." },
  { icon: PenTool, step: "03", title: "UI/UX Design", desc: "Wireframes, design system, and clickable prototypes." },
  { icon: Code, step: "04", title: "Development", desc: "Agile sprints, clean code, scalable architecture." },
  { icon: TestTube, step: "05", title: "Testing & QA", desc: "Thorough functional, performance, and security testing." },
  { icon: Send, step: "06", title: "Launch & Support", desc: "Deployment, monitoring, and ongoing growth support." },
];

export const testimonials = [
  {
    quote: "ScaleXWeb transformed our outdated website into a modern, lead-generating machine. The results exceeded our expectations.",
    name: "Rajesh Patel",
    role: "CEO",
    company: "TechVentures India",
    initials: "RP",
  },
  {
    quote: "Their team delivered our SaaS platform on time and within budget. The attention to detail in both design and code was remarkable.",
    name: "Priya Sharma",
    role: "CTO",
    company: "FinFlow Solutions",
    initials: "PS",
  },
  {
    quote: "Working with ScaleXWeb felt like having an extended team. Their communication and commitment to quality are unmatched.",
    name: "Amit Desai",
    role: "Founder",
    company: "EduLeap",
    initials: "AD",
  },
];

export const techStack: Record<string, string[]> = {
  Frontend: ["React.js", "Next.js", "Vue.js", "Tailwind CSS", "TypeScript"],
  Backend: ["Node.js", "Express.js", "Laravel", "Python / Django", "GraphQL"],
  Mobile: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
  "Cloud & DevOps": ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD"],
  Design: ["Figma", "Adobe XD", "Framer"],
};

export const values = [
  { icon: Shield, title: "Integrity", desc: "Honest communication, ethical practices, and zero compromise on quality." },
  { icon: Lightbulb, title: "Innovation", desc: "We explore emerging tech and creative approaches to solve real problems." },
  { icon: Heart, title: "Client-First", desc: "Your success is our success. We measure our wins by your outcomes." },
  { icon: Award, title: "Excellence", desc: "Every pixel, every line of code, every interaction crafted with care." },
];

export const techMarqueeItems = [
  "React.js", "Next.js", "TypeScript", "Node.js", "Flutter", "React Native",
  "AWS", "Google Cloud", "Docker", "PostgreSQL", "MongoDB", "Figma",
  "Vue.js", "GraphQL", "Kubernetes", "Firebase", "Laravel", "Python / Django",
];
