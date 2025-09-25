import { motion } from 'framer-motion';
import { useScrollAnimation, fadeInUpVariants } from '../../hooks/useScrollAnimations';
import type { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: any;
  delay?: number;
  threshold?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  variants = fadeInUpVariants,
  delay = 0,
  threshold = 0.1
}) => {
  const { ref, controls } = useScrollAnimation(threshold);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible.transition,
            delay: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};