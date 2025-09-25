import React, { lazy, Suspense } from 'react';
import type { Project } from '../../types/portfolio';

// Lazy load the modal component
const ProjectModal = lazy(() => 
  import('../ui/ProjectModal').then(module => ({
    default: module.ProjectModal
  }))
);

interface LazyProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalFallback: React.FC = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

export const LazyProjectModal: React.FC<LazyProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <Suspense fallback={<ModalFallback />}>
      <ProjectModal project={project} isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
};