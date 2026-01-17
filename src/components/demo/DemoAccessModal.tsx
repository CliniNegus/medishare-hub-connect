import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Hospital, Factory, TrendingUp, Loader2, Sparkles } from "lucide-react";

interface DemoAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DemoRole = 'hospital' | 'manufacturer' | 'investor';

const roleConfig = {
  hospital: {
    icon: Hospital,
    title: 'Hospital',
    description: 'Manage equipment, bookings, and supplies',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200 hover:border-blue-400',
  },
  manufacturer: {
    icon: Factory,
    title: 'Manufacturer',
    description: 'Manage products, orders, and virtual shops',
    color: 'text-[#E02020]',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200 hover:border-red-400',
  },
  investor: {
    icon: TrendingUp,
    title: 'Investor',
    description: 'View investments and funding opportunities',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    borderColor: 'border-green-200 hover:border-green-400',
  },
};

const DemoAccessModal: React.FC<DemoAccessModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<DemoRole | null>(null);

  const handleDemoLogin = async (role: DemoRole) => {
    setLoading(role);
    
    try {
      const { data, error } = await supabase.functions.invoke('demo-login', {
        body: { role }
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        // Set the session
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });

        toast({
          title: "Demo access granted",
          description: `You're now viewing the ${roleConfig[role].title} demo`,
        });

        onOpenChange(false);
        navigate('/dashboard');
      } else {
        throw new Error('No session returned from demo login');
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo access failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-[#E02020]" />
            Try CliniBuilds Demo
          </DialogTitle>
          <DialogDescription>
            Experience our platform with pre-loaded sample data. No account required.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {(Object.keys(roleConfig) as DemoRole[]).map((role) => {
            const config = roleConfig[role];
            const Icon = config.icon;
            const isLoading = loading === role;

            return (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={loading !== null}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200
                  ${config.bgColor} ${config.borderColor}
                  ${loading !== null && !isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  flex items-center gap-4 text-left
                `}
              >
                <div className={`p-3 rounded-lg bg-white shadow-sm ${config.color}`}>
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#333333]">{config.title}</h3>
                  <p className="text-sm text-[#333333]/70">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Demo accounts reset periodically. No real data is affected.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoAccessModal;
