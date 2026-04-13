import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const hasMountedRef = useRef(false);

  // Derive loading state from the location key so we avoid calling
  // setState synchronously inside useLayoutEffect, which triggers the
  // react-hooks/set-state-in-effect lint rule.
  const [loadingKey, setLoadingKey] = useState(location.key);
  const isNewRoute = loadingKey !== location.key;
  if (isNewRoute) {
    // Synchronous state update during render (before commit) is the
    // React-recommended way to reset state when props change.
    // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
    setLoadingKey(location.key);
  }

  const [isLoading, setIsLoading] = useState(true);
  if (isNewRoute && !isLoading) {
    setIsLoading(true);
  }

  useLayoutEffect(() => {
    const isInitial = !hasMountedRef.current;
    hasMountedRef.current = true;

    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, isInitial ? 900 : 450);

    const guardTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(guardTimer);
    };
  }, [loadingKey]);

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
