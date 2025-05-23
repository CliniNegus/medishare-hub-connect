

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Cache to store previous API calls and their timestamps
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

// Track API calls for rate limiting
const apiCallTracker = {
  calls: 0,
  resetAt: Date.now() + 60 * 1000, // 1 minute window
  limit: 100, // Limit to match server-side
};

// Reset the call tracker every minute
setInterval(() => {
  apiCallTracker.calls = 0;
  apiCallTracker.resetAt = Date.now() + 60 * 1000;
}, 60 * 1000);

/**
 * Wrapper for API calls with caching, rate limiting and error handling
 */
export async function fetchWithCache<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttl = CACHE_TTL
): Promise<T> {
  try {
    // Check if we've exceeded client-side rate limit
    if (apiCallTracker.calls >= apiCallTracker.limit) {
      const secondsToReset = Math.max(0, Math.ceil((apiCallTracker.resetAt - Date.now()) / 1000));
      toast({
        title: "Too many requests",
        description: `Rate limit exceeded. Please try again in ${secondsToReset} seconds.`,
        variant: "destructive",
      });
      throw new Error(`Rate limit exceeded. Please try again in ${secondsToReset} seconds.`);
    }

    // Increment the call counter
    apiCallTracker.calls++;
    
    // Check if we have a cached response and it's still valid
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Fetch fresh data
    const data = await fetcher();
    
    // Cache the response
    apiCache.set(key, { data, timestamp: Date.now() });
    
    return data;
  } catch (error: any) {
    // Handle specific status codes
    if (error.status === 429) {
      toast({
        title: "Too many requests",
        description: "Rate limit exceeded. Please try again later.",
        variant: "destructive",
      });
    } else if (error.status === 401 || error.status === 403) {
      toast({
        title: "Authentication error",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      window.location.href = "/auth";
    } else {
      // Handle general error
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    throw error;
  }
}

/**
 * Helper to create a cache key from a function name and its arguments
 */
export function createCacheKey(functionName: string, args: any): string {
  return `${functionName}:${JSON.stringify(args)}`;
}

/**
 * Clear a specific item from the cache
 */
export function clearCacheItem(key: string): void {
  apiCache.delete(key);
}

/**
 * Clear all items from the cache
 */
export function clearCache(): void {
  apiCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  return {
    size: apiCache.size,
    keys: Array.from(apiCache.keys()),
    apiCalls: {
      current: apiCallTracker.calls,
      limit: apiCallTracker.limit,
      resetIn: Math.max(0, Math.ceil((apiCallTracker.resetAt - Date.now()) / 1000)),
    }
  };
}

/**
 * Load an image with a callback for loading progress
 */
export function loadImageWithProgress(
  src: string,
  onProgress?: (percent: number) => void
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'blob';
    
    xhr.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const img = new Image();
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Image loading failed'));
        };
        
        img.src = url;
      } else {
        reject(new Error(`HTTP error: ${xhr.status}`));
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network error'));
    };
    
    xhr.send();
  });
}

/**
 * Function to implement debounce for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Function to implement throttle for API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

