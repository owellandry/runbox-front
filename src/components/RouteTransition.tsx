import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const hasMountedRef = useRef(false);

  useLayoutEffect(() => {
    setIsLoading(true);
    const isInitial = !hasMountedRef.current;
    hasMountedRef.current = true;

    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, isInitial ? 900 : 450);

    // Safety net to prevent any chance of an infinite loader.
    const guardTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(guardTimer);
    };
  }, [location.key]);

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
