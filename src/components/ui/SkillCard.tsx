import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Skill } from '../../types/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { getSkillLevelAriaLabel } from '../../utils/accessibility';

interface SkillCardProps {
  skill: Skill;
  index: number;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  // Convert proficiency (1-5) to percentage (20-100)
  const proficiencyPercentage = skill.proficiency * 20;
  const skillAriaLabel = getSkillLevelAriaLabel(skill.proficiency, 5);
  
  // Get skill icon based on name (simplified mapping)
  const getSkillIcon = (skillName: string): string => {
    const iconMap: Record<string, string> = {
      'Java': '☕',
      'Spring Boot': '🍃',
      'Spring Framework': '🍃',
      'Hibernate/JPA': '🗄️',
      'Maven': '📦',
      'Gradle': '🔧',
      'REST APIs': '🔗',
      'Microservices': '🏗️',
      'PostgreSQL': '🐘',
      'MySQL': '🐬',
      'MongoDB': '🍃',
      'Redis': '🔴',
      'H2 Database': '💾',
      'Apache Kafka': '📊',
      'Elasticsearch': '🔍',
      'React': '⚛️',
      'TypeScript': '📘',
      'JavaScript': '📜',
      'HTML5': '🌐',
      'CSS3': '🎨',
      'Tailwind CSS': '💨',
      'Thymeleaf': '🌿',
      'Docker': '🐳',
      'Kubernetes': '☸️',
      'Git': '📚',
      'Jenkins': '🔨',
      'AWS': '☁️',
      'IntelliJ IDEA': '💡'
    };
    return iconMap[skillName] || '🔧';
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? {} : { duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="relative group skill-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${skill.name} skill: ${skillAriaLabel}`}
    >
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 group-hover:bg-gray-800/70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <motion.span 
              className="text-2xl group-hover:scale-110 transition-transform duration-300" 
              role="img" 
              aria-label={skill.name}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {getSkillIcon(skill.name)}
            </motion.span>
            <div>
              <h4 className="font-semibold text-white">{skill.name}</h4>
              {skill.yearsOfExperience && (
                <p className="text-xs text-gray-400">
                  {skill.yearsOfExperience} year{skill.yearsOfExperience > 1 ? 's' : ''} exp.
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-purple-400">
              {proficiencyPercentage}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div 
          className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={proficiencyPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} proficiency: ${proficiencyPercentage}%`}
        >
          <motion.div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-2 rounded-full relative"
            initial={prefersReducedMotion ? { width: `${proficiencyPercentage}%` } : { width: 0 }}
            whileInView={prefersReducedMotion ? {} : { width: `${proficiencyPercentage}%` }}
            transition={prefersReducedMotion ? {} : { 
              duration: 1.2, 
              delay: index * 0.1 + 0.5,
              ease: "easeOut"
            }}
            viewport={{ once: true }}
          >
            {/* Animated shine effect */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 2,
                  delay: index * 0.1 + 1.5,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </div>
        
        {/* Proficiency Stars */}
        <div 
          className="flex space-x-1"
          role="img"
          aria-label={`${skill.proficiency} out of 5 stars`}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              className={`text-sm ${
                star <= skill.proficiency 
                  ? 'text-yellow-400' 
                  : 'text-gray-600'
              }`}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={prefersReducedMotion ? {} : { 
                duration: 0.3, 
                delay: index * 0.1 + star * 0.1 + 0.8 
              }}
              viewport={{ once: true }}
              aria-hidden="true"
            >
              ★
            </motion.span>
          ))}
        </div>
        
        {/* Enhanced Tooltip on hover - positioned to stay within bounds */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 border border-purple-500/50 z-30 shadow-xl shadow-purple-500/20 mx-1"
          >
            <div className="text-center">
              <div className="font-semibold text-purple-300">{skill.name}</div>
              <div className="text-gray-300 mt-1">
                Proficiency: {skill.proficiency}/5 ({proficiencyPercentage}%)
              </div>
              {skill.yearsOfExperience && (
                <div className="text-gray-400 text-xs mt-1">
                  {skill.yearsOfExperience} year{skill.yearsOfExperience > 1 ? 's' : ''} experience
                </div>
              )}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};