import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../../types/portfolio';
import { SkillCard } from './SkillCard';
import { useStaggerAnimation } from '../../hooks/useScrollAnimations';

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
  index: number;
}

export const SkillCategory: React.FC<SkillCategoryProps> = ({ title, skills, index }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const { ref: staggerRef, isInView, containerVariants, itemVariants } = useStaggerAnimation(0.1);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        setCanScroll(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [skills]);

  // Handle hover state and resume timeout
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsAutoScrolling(false);
    
    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Set timeout to resume auto-scroll after 5 seconds
    resumeTimeoutRef.current = window.setTimeout(() => {
      if (canScroll) {
        setIsAutoScrolling(true);
      }
    }, 5000);
  };

  const handleTouchStart = () => {
    setIsAutoScrolling(false);
    
    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!canScroll || !isAutoScrolling || isHovered) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isResetting = false;
    const scrollDirection = 1; // 1 for down, -1 for up

    const autoScroll = () => {
      if (isResetting) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      
      // Check if we've reached the bottom
      if (scrollTop >= maxScroll - 2 && scrollDirection === 1) {
        // Pause briefly at the bottom, then reset to top
        isResetting = true;
        setTimeout(() => {
          if (scrollContainer && isAutoScrolling && !isHovered) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            // Wait for smooth scroll to complete before resuming
            setTimeout(() => {
              isResetting = false;
            }, 800); // Wait for smooth scroll animation
          } else {
            isResetting = false;
          }
        }, 1000); // Pause at bottom for 1 second
      } else if (!isResetting) {
        // Continue scrolling down
        scrollContainer.scrollBy({ top: 1, behavior: 'auto' });
      }
    };

    const interval = setInterval(autoScroll, 50); // Slow scroll

    return () => {
      clearInterval(interval);
      isResetting = false;
    };
  }, [canScroll, isAutoScrolling, isHovered]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  const getCategoryIcon = (title: string): string => {
    const iconMap: Record<string, string> = {
      'Backend Development': '⚙️',
      'Database & Storage': '🗄️',
      'Frontend Development': '🎨',
      'Tools & DevOps': '🛠️'
    };
    return iconMap[title] || '💻';
  };

  const getCategoryDescription = (title: string): string => {
    const descriptionMap: Record<string, string> = {
      'Backend Development': 'Server-side technologies and frameworks',
      'Database & Storage': 'Data persistence and management systems',
      'Frontend Development': 'User interface and client-side technologies',
      'Tools & DevOps': 'Development tools and deployment technologies'
    };
    return descriptionMap[title] || 'Technical skills and expertise';
  };

  return (
    <motion.div
      ref={staggerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.005,
        transition: { duration: 0.3 }
      }}
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group w-full flex flex-col h-[450px] sm:h-[500px] overflow-hidden skill-container"
    >
      {/* Fixed Header */}
      <div className="text-center mb-4 flex-shrink-0 p-6 pb-2">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <motion.span 
            className="text-2xl group-hover:scale-110 transition-transform duration-300" 
            role="img" 
            aria-label={title}
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
          >
            {getCategoryIcon(title)}
          </motion.span>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">{title}</h3>
        </div>
        <p className="text-gray-400 text-xs">
          {getCategoryDescription(title)}
        </p>
      </div>
      
      {/* Scrollable Content Area with indicators */}
      <div className="flex-1 relative overflow-hidden">
        {/* Scroll fade indicators */}
        <div className="scroll-fade-top"></div>
        <div className="scroll-fade-bottom"></div>
        
        <div 
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden px-6 pb-4 scrollbar-thin"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          <div className="space-y-3 py-2 min-h-full">
            {skills.map((skill, skillIndex) => (
              <motion.div key={skill.name} variants={itemVariants}>
                <SkillCard 
                  skill={skill} 
                  index={skillIndex}
                />
              </motion.div>
            ))}
            {/* Add some padding at the bottom to ensure scrolling works */}
            <div className="h-4"></div>
          </div>
        </div>
        
        {/* Scroll hint */}
        {canScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isAutoScrolling ? [0.7, 0.3, 0.7] : 0.5 }}
            transition={{ duration: 2, repeat: isAutoScrolling ? Infinity : 0, delay: 1 }}
            className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none z-20 bg-gray-800/80 px-2 py-1 rounded"
          >
            {isAutoScrolling ? '⏸ Hover to pause' : isHovered ? '↕ Manual scroll' : '↕ Auto-resumes in 5s'}
          </motion.div>
        )}
      </div>
      
      {/* Fixed Footer Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
        viewport={{ once: true }}
        className="mt-auto pt-3 px-6 pb-6 border-t border-gray-700/50 flex-shrink-0"
      >
        <div className="flex justify-between text-xs text-gray-400">
          <span>{skills.length} skills</span>
          <span>
            Avg: {Math.round(skills.reduce((acc, skill) => acc + skill.proficiency, 0) / skills.length)}/5
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};