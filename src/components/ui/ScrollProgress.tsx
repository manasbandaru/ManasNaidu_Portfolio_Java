import { motion } from 'framer-motion';
import { useScrollProgress } from '../../hooks/useScrollAnimations';

export const ScrollProgress: React.FC = () => {
  const scrollProgress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollProgress > 5 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};