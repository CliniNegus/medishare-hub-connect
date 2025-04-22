
import React, { Suspense, lazy, useState, useEffect } from 'react';

interface LazyComponentProps {
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  fallback?: React.ReactNode;
  threshold?: number;
  onVisibilityChange?: (isVisible: boolean) => void;
  loadAfterMs?: number;
  props?: Record<string, any>;
}

/**
 * A wrapper component that lazily loads another component
 * only when it is visible in the viewport or after a specified delay
 */
const LazyComponent = ({
  component: Component,
  fallback = <div className="min-h-[100px] w-full animate-pulse bg-gray-100"></div>,
  threshold = 0.1,
  onVisibilityChange,
  loadAfterMs,
  props = {},
}: LazyComponentProps) => {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const componentRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create intersection observer to detect when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;
        setIsInView(isVisible);
        
        if (isVisible) {
          setShouldLoad(true);
          if (onVisibilityChange) {
            onVisibilityChange(true);
          }
          
          // Disconnect observer once component is in view and loading
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold,
      }
    );
    
    if (componentRef.current) {
      observer.observe(componentRef.current);
    }
    
    // If loadAfterMs is specified, load the component after that time regardless of visibility
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (loadAfterMs !== undefined) {
      timeoutId = setTimeout(() => {
        setShouldLoad(true);
      }, loadAfterMs);
    }
    
    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, onVisibilityChange, loadAfterMs]);
  
  return (
    <div ref={componentRef}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          <Component {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

/**
 * Factory function to create a lazy loaded component
 * This is a utility to make it easier to use lazy loading throughout the app
 */
export function createLazyComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  options?: Omit<LazyComponentProps, 'component'>
) {
  const LazyComponent = lazy(importFn);
  
  return (props: Record<string, any>) => (
    <Suspense fallback={options?.fallback || <div className="min-h-[100px] w-full animate-pulse bg-gray-100"></div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export default LazyComponent;
