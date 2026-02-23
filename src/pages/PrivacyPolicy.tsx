import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const PrivacyPolicy = () => (
  <Layout>
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]}
      headline="Privacy Policy"
      subheadline="Your privacy matters to us. Learn how we collect, use, and protect your data."
    />

    <section className="section-padding bg-background">
      <div className="container-tight max-w-3xl">
        <motion.div {...fadeUp} className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-sm">Last Updated: February 23, 2026</p>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScaleXWeb Solution ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it when you visit our website or use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Name, email address, and phone number when you fill out our contact form</li>
              <li>Company name and project details you share with us</li>
              <li>Any other information you choose to provide in messages or communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">We also automatically collect certain information when you visit our website, including your IP address, browser type, device information, and browsing patterns through cookies and similar technologies.</p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To respond to your inquiries and provide our services</li>
              <li>To send you project-related communications</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraudulent or unauthorized activity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">4. Data Sharing & Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal data. We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or serving you (e.g., form submission services like Formspree, analytics providers). These parties are obligated to keep your information confidential.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:scalexwebsolution@gmail.com" className="text-primary hover:underline">scalexwebsolution@gmail.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
