'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MOBILE_MAX_WIDTH = 768; // Standard tablet portrait width

export function useMobileRedirect(targetPath: string) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure window is available
      const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
      // Only redirect if on the main RSVP page and on a mobile device
      if (isMobile && pathname === '/rsvp') {
        router.replace(targetPath);
      }
    }
  }, [router, pathname, targetPath]);
} 