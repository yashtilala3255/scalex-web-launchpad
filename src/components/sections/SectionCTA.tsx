import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SectionCTAProps {
  headline: string;
  subheadline?: string;
  primaryCTA?: string;
  primaryLink?: string;
  secondaryCTA?: string;
  secondaryLink?: string;
}

const SectionCTA = ({
  headline,
  subheadline,
  primaryCTA,
  primaryLink = "/contact",
  secondaryCTA,
  secondaryLink,
}: SectionCTAProps) => (
  <section className="relative overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 gradient-primary opacity-90" />
    <div className="absolute inset-0 dot-grid opacity-20" />

    {/* Decorative orbs */}
    <div className="orb w-96 h-96 bg-white/10 -top-20 -right-20 animate-pulse-glow" />
    <div className="orb w-64 h-64 bg-white/8 -bottom-10 -left-10 animate-pulse-glow" style={{ animationDelay: "2s" }} />

    <div className="relative container-tight py-20 md:py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-5 max-w-3xl mx-auto leading-tight">
          {headline}
        </h2>
        {subheadline && (
          <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto">{subheadline}</p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryCTA && (
            <Link to={primaryLink}>
              <Button
                variant="hero-outline"
                size="lg"
                className="gap-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 text-base px-8"
              >
                {primaryCTA} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          {secondaryCTA && secondaryLink && (
            <Link to={secondaryLink}>
              <Button
                variant="ghost"
                size="lg"
                className="text-white/80 hover:text-white hover:bg-white/10 text-base px-8"
              >
                {secondaryCTA}
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SectionCTA;
