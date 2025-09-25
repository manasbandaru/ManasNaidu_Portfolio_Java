import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createAccessibleButtonProps } from '../../utils/accessibility';
import { heroContent } from '../../data/portfolio';

export const Hero: React.FC = () => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const nameAnimation = useTypingAnimation({
    text: heroContent.name,
    speed: 150,
    delay: 500
  });

  const titleAnimation = useTypingAnimation({
    text: heroContent.titles[currentTitleIndex],
    speed: 100,
    delay: nameAnimation.isComplete ? 300 : 0
  });

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Cycle through titles
  useEffect(() => {
    if (titleAnimation.isComplete) {
      const titleTimeout = setTimeout(() => {
        setCurrentTitleIndex(prev => 
          prev === heroContent.titles.length - 1 ? 0 : prev + 1
        );
      }, 2000);

      return () => clearTimeout(titleTimeout);
    }
  }, [titleAnimation.isComplete, currentTitleIndex]);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (href.endsWith('.pdf')) {
      // Handle PDF downloads
      const link = document.createElement('a');
      link.href = href;
      link.download = href.split('/').pop() || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(href, '_blank');
    }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      role="banner"
      aria-label="Hero section with developer introduction"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={prefersReducedMotion ? {} : {
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={prefersReducedMotion ? {} : {
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? {} : { duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.p
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={prefersReducedMotion ? {} : { delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 mb-4 font-mono"
          >
            Hello, I'm
          </motion.p>

          {/* Animated Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="gradient-text">
              {nameAnimation.displayText}
              {!nameAnimation.isComplete && showCursor && !prefersReducedMotion && (
                <span className="animate-pulse" aria-hidden="true">|</span>
              )}
            </span>
          </h1>

          {/* Animated Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-gray-300 min-h-[3rem] md:min-h-[4rem]">
            {nameAnimation.isComplete && (
              <>
                {titleAnimation.displayText}
                {showCursor && !prefersReducedMotion && (
                  <span className="animate-pulse text-purple-400" aria-hidden="true">|</span>
                )}
              </>
            )}
          </h2>

          {/* Experience Badge */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={prefersReducedMotion ? {} : { delay: 1.5, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full mb-8"
            role="status"
            aria-label={`${heroContent.yearsExperience} plus years of experience`}
          >
            <span 
              className={`w-2 h-2 bg-green-400 rounded-full ${!prefersReducedMotion ? 'animate-pulse' : ''}`}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">
              {heroContent.yearsExperience}+ Years Experience
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
          >
            {heroContent.tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { delay: 2.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {heroContent.ctaButtons.map((button) => (
              <motion.button
                key={button.text}
                onClick={() => scrollToSection(button.href)}
                whileHover={prefersReducedMotion ? {} : { 
                  scale: 1.05,
                  boxShadow: button.primary 
                    ? "0 20px 40px rgba(139, 92, 246, 0.3)"
                    : "0 10px 20px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className={`
                  px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 w-full sm:w-auto sm:min-w-[220px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 text-center
                  ${button.primary 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg focus:ring-purple-500' 
                    : 'border-2 border-gray-600 hover:border-purple-400 hover:bg-purple-400/10 text-gray-300 hover:text-white focus:ring-gray-500'
                  }
                `}
                aria-label={button.href.startsWith('#') ? `Navigate to ${button.href.substring(1)} section` : `Open ${button.text} in new tab`}
                {...createAccessibleButtonProps(button.text)}
              >
                {button.text}
              </motion.button>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            transition={prefersReducedMotion ? {} : { delay: 3, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            aria-hidden="true"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
              transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-gray-400"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <motion.div
                  animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
                  transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-gray-400 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};