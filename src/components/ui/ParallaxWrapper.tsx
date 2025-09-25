import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useScrollAnimations';
import type { ReactNode } from 'react';

interface ParallaxWrapperProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ 
  children, 
  speed = 0.5, 
  className = '' 
}) => {
  const { ref, offsetY } = useParallax(speed);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: offsetY }}
      transition={{ type: "spring", stiffness: 400, damping: 90 }}
    >
      {children}
    </motion.div>
  );
};