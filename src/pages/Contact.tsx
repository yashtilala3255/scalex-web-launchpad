import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SectionCTA from "@/components/sections/SectionCTA";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Clock, Linkedin, Twitter, Instagram, Github, ChevronDown } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
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

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast.success("Thank you! We'll respond within 24 business hours.");
    reset();
  };

  return (
    <Layout>
      <PageHero
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
        headline="Let's Build Something Amazing Together"
        subheadline="Tell us about your project — we'll respond within 24 hours."
        ctaText="Fill Out the Form Below"
        ctaLink="#contact-form"
      />

      <section id="contact-form" className="section-padding bg-background">
        <div className="container-tight">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div {...fadeUp} className="lg:col-span-3">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                    <Input {...register("name")} placeholder="John Doe" />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                    <Input {...register("email")} type="email" placeholder="john@company.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                    <Input {...register("phone")} placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label>
                    <Input {...register("company")} placeholder="Your Company" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Service Interested In</label>
                    <Select onValueChange={(v) => setValue("service", v)}>
                      <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website Development</SelectItem>
                        <SelectItem value="app">App Development</SelectItem>
                        <SelectItem value="saas">SaaS Development</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="uiux">UI/UX Design</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Budget Range</label>
                    <Select onValueChange={(v) => setValue("budget", v)}>
                      <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<5k">Under ₹5 Lakh</SelectItem>
                        <SelectItem value="5k-15k">₹5–15 Lakh</SelectItem>
                        <SelectItem value="15k-50k">₹15–50 Lakh</SelectItem>
                        <SelectItem value=">50k">Above ₹50 Lakh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Project Description *</label>
                  <Textarea {...register("message")} placeholder="Tell us about your project, goals, and timeline..." rows={5} />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto text-base px-8">Send My Request</Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-5 mb-8">
                {[
                  { icon: Mail, label: "Email", value: "hello@scalexweb.com" },
                  { icon: Phone, label: "Phone", value: "+91 XXXXX XXXXX" },
                  { icon: MapPin, label: "Location", value: "Ahmedabad, Gujarat, India" },
                  { icon: Clock, label: "Business Hours", value: "Mon–Fri: 9 AM – 6 PM IST" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mb-8">
                {[Linkedin, Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </a>
                ))}
              </div>

              {/* FAQ */}
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-border bg-card overflow-hidden">
                      <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer flex items-center justify-between">
                        {faq.q}
                        <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-3 text-sm text-muted-foreground">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
