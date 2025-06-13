
import React from 'react';
import { Search } from 'lucide-react';

interface SearchHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchHero = ({ searchTerm, onSearchChange }: SearchHeroProps) => {
  return (
    <div className="text-center py-12 bg-gradient-to-r from-red-50 via-white to-red-50 rounded-2xl border border-red-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Find the Perfect Medical Equipment
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover high-quality medical supplies and equipment from trusted manufacturers worldwide
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for medical supplies, equipment, or manufacturers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
