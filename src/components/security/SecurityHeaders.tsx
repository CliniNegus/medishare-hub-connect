
import React, { useEffect } from 'react';

// Security headers and CSP implementation
export const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Set Content Security Policy
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://bqgipoqlxizdpryguzac.supabase.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://bqgipoqlxizdpryguzac.supabase.co wss://bqgipoqlxizdpryguzac.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ];

    const csp = cspDirectives.join('; ');
    
    // Set CSP via meta tag if possible
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      document.head.appendChild(cspMeta);
    }
    cspMeta.setAttribute('content', csp);

    // Set other security headers via meta tags where possible
    const securityMetas = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityMetas.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Disable right-click context menu in production
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable F12 and other developer tools shortcuts in production
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

// Security monitoring hooks
export const useSecurityMonitoring = () => {
  useEffect(() => {
    // Monitor for console access attempts
    if (process.env.NODE_ENV === 'production') {
      const originalConsole = { ...console };
      
      // Override specific console methods to detect usage
      const consoleMethods = ['log', 'warn', 'error', 'info', 'debug'] as const;
      
      consoleMethods.forEach((method) => {
        if (typeof console[method] === 'function') {
          const originalMethod = console[method];
          console[method] = (...args: any[]) => {
            // In production, limit console output and log security events
            if (method === 'warn' || method === 'error') {
              originalMethod.apply(console, args);
            }
            
            // Could log this as a security event
            // logSecurityEvent('console_access', { method });
          };
        }
      });
    }

    // Monitor for developer tools
    let devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          console.warn('Developer tools detected');
          // Could log this as a security event
          // logSecurityEvent('devtools_opened');
        }
      } else {
        devtools.open = false;
      }
    };

    // Check periodically for developer tools
    const interval = setInterval(detectDevTools, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

// Rate limiting for client-side actions
export const useRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const [attempts, setAttempts] = React.useState<number[]>([]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limited
    }
    
    return true; // Not rate limited
  };

  const recordAttempt = () => {
    const now = Date.now();
    setAttempts(prev => [...prev.filter(timestamp => now - timestamp < windowMs), now]);
  };

  const getRemainingAttempts = (): number => {
    const now = Date.now();
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    return Math.max(0, maxAttempts - validAttempts.length);
  };

  return {
    checkRateLimit,
    recordAttempt,
    getRemainingAttempts,
    isRateLimited: !checkRateLimit()
  };
};

export default SecurityHeaders;
