import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import {
  ArrowRight, CheckCircle, Code, Database, Globe, Layers,
  Zap, HeartHandshake, Shield, Cpu, Wrench, Lightbulb,
  Server, Layout as LayoutIcon, Puzzle, ChevronDown,
  Star, Rocket, Target, Clock, Users, Send, User, Mail, Phone,
  MessageSquare, TrendingUp, Award, Brain, GitBranch, BarChart3,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────── */

const services = [
  { icon: Lightbulb, title: "Full Stack Consulting", desc: "Strategic technology guidance to align your architecture with business goals — tech stack selection, system design reviews, and scalability audits." },
  { icon: Globe, title: "Custom Web Application Development", desc: "Tailor-made web apps that solve real problems — from portals and dashboards to complex multi-tenant SaaS platforms." },
  { icon: Server, title: "Enterprise Software Development", desc: "Scalable enterprise-grade systems: ERPs, CRMs, workflow automation, and internal tools built for high availability." },
  { icon: Database, title: "Database Design and Management", desc: "Optimized relational and NoSQL database architectures, data modeling, migration, performance tuning, and backup strategies." },
  { icon: Brain, title: "AI/ML Integration", desc: "Embed intelligence into your product — LLM-powered features, recommendation engines, predictive analytics, and intelligent automation." },
  { icon: HeartHandshake, title: "Support and Maintenance Services", desc: "Ongoing monitoring, bug fixing, security patching, and iterative improvement to keep your product performant and up-to-date." },
];

const expertise = [
  {
    id: "frontend",
    label: "Front-end Development",
    icon: LayoutIcon,
    desc: "Pixel-perfect, accessible, and blazing-fast user interfaces that users love.",
    items: [
      { name: "React.js", level: 98 }, { name: "Next.js", level: 95 }, { name: "Vue.js", level: 88 },
      { name: "TypeScript", level: 96 }, { name: "Tailwind CSS", level: 97 }, { name: "Framer Motion", level: 90 },
      { name: "Redux / Zustand", level: 92 }, { name: "GraphQL Client", level: 88 },
    ],
  },
  {
    id: "backend",
    label: "Back-end Development",
    icon: Server,
    desc: "High-performance, secure, and scalable server-side architectures and APIs.",
    items: [
      { name: "Node.js / Express", level: 97 }, { name: "Python / Django", level: 93 },
      { name: "Laravel / PHP", level: 89 }, { name: "GraphQL / REST", level: 95 },
      { name: "Microservices", level: 91 }, { name: "WebSockets", level: 88 },
      { name: "gRPC", level: 82 }, { name: "Serverless (Lambda)", level: 90 },
    ],
  },
  {
    id: "api",
    label: "API Integration & Tools",
    icon: Puzzle,
    desc: "Seamless third-party integrations and DevOps tooling for modern development workflows.",
    items: [
      { name: "AWS / GCP / Azure", level: 94 }, { name: "Docker & Kubernetes", level: 92 },
      { name: "PostgreSQL / MySQL", level: 96 }, { name: "MongoDB / Redis", level: 93 },
      { name: "Stripe / Razorpay", level: 95 }, { name: "Firebase / Supabase", level: 91 },
      { name: "CI/CD (GitHub Actions)", level: 90 }, { name: "Elasticsearch", level: 85 },
    ],
  },
];

const stackCombinations = [
  { name: "MERN Stack", front: "React.js", back: "Node.js + Express", db: "MongoDB", best: "SaaS & Startups", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30" },
  { name: "MEAN Stack", front: "Angular", back: "Node.js + Express", db: "MongoDB", best: "Enterprise Portals", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/30" },
  { name: "Next.js + Django", front: "Next.js", back: "Python / Django", db: "PostgreSQL", best: "AI-Powered Apps", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30" },
  { name: "React + Laravel", front: "React.js", back: "Laravel / PHP", db: "MySQL", best: "E-Commerce & CMS", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
  { name: "Vue + Node.js", front: "Vue.js", back: "Node.js + Fastify", db: "PostgreSQL", best: "Real-Time Apps", color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30" },
  { name: "Next.js + Serverless", front: "Next.js", back: "AWS Lambda + API GW", db: "DynamoDB", best: "High-Scale Platforms", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30" },
];

const pricingPlans = [
  {
    name: "Dedicated Developer",
    tag: "Flexible Hire",
    price: "On Request",
    period: "per developer/month",
    desc: "Augment your existing team with a senior full-stack developer who integrates seamlessly into your workflow.",
    highlights: ["1 Senior Full-Stack Developer", "Your time zone alignment", "Daily standups & reporting", "GitHub + Jira integration", "Code review & documentation", "NDA protected"],
    cta: "Hire a Developer",
    featured: false,
  },
  {
    name: "Dedicated Team",
    tag: "Most Popular",
    price: "On Request",
    period: "per team/month",
    desc: "A full-pod team: tech lead, front-end, back-end, QA engineer, and a project manager dedicated to your product.",
    highlights: ["Tech Lead + 2–4 Developers", "QA Engineer + PM included", "Agile sprint-based delivery", "Weekly demos & reviews", "Full DevOps & CI/CD setup", "Post-launch support"],
    cta: "Build Your Team",
    featured: true,
  },
  {
    name: "Fixed-Price Project",
    tag: "Project Based",
    price: "On Request",
    period: "per project",
    desc: "Well-defined scope, fixed budget, and predictable delivery milestones. Perfect for MVPs and defined products.",
    highlights: ["Defined scope & milestones", "Fixed cost guarantee", "Weekly progress updates", "Staged payment model", "Full IP ownership", "90-day post-launch warranty"],
    cta: "Start a Project",
    featured: false,
  },
];

const processSteps = [
  { step: "01", icon: Target, title: "Requirement Discovery", desc: "Deep-dive sessions to understand your business goals, target users, and technical requirements. We map out architecture and define success metrics." },
  { step: "02", icon: Lightbulb, title: "Architecture & Planning", desc: "Tech stack selection, system design, database schema, API contracts, and project roadmap with milestones and timelines." },
  { step: "03", icon: LayoutIcon, title: "UI/UX Design", desc: "Wireframes, high-fidelity designs, and interactive prototypes reviewed and approved before any code is written." },
  { step: "04", icon: Code, title: "Agile Development", desc: "2-week sprint cycles with deployable increments. Daily standups, transparent Jira boards, and regular demos keep you in control." },
  { step: "05", icon: Shield, title: "Testing & QA", desc: "Automated unit tests, integration tests, E2E testing, security audits, and performance profiling before every release." },
  { step: "06", icon: Rocket, title: "Launch & Scale", desc: "CI/CD-driven deployment to cloud infrastructure, real-time monitoring, and iterative scaling as your user base grows." },
];

const successStories = [
  { industry: "FinTech SaaS", result: "3× Revenue Growth", challenge: "Legacy monolith couldn't handle growing transaction volume and new feature demands from enterprise clients.", solution: "Migrated to microservices architecture with React + Node.js + PostgreSQL. Built real-time dashboards and automated reporting.", outcome: "System now handles 10× the original load with 99.99% uptime. New feature delivery time reduced from 8 weeks to 2 weeks." },
  { industry: "EdTech Platform", result: "100K+ Active Users", challenge: "Needed a scalable platform for live classes, recorded content, quizzes, and student progress tracking.", solution: "Built MERN stack platform with WebSocket-powered live sessions, CDN-served video, and adaptive quiz engine.", outcome: "Scaled from 500 to 100,000+ users in 8 months. Student engagement increased 3× after UX redesign." },
  { industry: "Healthcare Portal", result: "HIPAA Compliant", challenge: "Manual patient intake and scheduling causing bottlenecks. No digital audit trail for compliance.", solution: "Full-stack patient portal with Next.js frontend, Django backend, role-based access, encrypted storage, and audit logging.", outcome: "Reduced patient intake time by 70%. Achieved HIPAA compliance. Zero security incidents since launch." },
];

const techProficiency = [
  { category: "Frontend", color: "text-blue-400 border-blue-500/30 bg-blue-500/10", items: ["React.js", "Next.js", "Vue.js", "Angular", "TypeScript", "Tailwind CSS", "Redux", "Framer Motion"] },
  { category: "Backend", color: "text-green-400 border-green-500/30 bg-green-500/10", items: ["Node.js", "Express.js", "Python", "Django", "FastAPI", "Laravel", "NestJS", "Go"] },
  { category: "Database", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Firebase", "Supabase", "DynamoDB"] },
  { category: "Cloud & DevOps", color: "text-violet-400 border-violet-500/30 bg-violet-500/10", items: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins"] },
  { category: "AI/ML", color: "text-pink-400 border-pink-500/30 bg-pink-500/10", items: ["OpenAI API", "LangChain", "Hugging Face", "Vector DBs", "RAG Pipelines", "TensorFlow", "PyTorch", "scikit-learn"] },
  { category: "Mobile & APIs", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10", items: ["React Native", "Flutter", "REST APIs", "GraphQL", "WebSockets", "gRPC", "Stripe API", "Twilio"] },
];

const whyUs = [
  { icon: Award, title: "50+ Successful Projects", desc: "A proven track record of delivering complex full-stack products across 10+ industries — from lean startups to enterprise clients." },
  { icon: Users, title: "Dedicated Pod Teams", desc: "You get a team that's exclusively focused on your product — no context-switching, no split attention." },
  { icon: Shield, title: "Security-First by Default", desc: "Every line of code is written with OWASP principles in mind. Security isn't bolted on — it's built in from day one." },
  { icon: GitBranch, title: "Modern Engineering Culture", desc: "Clean code, TDD, code reviews, automated CI/CD, and thorough documentation — engineering excellence is non-negotiable." },
  { icon: BarChart3, title: "Business-Outcome Driven", desc: "We measure success by your KPIs, not lines of code. Every technical decision is tied back to your business goals." },
  { icon: Clock, title: "On-Time, Every Time", desc: "Agile sprints with weekly deliverables mean you always know where your project stands — no nasty deadline surprises." },
];

const faqs = [
  { q: "What does 'full stack development' mean?", a: "Full stack development refers to building both the front-end (what users see and interact with) and the back-end (servers, databases, APIs) of a web application. A full-stack developer or team handles the entire product lifecycle from UI to infrastructure." },
  { q: "Which tech stack do you recommend for my project?", a: "Our recommendation depends on your specific needs — scale, team size, budget, and the nature of your product. We commonly build with React/Next.js + Node.js/Django + PostgreSQL for most SaaS products, but we tailor the stack to your use case during our free discovery session." },
  { q: "How long does a typical full-stack project take?", a: "An MVP typically takes 8–16 weeks depending on complexity. Enterprise platforms may take 4–9 months. We provide a detailed timeline after the discovery phase." },
  { q: "Can you work with our in-house team?", a: "Absolutely. We frequently operate as an extended team — augmenting your existing developers with senior specialists, or taking ownership of a specific module or service layer." },
  { q: "Do you provide post-launch support?", a: "Yes. We offer flexible maintenance and support packages — from basic monitoring and bug fixes to continuous development retainers. We don't disappear after go-live." },
  { q: "How do you ensure code quality?", a: "We enforce strict code review processes, automated testing (unit, integration, E2E), linting, type-safety (TypeScript), and thorough documentation. Every pull request is reviewed before merging to main." },
  { q: "Is my project and code ownership protected?", a: "100%. Upon full payment, all code, designs, and IP are transferred to you. We can also sign an NDA before any discovery conversations begin." },
];

/* ─── Framer variants ─────────────────────────────── */
const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };
const stagger = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } });

/* ─── Lead Form Schema ────────────────────────────── */
const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone is required"),
  requirement: z.string().min(15, "Please describe your requirement"),
});
type LeadData = z.infer<typeof leadSchema>;

/* ─── Sub-components ──────────────────────────────── */

const LeadForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadData>({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data: LeadData) => {
    try {
      const res = await fetch("https://formspree.io/f/mykdbezz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, _subject: "Full Stack Dev Inquiry" }) });
      if (res.ok) { toast.success("🚀 Request received! We'll reach out within 24 hours."); reset(); }
      else toast.error("Something went wrong. Please try again.");
    } catch { toast.error("Network error. Please try again."); }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="fullstack-lead-form">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary" />Your Name</label>
          <Input {...register("name")} placeholder="John Doe" className="bg-background/60 border-border/50 rounded-xl h-11" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" />Work Email</label>
          <Input {...register("email")} type="email" placeholder="you@company.com" className="bg-background/60 border-border/50 rounded-xl h-11" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" />Phone Number</label>
        <Input {...register("phone")} type="tel" placeholder="+91 XXXXX XXXXX" className="bg-background/60 border-border/50 rounded-xl h-11" />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5 text-primary" />Describe Your Requirement</label>
        <Textarea {...register("requirement")} placeholder="What are you building? What's your timeline, scale, and biggest technical challenge?" rows={4} className="bg-background/60 border-border/50 rounded-xl resize-none" />
        {errors.requirement && <p className="text-xs text-destructive mt-1">{errors.requirement.message}</p>}
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full gap-2 h-12 text-base" disabled={isSubmitting}>
        <Send className="w-4 h-4" />{isSubmitting ? "Sending..." : "Get Free Consultation"}
      </Button>
    </form>
  );
};

/* ─── Full Stack Simulator Component ──────────────── */
const FullStackSimulator = () => {
  const [activeTab, setActiveTab] = useState("api");
  const [logs, setLogs] = useState<string[]>([
    "System status: ONLINE",
    "API Gateway running on port 8080...",
    "Redis connection established on port 6379",
    "PostgreSQL active pool: 12 connections",
    "Ready for compilation."
  ]);
  const [deploying, setDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  const startDeploy = () => {
    if (deploying) return;
    setDeploying(true);
    setProgress(0);
    setLogs(prev => [...prev, ">> Starting deployment pipeline...", ">> Running npm install...", ">> Compiling React components..."]);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      if (currentProgress === 40) {
        setLogs(prev => [...prev, ">> Bundling assets (webpack/vite)...", ">> Optimizing database queries..."]);
      }
      if (currentProgress === 80) {
        setLogs(prev => [...prev, ">> Uploading bundles to AWS Edge S3...", ">> Invalidation paths cleared on Cloudflare CDN"]);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDeploying(false);
        setLogs(prev => [...prev, ">> Deployment successful! v2.1.4 live.", ">> System ready."]);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl border border-border/40 bg-[#070b13]/90 shadow-2xl overflow-hidden font-mono text-xs text-foreground flex flex-col h-[380px] select-none text-left">
      {/* Console Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1525] border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold">ScaleX-Console v2.1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-primary/80 font-bold uppercase tracking-wider">prod-active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/20 bg-[#0a101d]">
        {[
          { id: "api", label: "API Layer" },
          { id: "db", label: "DB Engine" },
          { id: "infra", label: "Infra Stat" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-r border-border/20 text-[10px] transition-colors ${activeTab === tab.id ? "bg-[#070b13] text-primary font-bold border-b border-b-primary" : "text-muted-foreground hover:bg-card/30"}`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={startDeploy}
          disabled={deploying}
          className="ml-auto px-3.5 bg-primary/10 text-primary border-l border-border/20 hover:bg-primary/20 text-[10px] font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Zap className="w-3 h-3" />
          {deploying ? `Deploying ${progress}%` : "Deploy Code"}
        </button>
      </div>

      {/* Console Output area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-[#05070c]">
        {activeTab === "api" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-2">
              <span className="text-[10px] text-muted-foreground uppercase">API Routes</span>
              <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Fastify</span>
            </div>
            {[
              { path: "GET /api/v1/users/profile", status: 200, time: "18ms" },
              { path: "POST /api/v1/auth/mfa-verify", status: 200, time: "45ms" },
              { path: "PUT /api/v1/billing/checkout", status: 201, time: "120ms" }
            ].map(route => (
              <div key={route.path} className="flex justify-between items-center text-[11px]">
                <span className="text-white/90">{route.path}</span>
                <div className="flex items-center gap-2">
                  <span className="text-success font-bold">{route.status}</span>
                  <span className="text-muted-foreground text-[10px]">{route.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "db" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-2">
              <span className="text-[10px] text-muted-foreground uppercase">Data Systems</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Postgres + Redis</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="p-2.5 rounded-lg border border-border/20 bg-card/40">
                <span className="text-muted-foreground block text-[8px] uppercase font-mono">Postgres Connections</span>
                <span className="text-base text-foreground font-bold font-heading">12 / 100</span>
              </div>
              <div className="p-2.5 rounded-lg border border-border/20 bg-card/40">
                <span className="text-muted-foreground block text-[8px] uppercase font-mono">Cache Hit Rate</span>
                <span className="text-base text-emerald-400 font-bold font-heading">98.4%</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/70 bg-card/20 p-2 rounded border border-border/10">
              <span>Sync Status</span>
              <span className="text-success flex items-center gap-1"><span className="w-1.5 h-1.5 bg-success rounded-full animate-ping" />Synchronized</span>
            </div>
          </div>
        )}

        {activeTab === "infra" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-2">
              <span className="text-[10px] text-muted-foreground uppercase">DevOps Cloud</span>
              <span className="text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded">AWS (us-east-1)</span>
            </div>
            <div className="space-y-2 text-[10px]">
              {[
                { label: "CPU Load", val: "14%", bar: 14, color: "bg-primary" },
                { label: "Memory (RAM)", val: "482MB", bar: 48, color: "bg-accent" },
                { label: "Disk Space", val: "18.4GB", bar: 30, color: "bg-success" }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>{stat.label}</span>
                    <span className="text-foreground font-medium">{stat.val}</span>
                  </div>
                  <div className="h-1 bg-border/40 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live logs console console box */}
        <div className="pt-2 border-t border-border/20 mt-3">
          <span className="text-[9px] text-muted-foreground uppercase block mb-1">Build & Deployment Logs</span>
          <div className="h-[95px] overflow-y-auto space-y-1 text-[10px] bg-black/60 p-2.5 rounded-lg border border-border/15 text-muted-foreground selection:bg-primary/20 selection:text-white">
            {logs.slice(-4).map((log, idx) => (
              <div key={idx} className={log.startsWith(">>") ? "text-primary/95" : "text-white/80"}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────── */
const FullStackDevelopment = () => {
  const [activeTab, setActiveTab] = useState("frontend");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const activeExpertise = expertise.find(e => e.id === activeTab)!;

  return (
    <Layout>
      <SEO
        title="Full Stack Development Services | ScaleXWeb Solution"
        description="End-to-end full stack development by ScaleXWeb — custom web applications, enterprise software, AI/ML integration, and scalable digital products built with modern tech stacks."
        path="/services/full-stack-development"
      />

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[550px] h-[550px] bg-primary/12 -top-40 -left-20 animate-pulse-glow" />
        <div className="orb w-[350px] h-[350px] bg-accent/10 bottom-20 right-20 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container-tight relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7">
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <span className="text-muted-foreground">Services</span>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80 font-medium">Full Stack Development</span>
              </nav>
              <div className="pill-badge mb-6"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Full Stack Development</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-foreground leading-[0.95] tracking-tight mb-6 max-w-2xl">
                End-to-End Full Stack<br /><span className="gradient-text">Development Services</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                From pixel-perfect frontends to battle-tested backends — we architect, build, and scale full-stack digital products that power ambitious businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button variant="hero" size="lg" className="gap-2 text-base px-8" asChild>
                  <a href="#fullstack-lead-form">Start Your Project <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 border-border/50" asChild>
                  <Link to="/about">About ScaleXWeb</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {["React + Node.js", "Next.js + Django", "MERN Stack", "Cloud-Native", "AI-Powered", "Microservices"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 border border-primary/20 text-primary">{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Right: Cloud Console Simulator */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="lg:col-span-5 flex justify-center w-full">
              <FullStackSimulator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. End-to-End Services ─────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">What We Deliver</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              End-to-End Full Stack <span className="gradient-text">Development Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From first wireframe to production deployment — every layer of your digital product, handled by one team with full accountability.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div key={svc.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7 group hover:glow-sm transition-all duration-500">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-3">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Expertise Tabs ──────────────────────────── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Technical Depth</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Our Extensive Expertise As A Leading<br /><span className="gradient-text">Full Stack Web Development Company</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Deep proficiency across the entire stack — from interactive UIs to distributed backend systems and cloud infrastructure.</p>
          </motion.div>

          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {expertise.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id ? "gradient-primary text-white glow-sm" : "glass text-muted-foreground hover:text-foreground border border-border/40"}`}
                >
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="gradient-border bg-card rounded-2xl p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                    {(() => {
                      const Icon = activeExpertise.icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground">{activeExpertise.label}</h3>
                    <p className="text-sm text-muted-foreground">{activeExpertise.desc}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeExpertise.items.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="text-primary font-semibold">{item.level}%</span>
                      </div>
                      <div className="h-2 bg-border/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full gradient-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.level}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. Stack Combinations ──────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Tech Stacks</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Diverse Full Stack Combinations<br /><span className="gradient-text">Tailored for Your Business</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We don't force you into a cookie-cutter stack. We choose the best combination for your specific use case, team, and scale.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stackCombinations.map((stack, i) => (
              <motion.div key={stack.name} {...stagger(i)} className={`rounded-2xl p-6 border ${stack.border} bg-gradient-to-br ${stack.color} backdrop-blur-sm group hover:glow-sm transition-all duration-500`}>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">{stack.name}</h3>
                <div className="space-y-3 mb-5">
                  {[["Frontend", stack.front], ["Backend", stack.back], ["Database", stack.db]].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
                      <span className="text-sm font-semibold text-foreground bg-background/40 px-3 py-1 rounded-lg">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Best for: <span className="text-foreground font-medium">{stack.best}</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pricing / Hire Models ────────────────────── */}
      <section className="section-padding bg-navy">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Engagement Models</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Hire Full-Stack Development Team<br /><span className="gradient-text">As Per Your Need</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three flexible engagement models to match your project stage, budget, and team structure.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} {...stagger(i)}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 ${plan.featured ? "gradient-primary glow-primary" : "gradient-border bg-card hover:glow-sm"}`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-primary text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">{plan.tag}</span>
                  </div>
                )}
                {!plan.featured && (
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-3 block">{plan.tag}</span>
                )}
                <h3 className={`font-heading font-bold text-2xl mb-1 ${plan.featured ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <p className={`text-xs mb-2 ${plan.featured ? "text-white/60" : "text-muted-foreground"}`}>{plan.period}</p>
                <p className={`text-sm leading-relaxed mb-6 ${plan.featured ? "text-white/80" : "text-muted-foreground"}`}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.highlights.map(h => (
                    <li key={h} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.featured ? "text-white/80" : "text-primary"}`} />
                      <span className={plan.featured ? "text-white/90" : "text-foreground/80"}>{h}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? "hero-outline" : "hero"} className="w-full gap-2" asChild>
                  <a href="#fullstack-lead-form">
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Accelerate — Lead Form ──────────────────── */}
      <section id="fullstack-lead-form" className="section-padding bg-background relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="orb w-[500px] h-[500px] bg-primary/12 -top-40 -right-40 animate-pulse-glow" />
        <div className="orb w-[300px] h-[300px] bg-accent/10 bottom-0 -left-20 animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="relative z-10 container-tight">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="pill-badge mb-6"><Rocket className="w-3.5 h-3.5" />Let's Build Together</div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-tight mb-6">
                Accelerate Your Business With{" "}<span className="gradient-text">Top-Tier Full Stack</span>{" "}Development
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Tell us what you're building and we'll assemble the perfect team and architecture for it — in days, not weeks.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Clock, text: "Free discovery call within 24 hours" },
                  { icon: Shield, text: "NDA signed before any discussion" },
                  { icon: Users, text: "Dedicated team assembled in days" },
                  { icon: TrendingUp, text: "ROI-focused delivery from Sprint 1" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground/80 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Right — Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="gradient-border bg-card rounded-3xl p-8 md:p-10 glow-sm relative">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Start the Conversation</h3>
                <p className="text-sm text-muted-foreground mb-7">Our tech lead will reach out within <span className="text-primary font-medium">24 business hours</span>.</p>
                <LeadForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. Process ─────────────────────────────────── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">How We Work</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Our Proven Full Stack <span className="gradient-text">Development Process</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A battle-tested, transparent delivery model that minimises risk and maximises speed-to-value.</p>
          </motion.div>
          <div className="relative">
            {/* Connector line on desktop */}
            <div className="hidden lg:block absolute top-12 left-[8.33%] right-[8.33%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-0" />
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-5 relative z-10">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div key={step.step} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-6 group hover:glow-sm transition-all duration-500 flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-heading font-bold text-sm mb-4 group-hover:glow-sm transition-all flex-shrink-0">
                      {step.step}
                    </div>
                    <Icon className="w-5 h-5 text-primary/70 mb-3" />
                    <h3 className="font-heading font-semibold text-foreground text-sm mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Success Stories ─────────────────────────── */}
      <section className="section-padding bg-navy overflow-hidden">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-accent uppercase tracking-[0.2em] mb-3">Case Studies</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Our Full-Stack Development <span className="gradient-text">Success Stories</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, i) => (
              <motion.div key={story.industry} {...stagger(i)} className="glass rounded-2xl p-8 border border-white/10 flex flex-col group hover:border-primary/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <span className="pill-badge">{story.industry}</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/25 px-3 py-1.5 rounded-full">{story.result}</span>
                </div>
                <div className="space-y-4 flex-1">
                  {[["Challenge", story.challenge, "text-red-400"], ["Solution", story.solution, "text-primary"], ["Outcome", story.outcome, "text-green-400"]].map(([label, content, color]) => (
                    <div key={label}>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${color}`}>{label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Tech Proficiency ────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Stack Depth</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              Technical Proficiency of Our<br /><span className="gradient-text">Full-Stack Developers</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our developers are specialists first, full-stackers second — deep expertise in each layer, not shallow generalists.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {techProficiency.map((cat, i) => (
              <motion.div key={cat.category} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7">
                <h3 className={`font-heading font-bold text-sm uppercase tracking-wider mb-5 ${cat.color.split(" ")[0]}`}>{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <span key={item} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${cat.color}`}>{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Why Us ─────────────────────────────────── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-tight">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Why ScaleXWeb</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-5">
              What Makes ScaleXWeb Solution the Best<br /><span className="gradient-text">Full Stack Development Services Company?</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} {...stagger(i)} className="gradient-border bg-card rounded-2xl p-7 group hover:glow-sm transition-all duration-500">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-5 group-hover:glow-sm transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ─────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-tight max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-5">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground">Everything you need to know before kicking off your full-stack project.</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...stagger(i)} className="gradient-border bg-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left group"
                >
                  <span className="font-heading font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-7 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link to="/contact">Talk to Our Team <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FullStackDevelopment;
