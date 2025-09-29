
import React from 'react';
import { Search } from 'lucide-react';

interface SearchHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchHero = ({ searchTerm, onSearchChange }: SearchHeroProps) => {
  return (
    <div className="text-center py-8 sm:py-12 bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-2xl border border-border mx-4 sm:mx-0">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Find the Perfect Medical Equipment
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
          Discover high-quality medical supplies and equipment from trusted manufacturers worldwide
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for medical supplies, equipment..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-input rounded-2xl focus:border-ring focus:ring-4 focus:ring-ring/20 transition-all duration-300 bg-background/80 backdrop-blur-sm text-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
