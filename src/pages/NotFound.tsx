import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";

const NotFound = () => (
  <Layout>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="orb w-[500px] h-[500px] bg-primary/15 -top-32 -left-32 animate-pulse-glow" />
      <div className="orb w-[300px] h-[300px] bg-accent/12 bottom-10 right-10 animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center container-tight"
      >
        <div className="text-[10rem] font-heading font-black gradient-text leading-none mb-4 select-none">404</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" size="lg" className="gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="gap-2 border-border/50">
              <ArrowLeft className="w-4 h-4" /> Contact Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  </Layout>
);

export default NotFound;
