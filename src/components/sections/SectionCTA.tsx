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
  <section className="relative bg-[#09090B] overflow-hidden py-24 border-t border-white/5">
    {/* Subtle dot grid overlay */}
    <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />

    <div className="relative container-tight px-6 z-10">
      <div className="grid lg:grid-cols-5 gap-12 items-center">
        {/* Left column (col-span-3): Editorial Headline & Subheadline */}
        <motion.div
          className="lg:col-span-3 text-left space-y-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-[#2563EB] uppercase tracking-[0.25em] font-semibold block">
            Let's Collaborate
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white leading-tight font-normal">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed font-sans pt-1">
              {subheadline}
            </p>
          )}
        </motion.div>

        {/* Right column (col-span-2): Stacked Action Buttons */}
        <motion.div
          className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-stretch sm:items-center lg:items-end"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {primaryCTA && (
            <Link to={primaryLink} className="w-full sm:w-auto lg:w-3/4">
              <Button
                variant="default"
                className="w-full bg-[#2563EB] hover:bg-blue-600 text-white gap-2 text-sm font-semibold h-12 shadow-md rounded-xl"
              >
                {primaryCTA} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
          {secondaryCTA && secondaryLink && (
            <Link to={secondaryLink} className="w-full sm:w-auto lg:w-3/4">
              <Button
                variant="outline"
                className="w-full border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 text-sm font-semibold h-12 rounded-xl"
              >
                {secondaryCTA}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  </section>
);

export default SectionCTA;
