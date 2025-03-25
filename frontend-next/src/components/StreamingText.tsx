import React, { useState, useEffect } from 'react';

type StreamingTextProps = {
  text: string;
  className?: string;
  speed?: number;
  isStreaming?: boolean;
  onComplete?: () => void;
};

const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  className = '',
  speed = 20, // milliseconds per character
  isStreaming = false,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    if (!text) {
      setDisplayedText('');
      setCurrentIndex(0);
      setIsComplete(false);
      return;
    }

    // If not streaming, show full text immediately
    if (!isStreaming) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // If streaming and not complete, animate the text
    if (isStreaming && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Check if we've reached the end
        if (currentIndex === text.length - 1) {
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, isStreaming, speed, onComplete]);

  return (
    <span className={`${className} ${isStreaming && !isComplete ? 'after:content-["|"] after:animate-pulse after:ml-0.5 after:text-primary' : ''}`}>
      {displayedText}
    </span>
  );
};

export default StreamingText;