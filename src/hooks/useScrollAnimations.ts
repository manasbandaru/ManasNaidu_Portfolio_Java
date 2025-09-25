import { useEffect, useState } from 'react';
import { useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

// Hook for scroll-triggered animations
export const useScrollAnimation = (_threshold = 0.1, triggerOnce = true) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: triggerOnce,
    margin: "-100px 0px -100px 0px"
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [isInView, controls, triggerOnce]);

  return { ref, controls, isInView };
};

// Hook for stagger animations
export const useStaggerAnimation = (delay = 0.1, _threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "-50px 0px -50px 0px"
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  return { ref, isInView, containerVariants, itemVariants };
};

// Hook for parallax effects
export const useParallax = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * speed;
        setOffsetY(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offsetY };
};

// Hook for scroll progress
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

// Animation variants for common patterns
export const fadeInUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeInLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const fadeInRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const scaleInVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};