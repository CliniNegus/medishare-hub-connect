
import { createClient } from '@supabase/supabase-js';

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the timeWindow
   */
  limit: number;
  
  /**
   * Time window in seconds
   */
  timeWindow: number;
  
  /**
   * Unique identifier for this rate limit (used for storage)
   */
  identifier: string;
  
  /**
   * Optional function to get a custom key for the request (e.g., IP address, user ID)
   * Defaults to using the request URL
   */
  keyGenerator?: (req: Request) => string | Promise<string>;
  
  /**
   * Message to return when rate limit is exceeded
   */
  message?: string;
}

export class RateLimiter {
  private supabase: any;
  private options: RateLimitOptions;
  
  constructor(supabaseClient: any, options: RateLimitOptions) {
    this.supabase = supabaseClient;
    this.options = {
      limit: 100,
      timeWindow: 60,
      identifier: 'default',
      message: 'Too many requests, please try again later.',
      ...options
    };
  }
  
  /**
   * Middleware function to check and apply rate limiting
   */
  async middleware(req: Request): Promise<Response | null> {
    try {
      const key = this.options.keyGenerator ? 
        await this.options.keyGenerator(req) : 
        new URL(req.url).pathname;
        
      const rateLimitKey = `ratelimit:${this.options.identifier}:${key}`;
      
      // Check current count in cache
      const { data: currentData, error: fetchError } = await this.supabase
        .from('rate_limits')
        .select('count, reset_at')
        .eq('key', rateLimitKey)
        .maybeSingle();
        
      const now = Math.floor(Date.now() / 1000);
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        // Log error but don't block the request
        console.error('Rate limit check error:', fetchError);
        return null;
      }
      
      // If no rate limit record or it's expired, create a new one
      if (!currentData || now > currentData.reset_at) {
        const resetTime = now + this.options.timeWindow;
        
        await this.supabase
          .from('rate_limits')
          .upsert({ 
            key: rateLimitKey, 
            count: 1, 
            reset_at: resetTime 
          });
          
        // Set headers for the first request
        const headers = new Headers();
        headers.set('X-RateLimit-Limit', this.options.limit.toString());
        headers.set('X-RateLimit-Remaining', (this.options.limit - 1).toString());
        headers.set('X-RateLimit-Reset', resetTime.toString());
        
        // Allow the request to proceed
        return null;
      }
      
      // If we have an existing valid rate limit record
      const currentCount = currentData.count;
      const resetTime = currentData.reset_at;
      
      // Set standard rate limit headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', this.options.limit.toString());
      
      // Check if limit is exceeded
      if (currentCount >= this.options.limit) {
        headers.set('X-RateLimit-Remaining', '0');
        headers.set('X-RateLimit-Reset', resetTime.toString());
        headers.set('Retry-After', (resetTime - now).toString());
        
        return new Response(
          JSON.stringify({ 
            error: 'Too Many Requests',
            message: this.options.message,
            retryAfter: resetTime - now 
          }),
          { 
            status: 429, 
            headers 
          }
        );
      }
      
      // Increment the counter
      await this.supabase
        .from('rate_limits')
        .update({ count: currentCount + 1 })
        .eq('key', rateLimitKey);
        
      // Set remaining requests header
      headers.set('X-RateLimit-Remaining', (this.options.limit - currentCount - 1).toString());
      headers.set('X-RateLimit-Reset', resetTime.toString());
      
      // Allow the request to proceed
      return null;
      
    } catch (error) {
      // Log the error but don't block the request
      console.error('Rate limit error:', error);
      return null;
    }
  }
}

/**
 * Create a new rate limiter instance
 */
export const createRateLimiter = (
  supabaseClient: any,
  options: RateLimitOptions
) => {
  return new RateLimiter(supabaseClient, options);
};
