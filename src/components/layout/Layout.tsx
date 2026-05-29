import { useEffect } from "react";
import { useMotionValue, useSpring, useTransform, motion, animate } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  // Primary glow spring: Faster response, closely follows cursor
  const springX1 = useSpring(mouseX, { stiffness: 95, damping: 30 });
  const springY1 = useSpring(mouseY, { stiffness: 95, damping: 30 });

  // Accent glow spring: Slower response, drags behind to create a liquid/fluid trailing mix
  const springX2 = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const springY2 = useSpring(mouseY, { stiffness: 45, damping: 22 });

  // Smooth scale transition when clicking
  const springScale = useSpring(scale, { stiffness: 120, damping: 18 });

  // Combines both coordinates to draw a stretching, morphing dual-gradient color mixture
  const background = useTransform(
    [springX1, springY1, springX2, springY2, springScale],
    ([x1, y1, x2, y2, s]) => `radial-gradient(${900 * s}px circle at ${x1}px ${y1}px, hsl(var(--cursor-glow-1) / calc(var(--cursor-glow-opacity-1) * ${s})), transparent 80%),
                 radial-gradient(${550 * s}px circle at ${x2}px ${y2}px, hsl(var(--cursor-glow-2) / calc(var(--cursor-glow-opacity-2) * ${s})), transparent 80%)`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => {
      animate(scale, 1.25, { duration: 0.15, ease: "easeOut" });
    };

    const handleMouseUp = () => {
      animate(scale, 1.0, { type: "spring", stiffness: 120, damping: 15 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, scale]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Dynamic Cursor Spotlight Glow Overlay */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={{ background }}
      />

      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
