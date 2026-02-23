import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  breadcrumbs: { name: string; path: string }[];
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
}

const PageHero = ({ breadcrumbs, headline, subheadline, ctaText, ctaLink }: PageHeroProps) => (
  <section className="gradient-primary pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container-tight relative z-10"
    >
      <div className="flex items-center gap-2 text-sm text-primary-foreground/60 mb-6">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.path} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            <Link to={crumb.path} className="hover:text-primary-foreground transition-colors">{crumb.name}</Link>
          </span>
        ))}
      </div>
      <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-4 max-w-3xl">{headline}</h1>
      <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl">{subheadline}</p>
      {ctaText && ctaLink && (
        <Link to={ctaLink}>
          <Button variant="hero-outline" size="lg" className="text-base">{ctaText}</Button>
        </Link>
      )}
    </motion.div>
  </section>
);

export default PageHero;
