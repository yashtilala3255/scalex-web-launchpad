import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  name: string;
  path: string;
}

interface PageHeroProps {
  breadcrumbs?: Breadcrumb[];
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
}

const PageHero = ({ breadcrumbs, headline, subheadline, ctaText, ctaLink, badge }: PageHeroProps) => (
  <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 mesh-bg" />
    <div className="absolute inset-0 dot-grid opacity-40" />

    {/* Orbs */}
    <div className="orb w-[500px] h-[500px] bg-primary/15 -top-40 -left-40 animate-pulse-glow" />
    <div className="orb w-[300px] h-[300px] bg-accent/12 top-10 right-10 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

    {/* Gradient line at top */}
    <div className="absolute top-0 left-0 right-0 h-px gradient-primary opacity-60" />

    <div className="container-tight relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            {breadcrumbs.slice(1).map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 opacity-40" />
                {i === breadcrumbs.length - 2 ? (
                  <span className="text-foreground/80 font-medium">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-primary transition-colors">{crumb.name}</Link>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pill-badge mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {badge}
          </motion.div>
        )}

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-tight mb-5 max-w-4xl">
          {headline.split(" ").map((word, i, arr) =>
            i >= arr.length - 2 ? (
              <span key={i} className={i === arr.length - 2 ? " " : ""}>
                {i === arr.length - 1 ? <span className="gradient-text">{word}</span> : word}{" "}
              </span>
            ) : (
              <span key={i}>{word} </span>
            )
          )}
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            {subheadline}
          </p>
        )}

        {/* CTA */}
        {ctaText && ctaLink && (
          ctaLink.startsWith("#") ? (
            <a href={ctaLink} onClick={(e) => { e.preventDefault(); document.querySelector(ctaLink)?.scrollIntoView({ behavior: "smooth" }); }}>
              <Button variant="hero" size="lg" className="gap-2">
                {ctaText} <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          ) : (
            <Link to={ctaLink}>
              <Button variant="hero" size="lg" className="gap-2">
                {ctaText} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )
        )}
      </motion.div>
    </div>
  </section>
);

export default PageHero;
