import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createAccessibleButtonProps } from '../../utils/accessibility';
import { useActiveSection, smoothScrollTo } from './Navigation';
import { LogoCode } from '../ui/Logo';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

interface HeaderProps {
  navigationItems: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({ navigationItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Use the more reliable active section detection
  const sections = navigationItems.map(item => item.href.substring(1));
  const activeSection = useActiveSection(sections);

  // Keyboard navigation for mobile menu
  useKeyboardNavigation({
    containerRef: mobileMenuRef as RefObject<HTMLElement>,
    onEscape: () => setIsMenuOpen(false),
    trapFocus: isMenuOpen,
    autoFocus: isMenuOpen
  });

  // Handle scroll effects for header background
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const targetId = href.substring(1);
    smoothScrollTo(targetId);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={prefersReducedMotion ? {} : { y: -100 }}
      animate={prefersReducedMotion ? {} : { y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('#hero')}
              className="hover:opacity-80 transition-opacity focus:outline-none rounded-md p-1"
              aria-label="Go to top of page"
              {...createAccessibleButtonProps('Navigate to hero section')}
            >
              <LogoCode size="md" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none ${
                  activeSection === item.href.substring(1)
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
              >
                {item.label}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="md:hidden bg-gray-900/95 backdrop-blur-md border-b border-gray-800 absolute top-full left-0 right-0 z-50"
          role="navigation"
          aria-label="Mobile navigation"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollToSection(item.href);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none cursor-pointer mobile-menu-button ${
                  activeSection === item.href.substring(1)
                    ? 'text-blue-400 bg-gray-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.href.substring(1) ? 'page' : undefined}
                type="button"
                style={{ pointerEvents: 'auto' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.header>
  );
};