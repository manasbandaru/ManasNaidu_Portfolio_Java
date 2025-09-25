import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolio';
import { SkillCategory } from '../ui/SkillCategory';
import { useStaggerAnimation } from '../../hooks/useScrollAnimations';
import { AnimatedSection, ParallaxWrapper } from '../ui';
import type { Skill } from '../../types/portfolio';

export const Skills: React.FC = () => {
  const { ref: staggerRef, isInView, containerVariants, itemVariants } = useStaggerAnimation(0.1);
  
  // Group skills by category
  const groupedSkills = portfolioData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Define category display names and order
  const categoryConfig = [
    { key: 'backend', title: 'Backend Development' },
    { key: 'database', title: 'Database & Storage' },
    { key: 'frontend', title: 'Frontend Development' },
    { key: 'tools', title: 'Tools & DevOps' }
  ];

  // Calculate overall stats
  const totalSkills = portfolioData.skills.length;
  const averageProficiency = Math.round(
    portfolioData.skills.reduce((acc, skill) => acc + skill.proficiency, 0) / totalSkills
  );
  const expertSkills = portfolioData.skills.filter(skill => skill.proficiency >= 4).length;

  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background decoration with parallax */}
      <div className="absolute inset-0 opacity-10">
        <ParallaxWrapper speed={0.4}>
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </ParallaxWrapper>
        <ParallaxWrapper speed={0.3}>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </ParallaxWrapper>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Technical Skills
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
            Comprehensive expertise in Java ecosystem and modern development technologies
          </p>
          
          {/* Skills Overview Stats */}
          <motion.div
            ref={staggerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex justify-center space-x-8 text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4"
            >
              <div className="text-2xl font-bold text-purple-400">{totalSkills}</div>
              <div className="text-sm text-gray-400">Total Skills</div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4"
            >
              <div className="text-2xl font-bold text-blue-400">{averageProficiency}/5</div>
              <div className="text-sm text-gray-400">Avg Proficiency</div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4"
            >
              <div className="text-2xl font-bold text-cyan-400">{expertSkills}</div>
              <div className="text-sm text-gray-400">Expert Level</div>
            </motion.div>
          </motion.div>
        </AnimatedSection>
        
        {/* All 4 categories in one row with scrollable content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categoryConfig.map((category, index) => {
            const skills = groupedSkills[category.key] || [];
            if (skills.length === 0) return null;
            
            return (
              <SkillCategory
                key={category.key}
                title={category.title}
                skills={skills}
                index={index}
              />
            );
          })}
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Interested in working together? Let's discuss your project requirements.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};