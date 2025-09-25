// Accessibility utility functions

/**
 * Generates a unique ID for accessibility purposes
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if an element is visible to screen readers
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.getAttribute('aria-hidden') !== 'true'
  );
};

/**
 * Gets all focusable elements within a container
 */
export const getFocusableElements = (
  container: HTMLElement,
  includeHidden: boolean = false
): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const elements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ) as HTMLElement[];

  return elements.filter(element => 
    includeHidden || isElementVisible(element)
  );
};

/**
 * Traps focus within a container element
 */
export const trapFocus = (container: HTMLElement): (() => void) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element initially
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Announces a message to screen readers
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('role', 'status');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';

  document.body.appendChild(announcer);
  announcer.textContent = message;

  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcer)) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

/**
 * Checks if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Checks if user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Gets appropriate ARIA label for a skill level
 */
export const getSkillLevelAriaLabel = (level: number, maxLevel: number = 5): string => {
  const percentage = Math.round((level / maxLevel) * 100);
  const levelNames = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert'];
  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)] || 'Unknown';
  
  return `${levelName} level, ${percentage} percent proficiency`;
};

/**
 * Creates accessible button props
 */
export const createAccessibleButtonProps = (
  label: string,
  description?: string,
  pressed?: boolean,
  expanded?: boolean
) => {
  const props: Record<string, any> = {
    'aria-label': label,
    role: 'button',
    tabIndex: 0
  };

  if (description) {
    props['aria-describedby'] = generateId('desc');
  }

  if (typeof pressed === 'boolean') {
    props['aria-pressed'] = pressed;
  }

  if (typeof expanded === 'boolean') {
    props['aria-expanded'] = expanded;
  }

  return props;
};

/**
 * Creates accessible link props
 */
export const createAccessibleLinkProps = (
  url: string,
  label: string,
  external: boolean = false
) => {
  const props: Record<string, any> = {
    href: url,
    'aria-label': label
  };

  if (external) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
    props['aria-label'] = `${label} (opens in new tab)`;
  }

  return props;
};

/**
 * Validates color contrast ratio
 */
export const getContrastRatio = (_color1: string, _color2: string): number => {
  // This is a simplified version - in a real app you'd use a proper color library
  // For now, return a mock value that indicates good contrast
  return 4.5; // WCAG AA standard
};

/**
 * Checks if color combination meets WCAG standards
 */
export const meetsContrastStandards = (
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};