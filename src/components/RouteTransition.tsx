import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const previousPathRef = useRef(location.pathname);
  const previousLangRef = useRef(i18n.language);

  useEffect(() => {
    // Initial mount loading removal
    const initialTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    const routeChanged = previousPathRef.current !== location.pathname;
    const langChanged = previousLangRef.current !== i18n.language;
    
    previousPathRef.current = location.pathname;
    previousLangRef.current = i18n.language;

    // Trigger loading only if route changed or language changed (excluding initial render since that is handled above)
    if (routeChanged || langChanged) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, routeChanged ? 650 : 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, i18n.language]);

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
