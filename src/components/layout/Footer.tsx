import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterProps {
  socialLinks: SocialLink[];
  email: string;
}

export const Footer: React.FC<FooterProps> = ({ socialLinks, email }) => {
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'email':
        return <Mail size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              className="text-lg font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              &lt;/Manas&gt;
            </motion.button>
            <p className="text-sm text-gray-400">
              © {currentYear} Manas Naidu. Built with React & TypeScript.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {/* Email Link */}
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title={`Email: ${email}`}
            >
              <Mail size={20} />
            </motion.a>

            {/* Social Platform Links */}
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                title={`${link.platform}: ${link.url}`}
              >
                {getSocialIcon(link.platform)}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-6 pt-6 border-t border-gray-800">
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↑
            </motion.div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};