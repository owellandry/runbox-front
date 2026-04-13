import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    // Show loader on initial mount
    const initialTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // slightly longer for initial load

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsLoading(true);
      setCurrentPath(location.pathname);
      
      // Delay to show the beautiful loading animation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="global-loader" />}
      </AnimatePresence>
      
      <div 
        className="w-full h-full flex flex-col flex-1" 
        style={{ 
          opacity: isLoading ? 0 : 1, 
          pointerEvents: isLoading ? 'none' : 'auto',
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        {children}
      </div>
    </>
  );
};

export default RouteTransition;
