import { useEffect, useState, useCallback } from 'react';

function getActualViewportHeight() {
  if (typeof window !== 'undefined') {
    // Prioritize visualViewport if available, as it's designed for this scenario
    if (window.visualViewport) {
      return window.visualViewport.height;
    }
    // Fallback to innerHeight
    return window.innerHeight;
  }
  return 0; // Default for SSR or if window is not available
}

export function useDynamicViewportHeight() {
  // Store the factor (1% of height) to be used in CSS calc()
  const [vhFactor, setVhFactor] = useState(() => {
    const initialHeight = getActualViewportHeight();
    return initialHeight > 0 ? initialHeight * 0.01 : 1; // Default to 1px if height is 0 initially
  });

  // Memoize updateVhProperty
  const updateVhProperty = useCallback(() => {
    const currentHeight = getActualViewportHeight();
    const newVhFactor = currentHeight * 0.01;
    console.log('[useDynamicViewportHeight] New height:', currentHeight, 'New VH Factor (px for 1vh):', newVhFactor);
    document.documentElement.style.setProperty('--dynamic-vh', `${newVhFactor}px`);
    setVhFactor(newVhFactor);
  }, []); // Empty dependency array, getActualViewportHeight has no external deps

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateVhProperty(); // Set on initial mount

      const visualViewport = window.visualViewport;
      if (visualViewport) {
        // If visualViewport is available, its resize event is more accurate for keyboard changes
        visualViewport.addEventListener('resize', updateVhProperty);
        // window.addEventListener('orientationchange', updateVhProperty); // visualViewport resize covers orientation
        return () => {
          visualViewport.removeEventListener('resize', updateVhProperty);
          // window.removeEventListener('orientationchange', updateVhProperty);
        };
      } else {
        // Fallback for older browsers
        window.addEventListener('resize', updateVhProperty);
        window.addEventListener('orientationchange', updateVhProperty);
        return () => {
          window.removeEventListener('resize', updateVhProperty);
          window.removeEventListener('orientationchange', updateVhProperty);
        };
      }
    }
  }, [updateVhProperty]); // Now updateVhProperty is a stable dependency

  // The hook returns the factor, though its main side effect is setting the CSS var.
  return { vhFactor, triggerViewportUpdate: updateVhProperty };
}

// Optional: A component to globally apply this hook if preferred
// export function DynamicViewportHeightManager() {
//   useDynamicViewportHeight();
//   return null; // This component doesn't render anything
// } 