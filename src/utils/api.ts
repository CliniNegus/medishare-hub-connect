
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
