
// Tutorial step type definition
export type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'right' | 'bottom' | 'left';
};

// Hospital user tutorial steps
export const hospitalTutorialSteps: TutorialStep[] = [
  {
    id: 'hospital-welcome',
    title: 'Welcome to Your Hospital Dashboard',
    description: 'This is your central hub for managing medical equipment, bookings, and hospital resources.',
    targetSelector: '.hospital-dashboard-header',
    position: 'bottom',
  },
  {
    id: 'hospital-equipment',
    title: 'Equipment Management',
    description: 'Browse and manage your medical equipment inventory. Find equipment available for booking from other hospitals.',
    targetSelector: '[data-tab="equipment"]',
    position: 'bottom',
  },
  {
    id: 'hospital-bookings',
    title: 'Equipment Booking',
    description: 'Schedule and manage equipment bookings. View your upcoming reservations and booking history.',
    targetSelector: '[data-tab="bookings"]',
    position: 'bottom',
  },
  {
    id: 'hospital-analytics',
    title: 'Analytics Dashboard',
    description: 'Track equipment usage, costs, and performance metrics to optimize your hospital operations.',
    targetSelector: '[data-tab="analytics"]',
    position: 'bottom',
  },
  {
    id: 'hospital-financing',
    title: 'Financing Options',
    description: 'Explore financing options for new equipment purchases, including leasing and investment opportunities.',
    targetSelector: '[data-tab="financing"]',
    position: 'bottom',
  },
  {
    id: 'hospital-shop',
    title: 'Medical Shop',
    description: 'Shop for new equipment directly from manufacturers and distributors.',
    targetSelector: '[data-tab="shop"]',
    position: 'bottom',
  }
];

// Manufacturer user tutorial steps
export const manufacturerTutorialSteps: TutorialStep[] = [
  {
    id: 'manufacturer-welcome',
    title: 'Welcome to Your Manufacturer Dashboard',
    description: 'Your central hub for managing product listings, virtual shops, and tracking sales across hospital networks.',
    targetSelector: '.manufacturer-dashboard-header',
    position: 'bottom',
  },
  {
    id: 'manufacturer-stats',
    title: 'Performance Overview',
    description: 'Monitor your key metrics including total sales, active equipment listings, and overall market performance.',
    targetSelector: '.stats-cards-section',
    position: 'bottom',
  },
  {
    id: 'manufacturer-shops',
    title: 'Virtual Shops Management',
    description: 'Create and manage virtual shops to organize your products by region, category, or hospital cluster.',
    targetSelector: '.virtual-shops-section',
    position: 'top',
  },
  {
    id: 'manufacturer-products',
    title: 'Product Management',
    description: 'Add, update, and track your medical equipment offerings across different markets.',
    targetSelector: '[data-tab="products"]',
    position: 'bottom',
  },
  {
    id: 'manufacturer-analytics',
    title: 'Sales Analytics',
    description: 'Analyze sales patterns, equipment popularity, and market trends to optimize your business strategy.',
    targetSelector: '[data-tab="analytics"]',
    position: 'bottom',
  },
  {
    id: 'manufacturer-payments',
    title: 'Payment Processing',
    description: 'Track incoming payments, manage invoices, and view your financial transactions.',
    targetSelector: '[data-tab="payments"]',
    position: 'bottom',
  }
];

// Investor user tutorial steps
export const investorTutorialSteps: TutorialStep[] = [
  {
    id: 'investor-welcome',
    title: 'Welcome to Your Investor Dashboard',
    description: 'Your hub for managing medical equipment investments, tracking ROI, and exploring new opportunities.',
    targetSelector: '.investor-dashboard-header',
    position: 'bottom',
  },
  {
    id: 'investor-wallet',
    title: 'Investment Wallet',
    description: 'Track your available balance, total investments, and returns on your portfolio.',
    targetSelector: '.wallet-balance-card',
    position: 'bottom',
  },
  {
    id: 'investor-portfolio',
    title: 'Investment Portfolio',
    description: 'View and manage your current investments across different hospitals and equipment types.',
    targetSelector: '[data-tab="portfolio"]',
    position: 'bottom',
  },
  {
    id: 'investor-requests',
    title: 'Funding Requests',
    description: 'Review and approve funding requests from hospitals seeking equipment financing.',
    targetSelector: '[data-tab="requests"]',
    position: 'bottom',
  },
  {
    id: 'investor-opportunities',
    title: 'Investment Opportunities',
    description: 'Discover new investment opportunities with detailed ROI projections and risk assessments.',
    targetSelector: '[data-tab="opportunities"]',
    position: 'bottom',
  },
  {
    id: 'investor-analytics',
    title: 'Investment Analytics',
    description: 'Track performance metrics, ROI trends, and portfolio distribution to optimize your investment strategy.',
    targetSelector: '[data-tab="analytics"]',
    position: 'bottom',
  }
];
