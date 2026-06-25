import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Mail, Clock, Linkedin, Twitter, Instagram, ChevronDown, Send, ArrowRight, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Please describe your project"),
  source: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const faqs = [
  { q: "How long does a typical project take?", a: "Timeline varies by scope. A corporate website usually takes 4–6 weeks, while a SaaS platform may take 3–6 months. We'll provide a detailed timeline during our discovery phase." },
  { q: "What is your pricing model?", a: "We provide custom quotes based on project requirements. We offer both fixed-price and time & materials engagement models." },
  { q: "Do you provide post-launch support?", a: "Yes! We offer ongoing support and maintenance packages to keep your product running smoothly and up-to-date." },
  { q: "Can you work with our existing team?", a: "Absolutely. We frequently collaborate with in-house teams, providing dedicated developers or design resources as needed." },
];

import { useSiteData } from "@/context/SiteDataContext";

const Contact = () => {
  const { addInquiry, settings } = useSiteData();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        requirement: data.message,
        service: data.service || "General Inquiry"
      });

      const response = await fetch("https://formspree.io/f/mykdbezz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("Thank you! We'll respond within 24 business hours.");
        reset();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact ScaleXWeb — Start Your Project Today"
        description="Get in touch with ScaleXWeb Solution in Ahmedabad. Tell us about your website, app, or SaaS project — we respond within 24 business hours."
        keywords="hire web developers, contact ScaleXWeb, get a project quote, custom software estimates, web design agency contact number, Ahmedabad software company address"
        path="/contact"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": settings?.siteName || "ScaleXWeb Solutions",
            "url": "https://scalexweb.tech/contact",
            "email": settings?.contactEmail || "scalexwebsolution@gmail.com",
            "telephone": settings?.contactPhone || "+919876543210",
            "priceRange": "$$",
            "image": settings?.logoUrl || "https://scalexweb.tech/logo.png",
            "hasMap": "https://www.google.com/maps?q=ScaleXWeb+Solution+Ahmedabad+Gujarat+India",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": settings?.contactAddress || "Ahmedabad, Gujarat",
              "addressLocality": "Ahmedabad",
              "addressRegion": "Gujarat",
              "postalCode": "380001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 23.0225,
              "longitude": 72.5714
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            ],
            "sameAs": [
              settings?.socialLinkedin || "https://www.linkedin.com/company/scale-x-web-solution/",
              settings?.socialTwitter || "https://x.com/ScaleXWeb",
              settings?.socialInstagram || "https://www.instagram.com/scalexwebsolution/",
              "https://www.google.com/maps?q=ScaleXWeb+Solution+Ahmedabad+Gujarat+India"
            ].filter(Boolean)
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://scalexweb.tech"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact",
                "item": "https://scalexweb.tech/contact"
              }
            ]
          }
        ]}
      />
      <PageHero
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
        headline="Let's Build Something Amazing Together"
        subheadline="Tell us about your project — we'll get back within 24 hours."
        badge="Get In Touch"
      />

      <section id="contact-form" className="section-padding bg-background">
        <div className="container-tight">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div {...fadeUp} className="lg:col-span-3">
              <div className="border border-border bg-card rounded-xl p-8 md:p-10">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-sm text-muted-foreground mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <Input {...register("name")} placeholder="John Doe" className="bg-background/50 border-border/50 focus:border-primary/50" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                      <Input {...register("email")} type="email" placeholder="john@company.com" className="bg-background/50 border-border/50 focus:border-primary/50" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                      <Input {...register("phone")} placeholder="+91 XXXXX XXXXX" className="bg-background/50 border-border/50 focus:border-primary/50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label>
                      <Input {...register("company")} placeholder="Your Company" className="bg-background/50 border-border/50 focus:border-primary/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Service Interested In</label>
                    <Select onValueChange={(v) => setValue("service", v)}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website Development</SelectItem>
                        <SelectItem value="app">App Development</SelectItem>
                        <SelectItem value="saas">SaaS Development</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="uiux">UI/UX Design</SelectItem>
                        <SelectItem value="full-stack">Full Stack Development</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Project Description *</label>
                    <Textarea
                      {...register("message")}
                      placeholder="Tell us about your project, goals, timeline..."
                      rows={5}
                      className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" variant="default" size="lg" className="w-full gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl" disabled={isSubmitting}>
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Sending..." : "Send My Request"}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: settings?.contactEmail || "scalexwebsolution@gmail.com" },
                    { icon: MapPin, label: "Location", value: settings?.contactAddress || "Ahmedabad, Gujarat, India" },
                    { icon: Clock, label: "Business Hours", value: "Mon–Fri: 9 AM – 6 PM IST" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="border border-border bg-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all duration-300">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: settings?.socialLinkedin || "https://www.linkedin.com/company/scale-x-web-solution/", label: "LinkedIn" },
                  { icon: Twitter, href: settings?.socialTwitter || "https://x.com/ScaleXWeb", label: "Twitter" },
                  { icon: Instagram, href: settings?.socialInstagram || "https://www.instagram.com/scalexwebsolution/", label: "Instagram" },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 border border-border bg-card rounded-xl flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 transition-all duration-200 group">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>

              {/* Promise cards */}
              <div className="border border-border bg-card rounded-xl p-6">
                <p className="text-sm font-semibold text-foreground mb-4">What to expect</p>
                <ul className="space-y-3">
                  {["Response within 24 hours", "Free project consultation", "No commitment required", "Detailed project proposal"].map(p => (
                    <li key={p} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border border-border bg-card rounded-xl overflow-hidden px-5 py-0 border-b-0 group hover:border-primary/20 transition-all duration-300">
                      <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2 pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
