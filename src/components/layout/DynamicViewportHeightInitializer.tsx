'use client';

import { useDynamicViewportHeight } from "@/lib/hooks/useDynamicViewportHeight";

export function DynamicViewportHeightInitializer() {
  useDynamicViewportHeight();
  return null; // This component does not render anything visible
} 