import React, { useState } from 'react';
import { ChevronDown, Stethoscope, Package, Wrench, Monitor, Eye, Bandage, Scissors, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryNavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MEDICAL_DEVICES = [
  { name: 'Wound Care Machines', icon: Bandage },
  { name: 'Surgical Machines', icon: Scissors },
  { name: 'Therapeutic Machines', icon: Stethoscope },
  { name: 'Theatre Machines', icon: Monitor },
  { name: 'Endoscopy & Minimally Invasive Systems', icon: Eye }
];

const MEDICAL_DISPOSABLES = [
  { name: 'Wound Care Dressings', icon: Bandage },
  { name: 'Surgical Disposables', icon: Scissors },
  { name: 'Orthopedic & Trauma Support Disposables', icon: Shield }
];

const CategoryNavigation = ({ selectedCategory, onCategoryChange }: CategoryNavigationProps) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'disposables' | null>(null);
  const [hoveredTab, setHoveredTab] = useState<'devices' | 'disposables' | null>(null);

  const handleTabClick = (tab: 'devices' | 'disposables') => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setActiveTab(null);
  };

  const isSelected = (category: string) => selectedCategory === category;

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Main Category Tabs */}
        <div className="flex">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
              selectedCategory === 'all' || selectedCategory === ''
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            All Products
          </button>

          {/* Medical Devices Tab */}
          <div className="relative">
            <button
              onClick={() => handleTabClick('devices')}
              onMouseEnter={() => setHoveredTab('devices')}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'devices' || MEDICAL_DEVICES.some(cat => isSelected(cat.name))
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              <Wrench className="h-4 w-4" />
              Medical Devices
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeTab === 'devices' ? "rotate-180" : ""
              )} />
            </button>

            {/* Medical Devices Dropdown */}
            {(activeTab === 'devices' || hoveredTab === 'devices') && (
              <div 
                className="absolute top-full left-0 bg-white border border-border shadow-lg rounded-md z-50 min-w-[280px]"
                onMouseEnter={() => setHoveredTab('devices')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="p-2">
                  {MEDICAL_DEVICES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategorySelect(category.name)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                          isSelected(category.name)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Medical Disposables Tab */}
          <div className="relative">
            <button
              onClick={() => handleTabClick('disposables')}
              onMouseEnter={() => setHoveredTab('disposables')}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'disposables' || MEDICAL_DISPOSABLES.some(cat => isSelected(cat.name))
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              <Package className="h-4 w-4" />
              Medical Disposables
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                activeTab === 'disposables' ? "rotate-180" : ""
              )} />
            </button>

            {/* Medical Disposables Dropdown */}
            {(activeTab === 'disposables' || hoveredTab === 'disposables') && (
              <div 
                className="absolute top-full left-0 bg-white border border-border shadow-lg rounded-md z-50 min-w-[280px]"
                onMouseEnter={() => setHoveredTab('disposables')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="p-2">
                  {MEDICAL_DISPOSABLES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategorySelect(category.name)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left",
                          isSelected(category.name)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Category Breadcrumb */}
        {selectedCategory && selectedCategory !== 'all' && selectedCategory !== '' && (
          <div className="px-6 py-2 bg-muted/30 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Category:</span>
              <span className="font-medium text-foreground">{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-2 text-xs text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNavigation;