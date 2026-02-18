import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SectionCTAProps {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  primaryLink: string;
  secondaryCTA?: string;
  secondaryLink?: string;
}

const SectionCTA = ({ headline, subheadline, primaryCTA, primaryLink, secondaryCTA, secondaryLink }: SectionCTAProps) => (
  <section className="gradient-primary section-padding">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container-tight text-center"
    >
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">{headline}</h2>
      <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">{subheadline}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={primaryLink}>
          <Button variant="hero-outline" size="lg" className="text-base px-8">{primaryCTA}</Button>
        </Link>
        {secondaryCTA && secondaryLink && (
          <Link to={secondaryLink}>
            <Button variant="ghost" size="lg" className="text-primary-foreground/80 hover:text-primary-foreground text-base">{secondaryCTA}</Button>
          </Link>
        )}
      </div>
    </motion.div>
  </section>
);

export default SectionCTA;
