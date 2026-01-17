import React, { useEffect } from 'react';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout wrapper for marketing/public pages that forces light mode
 * Prevents dark mode leakage from dashboard pages
 */
const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Force light mode for marketing pages
    const root = document.documentElement;
    const hadDarkClass = root.classList.contains('dark');
    root.classList.remove('dark');
    
    return () => {
      // Restore saved preference when leaving marketing pages
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || hadDarkClass) {
        root.classList.add('dark');
      }
    };
  }, []);

  return <>{children}</>;
};

export default MarketingLayout;
