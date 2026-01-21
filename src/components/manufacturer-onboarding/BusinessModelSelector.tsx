import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Info, Package, RefreshCcw, ShoppingCart, Lock } from 'lucide-react';

export type BusinessModelType = 'consignment' | 'pay_per_use' | 'direct_purchase';

interface BusinessModel {
  id: BusinessModelType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

const BUSINESS_MODELS: BusinessModel[] = [
  {
    id: 'consignment',
    title: 'Consignment / Credit Stock',
    description: 'Equipment placed at hospital, payment occurs only when used.',
    icon: Package,
    details: [
      'Hospital holds inventory without upfront payment',
      'Manufacturer bills upon actual usage',
      'Ideal for high-value, variable-use equipment',
      'Reduces hospital procurement barriers',
    ],
  },
  {
    id: 'pay_per_use',
    title: 'Pay-per-Use / Leasing',
    description: 'Hospitals pay based on usage metrics or fixed lease terms.',
    icon: RefreshCcw,
    details: [
      'Recurring revenue model',
      'Usage-based or monthly fixed payments',
      'Great for equipment with measurable usage',
      'Lower upfront cost for hospitals',
    ],
  },
  {
    id: 'direct_purchase',
    title: 'Direct Purchase Orders',
    description: 'Traditional sales with upfront or delivery-based payment.',
    icon: ShoppingCart,
    details: [
      'Standard purchase order workflow',
      'Full payment on purchase or delivery',
      'Ownership transfers to hospital',
      'Simplest transaction model',
    ],
  },
];

interface BusinessModelSelectorProps {
  selectedModels: BusinessModelType[];
  onSelectionChange: (models: BusinessModelType[]) => void;
  isReadOnly?: boolean;
  stepNumber?: number;
  showHeader?: boolean;
}

const BusinessModelSelector: React.FC<BusinessModelSelectorProps> = ({
  selectedModels,
  onSelectionChange,
  isReadOnly = false,
  stepNumber,
  showHeader = true,
}) => {
  const handleToggle = (modelId: BusinessModelType) => {
    if (isReadOnly) return;
    
    if (selectedModels.includes(modelId)) {
      // Don't allow deselecting if it's the only one selected
      if (selectedModels.length > 1) {
        onSelectionChange(selectedModels.filter((id) => id !== modelId));
      }
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  const handleCheckboxChange = (modelId: BusinessModelType, checked: boolean) => {
    if (isReadOnly) return;
    
    if (checked) {
      if (!selectedModels.includes(modelId)) {
        onSelectionChange([...selectedModels, modelId]);
      }
    } else {
      // Only allow unchecking if there's more than one selected
      if (selectedModels.length > 1) {
        onSelectionChange(selectedModels.filter((id) => id !== modelId));
      }
    }
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {stepNumber && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Step {stepNumber}
              </Badge>
            )}
            Choose Your Business Model
            {isReadOnly && (
              <Badge variant="secondary" className="ml-2">
                <Lock className="h-3 w-3 mr-1" />
                Read Only
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            You can enable more than one business model.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {BUSINESS_MODELS.map((model) => {
          const Icon = model.icon;
          const isSelected = selectedModels.includes(model.id);
          
          return (
            <Card
              key={model.id}
              onClick={() => handleToggle(model.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
              } ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(model.id, checked as boolean)}
                    disabled={isReadOnly || (isSelected && selectedModels.length === 1)}
                    className={`mt-1 ${isSelected ? 'border-primary data-[state=checked]:bg-primary' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {model.title}
                      {isSelected && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Selected
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {model.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {isSelected && (
                <CardContent className="pt-0 pb-4">
                  <div className="ml-14 pl-4 border-l-2 border-primary/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      How it works
                    </p>
                    <ul className="space-y-1">
                      {model.details.map((detail, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {selectedModels.length === 0 && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <Info className="h-4 w-4" />
          Please select at least one business model to continue.
        </p>
      )}
    </div>
  );
};

export default BusinessModelSelector;
