import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    const routeChanged = previousPathRef.current !== location.pathname;
    previousPathRef.current = location.pathname;

    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, routeChanged ? 650 : 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

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
