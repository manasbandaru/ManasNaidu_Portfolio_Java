import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Project } from '../../types/portfolio';
import { LazyImage } from './LazyImage';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createAccessibleLinkProps, createAccessibleButtonProps } from '../../utils/accessibility';

interface ProjectCardProps {
  project: Project;
  index: number;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? {} : { duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      aria-describedby={`project-description-${project.id}`}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && project.imageUrl ? (
          <LazyImage
            src={project.imageUrl}
            alt={`Screenshot of ${project.title} project`}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 flex items-center justify-center"
            role="img"
            aria-label={`Placeholder image for ${project.title} project`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2" role="img" aria-label="Rocket emoji">🚀</div>
              <div className="text-sm text-gray-400">Project Preview</div>
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 
            id={`project-title-${project.id}`}
            className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors"
          >
            {project.title}
          </h3>
        </div>
        
        <p 
          id={`project-description-${project.id}`}
          className="text-gray-300 mb-4 line-clamp-3"
        >
          {project.description}
        </p>
        
        {/* Technology Stack */}
        <div 
          className="flex flex-wrap gap-2 mb-4"
          role="list"
          aria-label="Technologies used in this project"
        >
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded text-sm text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors"
              role="listitem"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span 
              className="px-2 py-1 bg-gray-600/50 rounded text-sm text-gray-400"
              role="listitem"
              aria-label={`${project.technologies.length - 4} additional technologies`}
            >
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
        
        {/* Project Links */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            {project.githubUrl && (
              <motion.a
                {...createAccessibleLinkProps(project.githubUrl, `View source code for ${project.title}`, true)}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md px-1 py-1"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <span role="img" aria-hidden="true">📚</span>
                <span>View Code</span>
              </motion.a>
            )}
            {project.liveUrl && (
              <motion.a
                {...createAccessibleLinkProps(project.liveUrl, `View live demo of ${project.title}`, true)}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md px-1 py-1"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <span role="img" aria-hidden="true">🚀</span>
                <span>Live Demo</span>
              </motion.a>
            )}
          </div>
          
          <motion.button
            onClick={() => onViewDetails(project)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-md px-1 py-1"
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            aria-label={`View detailed information about ${project.title}`}
            {...createAccessibleButtonProps(`View details for ${project.title} project`)}
          >
            <span>View Details</span>
            <span aria-hidden="true">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};