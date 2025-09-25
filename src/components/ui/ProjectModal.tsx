import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Project } from '../../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gray-800/95 backdrop-blur-md border border-gray-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-800/95 backdrop-blur-md border-b border-gray-700/50 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold gradient-text">{project.title}</h2>
                {project.featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-semibold px-2 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Project Image */}
              {project.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Project Details Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* Project Info */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {project.longDescription || project.description}
                  </p>
                  
                  {/* Technology Stack */}
                  <h4 className="text-md font-semibold text-white mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Project Meta */}
                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-3">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Started:</span>
                        <span className="text-white">{formatDate(project.startDate)}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed:</span>
                          <span className="text-white">{formatDate(project.endDate)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`font-medium ${
                          project.status === 'completed' ? 'text-green-400' :
                          project.status === 'in-progress' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>📚</span>
                        <span>View Source Code</span>
                      </motion.a>
                    )}
                    {project.liveUrl && (
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>🚀</span>
                        <span>View Live Demo</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};