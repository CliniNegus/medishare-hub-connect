import React, { useState } from 'react';
import { ChevronDown, Stethoscope, Package, Wrench, Monitor, Eye, Bandage, Scissors, Shield, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryNavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MEDICAL_DEVICES = [
  { name: 'Wound Care Machines', icon: Bandage, count: 12 },
  { name: 'Surgical Machines', icon: Scissors, count: 8 },
  { name: 'Therapeutic Machines', icon: Stethoscope, count: 15 },
  { name: 'Theatre Machines', icon: Monitor, count: 6 },
  { name: 'Endoscopy & Minimally Invasive Systems', icon: Eye, count: 4 }
];

const MEDICAL_DISPOSABLES = [
  { name: 'Wound Care Dressings', icon: Bandage, count: 24 },
  { name: 'Surgical Disposables', icon: Scissors, count: 18 },
  { name: 'Orthopedic & Trauma Support Disposables', icon: Shield, count: 9 }
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
    <div className="bg-gradient-to-r from-background to-muted/20 border-b shadow-lg mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Category Tabs */}
        <div className="flex items-stretch">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              "px-8 py-6 text-base font-semibold border-b-3 transition-all duration-300 group relative overflow-hidden",
              selectedCategory === 'all' || selectedCategory === ''
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3">
              <Grid3x3 className="h-5 w-5" />
              <span>All Products</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>

          {/* Medical Devices Tab */}
          <div className="relative">
            <button
              onClick={() => handleTabClick('devices')}
              onMouseEnter={() => setHoveredTab('devices')}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "flex items-center gap-3 px-8 py-6 text-base font-semibold border-b-3 transition-all duration-300 group relative overflow-hidden",
                activeTab === 'devices' || MEDICAL_DEVICES.some(cat => isSelected(cat.name))
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <Wrench className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Medical Devices</span>
                <span className="text-xs text-muted-foreground font-normal">{MEDICAL_DEVICES.reduce((acc, cat) => acc + cat.count, 0)} items</span>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform duration-300",
                activeTab === 'devices' ? "rotate-180" : ""
              )} />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>

            {/* Medical Devices Dropdown */}
            {(activeTab === 'devices' || hoveredTab === 'devices') && (
              <div 
                className="absolute top-full left-0 bg-white border border-border shadow-xl rounded-lg z-50 min-w-[320px] animate-fade-in"
                onMouseEnter={() => setHoveredTab('devices')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-3 px-3">Medical Equipment Categories</div>
                  {MEDICAL_DEVICES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategorySelect(category.name)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 text-left group hover-scale",
                          isSelected(category.name)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-muted text-foreground hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-md transition-colors",
                            isSelected(category.name) ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
                          )}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                          {category.count}
                        </span>
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
                "flex items-center gap-3 px-8 py-6 text-base font-semibold border-b-3 transition-all duration-300 group relative overflow-hidden",
                activeTab === 'disposables' || MEDICAL_DISPOSABLES.some(cat => isSelected(cat.name))
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              <Package className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Medical Disposables</span>
                <span className="text-xs text-muted-foreground font-normal">{MEDICAL_DISPOSABLES.reduce((acc, cat) => acc + cat.count, 0)} items</span>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 transition-transform duration-300",
                activeTab === 'disposables' ? "rotate-180" : ""
              )} />
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>

            {/* Medical Disposables Dropdown */}
            {(activeTab === 'disposables' || hoveredTab === 'disposables') && (
              <div 
                className="absolute top-full left-0 bg-white border border-border shadow-xl rounded-lg z-50 min-w-[320px] animate-fade-in"
                onMouseEnter={() => setHoveredTab('disposables')}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <div className="p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-3 px-3">Disposable Product Categories</div>
                  {MEDICAL_DISPOSABLES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategorySelect(category.name)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-3 py-3 text-sm rounded-lg transition-all duration-200 text-left group hover-scale",
                          isSelected(category.name)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-muted text-foreground hover:shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-md transition-colors",
                            isSelected(category.name) ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
                          )}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                          {category.count}
                        </span>
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
          <div className="px-8 py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/20">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-muted-foreground">Viewing:</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-primary/20">
                <span className="font-semibold text-primary">{selectedCategory}</span>
                <button
                  onClick={() => onCategoryChange('all')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNavigation;