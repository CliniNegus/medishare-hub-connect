import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHamburgerMenuProps {
  children: React.ReactNode;
  className?: string;
}

const MobileHamburgerMenu: React.FC<MobileHamburgerMenuProps> = ({ 
  children, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`lg:hidden ${className}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMenu}
          />
          
          {/* Sliding Menu */}
          <div className={`nav-mobile ${isOpen ? 'open' : 'closed'} bg-background shadow-xl z-50 lg:hidden`}>
            <div className="p-4">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Menu content */}
              <div onClick={closeMenu}>
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHamburgerMenu;