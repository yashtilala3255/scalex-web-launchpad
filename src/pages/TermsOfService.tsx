import Layout from "@/components/layout/Layout";
import PageHero from "@/components/sections/PageHero";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const TermsOfService = () => (
  <Layout>
    <SEO
      title="Terms of Service | ScaleXWeb Solution"
      description="Review the Terms of Service for using ScaleXWeb Solution's website and digital development services."
      path="/terms-of-service"
    />
    <PageHero
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms-of-service" }]}
      headline="Terms of Service"
      subheadline="Please read these terms carefully before using our services."
    />

    <section className="section-padding bg-background">
      <div className="container-tight max-w-3xl">
        <motion.div {...fadeUp} className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-sm">Last Updated: August 15, 2024</p>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the services provided by ScaleXWeb Solution ("Company", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">2. Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScaleXWeb Solution provides digital services including but not limited to website development, app development, SaaS development, e-commerce solutions, and UI/UX design. The specific scope, deliverables, timeline, and pricing for each project will be outlined in a separate proposal or agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">3. Client Obligations</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information required for the project</li>
              <li>Respond to communications and provide feedback in a timely manner</li>
              <li>Ensure that any content provided does not infringe on third-party rights</li>
              <li>Make payments according to the agreed-upon schedule</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upon full payment, the client receives ownership of the final deliverables as specified in the project agreement. ScaleXWeb Solution retains the right to showcase the work in our portfolio unless otherwise agreed. Any pre-existing tools, frameworks, or proprietary code used in the project remain the property of ScaleXWeb Solution.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">5. Payment Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Payment terms will be outlined in individual project proposals. Typically, projects require an upfront deposit before work begins. Late payments may result in project delays or suspension of services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">6. Confidentiality</h2>
            <p className="text-muted-foreground leading-relaxed">
              Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the engagement. This obligation survives the termination of the agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScaleXWeb Solution shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by the client for the specific project in question.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              Either party may terminate a project engagement with written notice. In such cases, the client is responsible for payment of all work completed up to the termination date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions regarding these Terms of Service, please reach out to us at{" "}
              <a href="mailto:scalexwebsolution@gmail.com" className="text-primary hover:underline">scalexwebsolution@gmail.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default TermsOfService;
