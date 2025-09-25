import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Modern logo components for Manas Bandaru's portfolio
 * 
 * Available variants:
 * - Logo: Full logo with geometric icon and text
 * - LogoMinimal: Simple <MB/> code-style logo
 * - LogoCode: Colorful <Manas/> code-style logo (recommended for navbar)
 */

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  onClick 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={`flex items-center space-x-2 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer ring with gradient */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="none"
            initial={prefersReducedMotion ? {} : { pathLength: 0 }}
            animate={prefersReducedMotion ? {} : { pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          
          {/* Inner geometric design */}
          <motion.path
            d="M12 20 L20 12 L28 20 L20 28 Z"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            fill="rgba(139, 92, 246, 0.1)"
            initial={prefersReducedMotion ? {} : { pathLength: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
          
          {/* Center dot */}
          <motion.circle
            cx="20"
            cy="20"
            r="3"
            fill="url(#logoGradient)"
            initial={prefersReducedMotion ? {} : { scale: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
            transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <motion.span
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className={`font-bold gradient-text ${textSizeClasses[size]} leading-tight`}
        >
          Manas
        </motion.span>
        <motion.span
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className={`text-xs text-gray-400 leading-tight ${size === 'sm' ? 'hidden' : ''}`}
        >
          Developer
        </motion.span>
      </div>
    </motion.div>
  );
};

// Alternative minimal logo version
export const LogoMinimal: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  onClick 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      <motion.span
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        className={`font-bold gradient-text ${sizeClasses[size]} tracking-tight`}
      >
        &lt;MB/&gt;
      </motion.span>
    </motion.div>
  );
};

// Animated code-style logo
export const LogoCode: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  onClick 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <motion.div
      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      className={`cursor-pointer font-mono ${className}`}
      onClick={onClick}
    >
      <motion.span
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={prefersReducedMotion ? {} : { opacity: 1 }}
        className={`${sizeClasses[size]} font-bold`}
      >
        <span className="text-blue-400">&lt;</span>
        <span className="gradient-text">Manas</span>
        <span className="text-purple-400">/&gt;</span>
      </motion.span>
    </motion.div>
  );
};