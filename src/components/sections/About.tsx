import { motion } from 'framer-motion';
import { portfolioData } from '../../data/portfolio';
import { useStaggerAnimation } from '../../hooks/useScrollAnimations';
import { AnimatedSection, ParallaxWrapper, ExperienceTimeline, EducationSection, CertificationsSection } from '../ui';

export const About: React.FC = () => {
  const { personalInfo, experience, education, certifications } = portfolioData;
  const { ref: staggerRef, isInView, containerVariants, itemVariants } = useStaggerAnimation(0.15);
  
  // Total years of Java experience
  const javaExperience = 5;

  return (
    <section id="about" className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background decoration with parallax */}
      <div className="absolute inset-0 opacity-5">
        <ParallaxWrapper speed={0.3}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        </ParallaxWrapper>
        <ParallaxWrapper speed={0.2}>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
        </ParallaxWrapper>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-4">About Me</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {personalInfo.summary}
          </p>
        </AnimatedSection>
        
        <motion.div 
          ref={staggerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-3 gap-12 items-start"
        >
          {/* Professional Headshot */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gray-700 rounded-2xl p-8 text-center">
                <div className="relative mb-6">
                  {personalInfo.profileImage ? (
                    <img
                      src={personalInfo.profileImage}
                      alt={personalInfo.name}
                      className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-purple-500 group-hover:scale-105 transition-transform duration-300 select-none profile-image"
                      style={{
                        imageRendering: 'auto',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        willChange: 'transform'
                      }}
                      loading="eager"
                      draggable={false}
                      onError={(e) => {
                        console.error('Profile image failed to load:', personalInfo.profileImage);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full mx-auto bg-gradient-to-br from-purple-500 to-blue-500 border-4 border-purple-500 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-4xl">👨‍💻</span>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{personalInfo.name}</h3>
                <p className="text-purple-400 font-semibold mb-4">{personalInfo.title}</p>
                <div className="bg-gray-600 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-purple-400">{javaExperience}+</div>
                  <div className="text-sm text-gray-300">Years of Java Experience</div>
                </div>
                <p className="text-gray-300 text-sm">📍 {personalInfo.location}</p>
              </div>
            </div>
          </motion.div>

          {/* Bio and Professional Journey */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6 text-white">Professional Journey</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4 leading-relaxed">
                  With over {javaExperience}+ years of experience in Java development, I specialize in creating scalable backend systems, 
                  RESTful APIs, and microservices architectures. My passion lies in building robust, maintainable applications 
                  that solve real-world business problems.
                </p>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  My expertise spans across the entire Spring ecosystem, from Spring Boot for rapid application development 
                  to Spring Cloud for distributed systems. I have extensive experience with database design, API development, 
                  and modern DevOps practices including containerization and cloud deployment.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  I'm committed to writing clean, testable code and following industry best practices. I enjoy mentoring 
                  junior developers and contributing to team knowledge sharing through code reviews and technical discussions.
                </p>
              </div>
            </div>

            {/* Core Expertise Grid */}
            <motion.div 
              variants={itemVariants}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-gray-700 rounded-lg p-6"
              >
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Backend Development
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Spring Boot & Spring Framework
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    RESTful API Development
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    Microservices Architecture
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                    JPA/Hibernate ORM
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-gray-700 rounded-lg p-6"
              >
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Tools & Technologies
                </h4>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    Docker & Kubernetes
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    PostgreSQL, MySQL, MongoDB
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    AWS Cloud Services
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    Maven, Gradle, Git
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Work Experience Timeline */}
        {experience.length > 0 && (
          <motion.div
            id="experience"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <AnimatedSection className="text-center mb-12">
              <h3 className="text-3xl font-bold gradient-text mb-4">Professional Experience</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                My journey through various roles and the impact I've made in each position
              </p>
            </AnimatedSection>
            <ExperienceTimeline experiences={experience} />
          </motion.div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <AnimatedSection className="text-center mb-12">
              <h3 className="text-3xl font-bold gradient-text mb-4">Education</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Academic foundation and relevant coursework that shaped my technical expertise
              </p>
            </AnimatedSection>
            <EducationSection education={education} />
          </motion.div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <AnimatedSection className="text-center mb-12">
              <h3 className="text-3xl font-bold gradient-text mb-4">Certifications</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Professional certifications that validate my expertise in key technologies
              </p>
            </AnimatedSection>
            <CertificationsSection certifications={certifications} />
          </motion.div>
        )}
      </div>
    </section>
  );
};