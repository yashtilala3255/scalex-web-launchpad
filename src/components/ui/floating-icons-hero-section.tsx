import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Interface for the props of each individual icon.
interface IconProps {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string; // Used for custom positioning of the icon.
  label?: string;    // Display name of the industry
}

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
}

// A single icon component with its own motion logic
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  // Motion values for the icon's position, with spring physics for smooth movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    setIsMobileDevice(isMobile);
    if (isMobile) return; // Completely skip cursor tracking on mobile/touch screens

    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
        );

        // If the cursor is close enough, repel the icon
        if (distance < 150) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2)
          );
          // The closer the cursor, the stronger the repulsion
          const force = (1 - distance / 150) * 50;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          // Return to original position when cursor is away
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute z-20', iconData.className)}
    >
      {/* Inner wrapper for the continuous floating animation */}
      <motion.div
        className={cn(
          "flex flex-col items-center justify-center p-2.5 md:p-3 rounded-2xl md:rounded-3xl shadow-md bg-card/60 border border-border/40 group hover:border-primary/30 transition-colors cursor-pointer",
          isMobileDevice ? "w-12 h-12 backdrop-blur-none" : "w-16 h-16 md:w-20 md:h-20 backdrop-blur-md"
        )}
        animate={isMobileDevice ? {
          y: [0, -4, 0, 4, 0],
        } : {
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 4, 0, -4, 0],
        }}
        transition={{
          duration: isMobileDevice ? 5 + Math.random() * 3 : 6 + Math.random() * 4,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        <iconData.icon className="w-6 h-6 md:w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
        {iconData.label && (
          <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all bg-card border border-border text-[10px] font-semibold text-foreground px-2 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none z-50">
            {iconData.label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, title, subtitle, ctaText, ctaHref, icons, ...props }, ref) => {
  // Refs to track the raw mouse position
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full min-h-[550px] flex items-center justify-center overflow-hidden bg-background py-20 border-y border-border/30',
        className
      )}
      {...props}
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full bg-[radial-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:16px_16px]"
      />
      <div className="absolute inset-0 mesh-bg opacity-30 -z-10" />

      {/* Container for the background floating icons */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {icons.map((iconData, index) => (
            <Icon
              key={iconData.id}
              mouseX={mouseX}
              mouseY={mouseY}
              iconData={iconData}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Container for the foreground content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">Industries</p>
          {title}
        </div>
        <p className="mt-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="px-8 h-12 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm">
            <a href={ctaHref}>{ctaText}</a>
          </Button>
        </div>
      </div>
    </div>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };
