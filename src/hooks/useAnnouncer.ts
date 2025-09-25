import { useCallback, useRef, useEffect } from 'react';

interface UseAnnouncerOptions {
  politeness?: 'polite' | 'assertive';
  clearAfter?: number; // Clear announcement after X milliseconds
}

export const useAnnouncer = ({ 
  politeness = 'polite', 
  clearAfter = 5000 
}: UseAnnouncerOptions = {}) => {
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Create announcer element if it doesn't exist
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', politeness);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.setAttribute('role', 'status');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current);
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [politeness]);

  const announce = useCallback((message: string) => {
    if (!announcerRef.current) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set the message
    announcerRef.current.textContent = message;

    // Clear the message after specified time
    if (clearAfter > 0) {
      timeoutRef.current = window.setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, clearAfter);
    }
  }, [clearAfter]);

  const clear = useCallback(() => {
    if (announcerRef.current) {
      announcerRef.current.textContent = '';
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  return { announce, clear };
};