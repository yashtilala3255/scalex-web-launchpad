import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

const sections = [
  {
    title: "What Are Cookies?",
    content: "Cookies are small text files placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a smoother browsing experience, and deliver analytical details to website owners.",
  },
  {
    title: "How We Use Cookies",
    content: "ScaleXWeb Solution uses cookies for limited purposes. These include maintaining our contact forms, security verification, determining if you have seen and accepted our cookie preferences, and analyzing how visitors interact with our site so we can optimize performance.",
  },
  {
    title: "Categories of Cookies We Use",
    content: "We classify cookies into three categories. Except for Essential cookies, we require your explicit consent before storing them: \n\n1. Essential/Strictly Necessary: Required for core site operations, secure form submission (such as Formspree), and security protection. These cannot be deactivated.\n\n2. Analytics & Performance: Used to collect anonymous traffic statistics (such as via Google Analytics), page load speeds, and user navigation paths to help us improve the site.\n\n3. Marketing & Lead Generation: Used occasionally to measure the efficiency of our marketing campaigns and understand how users find our website.",
  },
  {
    title: "Consent & Managing Your Preferences",
    content: "When you first visit our site, you are presented with a cookie consent banner. You can choose to accept all cookies, reject all non-essential cookies, or customize your settings. You can update your choice at any time by clearing your browser cache/cookies, which will re-trigger the consent banner on your next visit.",
  },
  {
    title: "Third-Party Cookies",
    content: "Some services we integrate (including Google Analytics for performance measurement, Formspree for contact forms, Vercel for high-speed routing, Supabase for cloud database storage, ipapi.co for local visitor geolocation personalization, and Google Fonts for typography loading) may place cookies or use local storage on your device. We encourage you to review their respective privacy and cookie policies to understand their data practices.",
  },
  {
    title: "Policy Updates",
    content: "We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for legal and regulatory reasons. The 'Last updated' date at the top of the policy will show when it was most recently revised.",
  },
  {
    title: "Contact Us",
    content: "If you have questions about our use of cookies or how we handle your preferences, please email us at scalexwebsolution@gmail.com.",
  },
];

const CookiePolicy = () => (
  <Layout>
    <SEO title="Cookie Policy | ScaleXWeb Solution" description="ScaleXWeb Solution's cookie policy — detailing how and why we use cookies on our website." path="/cookie-policy" />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }]}
      headline="Cookie Policy"
      subheadline="Last updated: May 2025"
      badge="Legal"
    />
    <section className="section-padding bg-background">
      <div className="container-tight max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="border border-border bg-card rounded-xl p-8 mb-8">
          <p className="text-muted-foreground leading-relaxed">
            This Cookie Policy explains how ScaleXWeb Solution (\"we,\" \"our,\" or \"us\") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
          </p>
        </motion.div>
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border bg-card rounded-xl p-7 hover:border-primary/20 transition-all duration-300">
              <h2 className="text-xl font-heading font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default CookiePolicy;
