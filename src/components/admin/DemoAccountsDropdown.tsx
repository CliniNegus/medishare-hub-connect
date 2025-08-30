import React, { useState } from 'react';
import { ChevronDown, Monitor, Building2, Factory, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { supabase } from '@/integrations/supabase/client';

interface DemoRole {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

const DEMO_ROLES: DemoRole[] = [
  {
    key: 'hospital',
    label: 'Hospital Dashboard',
    description: 'View hospital equipment management',
    icon: Monitor,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    key: 'investor', 
    label: 'Investor Dashboard',
    description: 'View investment portfolio',
    icon: Building2,
    gradient: 'from-green-500 to-green-600'
  },
  {
    key: 'manufacturer',
    label: 'Manufacturer Dashboard', 
    description: 'View equipment catalog',
    icon: Factory,
    gradient: 'from-purple-500 to-purple-600'
  }
];

interface DemoAccountsDropdownProps {
  isLoading: boolean;
  onRoleSelect: (role: string) => Promise<void>;
}

const DemoAccountsDropdown: React.FC<DemoAccountsDropdownProps> = ({ 
  isLoading, 
  onRoleSelect 
}) => {
  const { toast } = useToast();

  const handleRoleClick = async (role: string) => {
    try {
      await onRoleSelect(role);
    } catch (error) {
      console.error('Error selecting demo role:', error);
      toast({
        title: "Error",
        description: "Failed to open demo dashboard",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-gray-200/50">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-200">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                Preview Dashboard as Role
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Demo dashboards for each user type
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2">
            Demo Dashboards (Read-Only)
          </div>
          {DEMO_ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <DropdownMenuItem
                key={role.key}
                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRoleClick(role.key)}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${role.gradient} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {role.label}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {role.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DemoAccountsDropdown;