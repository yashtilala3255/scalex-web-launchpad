import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TimelineContentProps {
  children: React.ReactNode;
  as?: React.ElementType;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: any;
  className?: string;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  children,
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
}) => {
  const localRef = useRef(null);
  const ref = timelineRef || localRef;
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: animationNum * 0.1 } },
  };

  const variants = customVariants || defaultVariants;

  return (
    <MotionComponent
      ref={localRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};
