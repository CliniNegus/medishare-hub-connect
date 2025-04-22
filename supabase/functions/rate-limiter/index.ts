
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// In-memory store for rate limiting (in a production environment, you would use Redis or a similar store)
const requestStore: Record<string, { count: number, resetAt: number }> = {};

// Rate limit configuration
const RATE_LIMIT = 100; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const ip in requestStore) {
    if (requestStore[ip].resetAt < now) {
      delete requestStore[ip];
    }
  }
}, 5 * 60 * 1000);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get a unique identifier for the client (normally IP, but can be user ID if authenticated)
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    
    // Check if this client already has rate limit data
    if (!requestStore[clientIp]) {
      requestStore[clientIp] = {
        count: 0,
        resetAt: Date.now() + RATE_WINDOW,
      };
    }

    // Check if the rate limit period has expired and reset if needed
    if (requestStore[clientIp].resetAt < Date.now()) {
      requestStore[clientIp] = {
        count: 0,
        resetAt: Date.now() + RATE_WINDOW,
      };
    }

    // Increment request count
    requestStore[clientIp].count++;

    // Check if rate limit has been exceeded
    if (requestStore[clientIp].count > RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.floor(requestStore[clientIp].resetAt / 1000).toString(),
          },
        }
      );
    }

    // Process the actual request
    // In a real implementation, this would check auth, perform business logic, etc.
    const data = await req.json();
    
    // Return success with rate limit headers
    return new Response(
      JSON.stringify({
        message: "Request processed successfully",
        data: data,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": (RATE_LIMIT - requestStore[clientIp].count).toString(),
          "X-RateLimit-Reset": Math.floor(requestStore[clientIp].resetAt / 1000).toString(),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
