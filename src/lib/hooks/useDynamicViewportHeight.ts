import { useEffect, useState } from 'react';

function getWindowInnerHeight() {
  if (typeof window !== 'undefined') {
    return window.innerHeight;
  }
  return 0; // Default or server-side rendering
}

export function useDynamicViewportHeight() {
  const [dynamicVh, setDynamicVh] = useState(() => {
    // Initialize with current window.innerHeight if available, otherwise use a sensible default
    // This helps prevent a flash if the effect runs after first paint with a 0 value.
    const initialHeight = getWindowInnerHeight();
    return initialHeight > 0 ? initialHeight * 0.01 : 1; // Return 1vh equivalent or 1 as a fallback multiplier
  });

  useEffect(() => {
    function setVhProperty() {
      const vh = getWindowInnerHeight() * 0.01;
      document.documentElement.style.setProperty('--dynamic-vh', `${vh}px`);
      // Also update state if you need to use the raw pixel value in JS, though CSS var is primary
      setDynamicVh(vh);
    }

    if (typeof window !== 'undefined') {
      setVhProperty(); // Set on initial mount
      window.addEventListener('resize', setVhProperty);
      window.addEventListener('orientationchange', setVhProperty);

      return () => {
        window.removeEventListener('resize', setVhProperty);
        window.removeEventListener('orientationchange', setVhProperty);
      };
    }
  }, []);

  // The hook could return the value if needed directly in JS, 
  // but its main purpose is to set the CSS variable.
  return dynamicVh; 
}

// Optional: A component to globally apply this hook if preferred
// export function DynamicViewportHeightManager() {
//   useDynamicViewportHeight();
//   return null; // This component doesn't render anything
// } 