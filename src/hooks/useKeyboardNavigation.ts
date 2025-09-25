import { useEffect, useCallback } from 'react';
import type { RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement>;
  focusableSelector?: string;
  onEscape?: () => void;
  onEnter?: (element: HTMLElement) => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export const useKeyboardNavigation = ({
  containerRef,
  focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  onEscape,
  onEnter,
  trapFocus = false,
  autoFocus = false
}: UseKeyboardNavigationOptions) => {
  
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll(focusableSelector);
    return Array.from(elements).filter(
      (element) => !element.hasAttribute('disabled') && 
                   element.getAttribute('tabindex') !== '-1'
    ) as HTMLElement[];
  }, [containerRef, focusableSelector]);

  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, target } = event;
    
    // Handle Escape key
    if (key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Enter key
    if (key === 'Enter' && onEnter && target instanceof HTMLElement) {
      event.preventDefault();
      onEnter(target);
      return;
    }

    // Handle Tab navigation with focus trapping
    if (key === 'Tab' && trapFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    // Arrow key navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const focusableElements = getFocusableElements();
      const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
      
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      
      switch (key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
      }

      if (nextIndex !== currentIndex) {
        event.preventDefault();
        focusableElements[nextIndex].focus();
      }
    }
  }, [getFocusableElements, onEscape, onEnter, trapFocus]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto-focus first element if requested
    if (autoFocus) {
      focusFirst();
    }

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, autoFocus, focusFirst]);

  return {
    focusFirst,
    focusLast,
    getFocusableElements
  };
};