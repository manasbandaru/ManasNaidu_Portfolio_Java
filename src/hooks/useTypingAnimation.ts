import { useState, useEffect } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
}

export const useTypingAnimation = ({
  text,
  speed = 100,
  delay = 0,
  loop = false
}: UseTypingAnimationOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? delay : speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      
      if (loop) {
        const resetTimeout = setTimeout(() => {
          setDisplayText('');
          setCurrentIndex(0);
          setIsComplete(false);
        }, 2000);
        
        return () => clearTimeout(resetTimeout);
      }
    }
  }, [currentIndex, text, speed, delay, loop]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return { displayText, isComplete };
};