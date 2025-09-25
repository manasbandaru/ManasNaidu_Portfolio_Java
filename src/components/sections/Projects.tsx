import { motion } from 'framer-motion';
import { ProjectCard, AnimatedSection, ParallaxWrapper } from '../ui';
import { portfolioData } from '../../data/portfolio';
import { useStaggerAnimation } from '../../hooks/useScrollAnimations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const Projects: React.FC = () => {
  const { ref: staggerRef, isInView, containerVariants, itemVariants } = useStaggerAnimation(0.05);
  const prefersReducedMotion = useReducedMotion();

  // Separate featured and regular projects
  const featuredProjects = portfolioData.projects.filter(project => project.featured);
  const regularProjects = portfolioData.projects.filter(project => !project.featured);

  return (
    <section id="projects" className="py-20 bg-gray-900/50 relative overflow-hidden">
      {/* Background decoration with parallax */}
      <div className="absolute inset-0 opacity-5">
        <ParallaxWrapper speed={0.2}>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        </ParallaxWrapper>
        <ParallaxWrapper speed={0.3}>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        </ParallaxWrapper>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-4">Featured Projects</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Showcase of Java applications and systems I've built using modern technologies and best practices
          </p>
        </AnimatedSection>
        
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <AnimatedSection>
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <span className="mr-2">⭐</span>
                Featured Projects
              </h3>
            </AnimatedSection>
            <motion.div 
              ref={staggerRef}
              variants={prefersReducedMotion ? {} : containerVariants}
              initial={prefersReducedMotion ? {} : "hidden"}
              animate={prefersReducedMotion ? {} : (isInView ? "visible" : "hidden")}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProjects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  variants={prefersReducedMotion ? {} : itemVariants}
                >
                  <ProjectCard
                    project={project}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Other Projects */}
        {regularProjects.length > 0 && (
          <div>
            <motion.h3
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={prefersReducedMotion ? {} : { duration: 0.3, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-50px' }}
              className="text-2xl font-semibold text-white mb-8 flex items-center"
            >
              <span className="mr-2">🚀</span>
              Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index + featuredProjects.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Show all projects if no featured projects */}
        {featuredProjects.length === 0 && regularProjects.length === 0 && portfolioData.projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {portfolioData.projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Projects Coming Soon</h3>
            <p className="text-gray-400">I'm currently working on some exciting projects to showcase here.</p>
          </motion.div>
        )}
      </div>


    </section>
  );
};