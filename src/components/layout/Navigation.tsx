import React from 'react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

// Navigation configuration
export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#hero'
  },
  {
    id: 'about',
    label: 'About',
    href: '#about'
  },
  {
    id: 'skills',
    label: 'Skills',
    href: '#skills'
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '#projects'
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact'
  }
];

// Utility function for smooth scrolling
export const smoothScrollTo = (elementId: string) => {
  // Ensure body can scroll (in case a modal left it disabled)
  document.body.style.overflow = 'unset';
  document.documentElement.style.overflow = 'unset';
  
  const element = document.getElementById(elementId);
  if (element) {
    try {
      // Primary method: use scrollIntoView
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Adjust for fixed header after scrolling
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        if (elementPosition < headerOffset && elementPosition > -headerOffset) {
          window.scrollBy({
            top: -(headerOffset - elementPosition),
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch {
      // Fallback method: calculate position and scroll
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
};

// Hook for detecting active section
export const useActiveSection = (sections: string[]) => {
  const [activeSection, setActiveSection] = React.useState('');

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      let currentSection = '';

      // Check each section to find which one is most visible
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          
          // If we're past the top of this section (accounting for header offset)
          if (scrollPosition >= elementTop - 100) {
            currentSection = section;
            break;
          }
        }
      }

      // Special case: if we're at the very bottom of the page, ensure contact is active
      if (scrollPosition + windowHeight >= document.documentElement.scrollHeight - 50) {
        currentSection = sections[sections.length - 1]; // Last section (contact)
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSection]);

  return activeSection;
};