import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3, wide: 4 }
}) => {
  const gridClasses = [
    'grid gap-4',
    `grid-cols-${cols.mobile}`,
    cols.tablet && `sm:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`,
    cols.wide && `xl:grid-cols-${cols.wide}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;