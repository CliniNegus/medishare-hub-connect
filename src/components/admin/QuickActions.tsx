
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import AddUserModal from './AddUserModal';
import ScheduleMaintenanceModal from './maintenance/ScheduleMaintenanceModal';
import DemoAccountsDropdown from './DemoAccountsDropdown';
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';
import { supabase } from '@/integrations/supabase/client';

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logAuditEvent } = useAuditLogger();
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const handleAddEquipmentClick = () => {
    setIsEquipmentModalOpen(true);
  };
  
  const handleEquipmentAdded = () => {
    console.log('Equipment added successfully');
    toast({
      title: "Success",
      description: "Equipment added successfully",
    });
  };

  const handleUserAdded = () => {
    console.log('User added successfully');
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const handleMaintenanceScheduled = () => {
    console.log('Maintenance scheduled successfully');
    toast({
      title: "Success",
      description: "Maintenance scheduled successfully",
    });
  };

  const handleDemoRoleSelect = async (role: string) => {
    try {
      setIsDemoLoading(true);
      
      // Log the admin action
      await logAuditEvent(
        'ADMIN_DEMO_SESSION_CREATED',
        'demo_session',
        null,
        null,
        { demo_role: role }
      );

      // Call the demo login edge function
      const { data, error } = await supabase.functions.invoke('demo-login', {
        body: { role }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Opening Demo Dashboard...",
        description: `Loading ${role} dashboard in new tab`,
      });

      // Create a new window with demo session
      const demoWindow = window.open('about:blank', '_blank');
      if (demoWindow) {
        // Set the demo session in the new window's localStorage
        demoWindow.localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        
        // Navigate to the appropriate dashboard
        const dashboardRoute = role === 'hospital' ? '/hospital' : 
                              role === 'investor' ? '/investor' : 
                              '/manufacturer';
        
        demoWindow.location.href = `${window.location.origin}${dashboardRoute}?demo=true`;
      }

    } catch (error) {
      console.error('Error creating demo session:', error);
      toast({
        title: "Demo Error",
        description: "Failed to create demo session",
        variant: "destructive",
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Add Equipment",
      description: "Register new medical equipment",
      icon: PlusCircle,
      action: handleAddEquipmentClick,
      gradient: "from-[#E02020] to-[#c01010]",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      title: "Add User Account",
      description: "Create new user accounts",
      icon: Users,
      action: () => setIsUserModalOpen(true),
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Schedule Maintenance",
      description: "Plan equipment maintenance",
      icon: Clock,
      action: () => setIsMaintenanceModalOpen(true),
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
  ];
  
  return (
    <div className="bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-[#E02020] to-[#c01010] rounded-xl mr-3">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#333333]">Quick Actions</h2>
          <p className="text-xs sm:text-sm text-gray-500">Frequently used administrative tasks</p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <div
              key={action.title}
              className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} p-3 sm:p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-gray-200/50`}
              onClick={action.action}
            >
              {/* Icon */}
              <div className={`inline-flex p-2 sm:p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm text-responsive">
                {action.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed text-responsive">
                {action.description}
              </p>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-white/20 rounded-full -mr-8 sm:-mr-10 -mt-8 sm:-mt-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
          );
        })}
        
        {/* Demo Accounts Dropdown */}
        <DemoAccountsDropdown 
          isLoading={isDemoLoading}
          onRoleSelect={handleDemoRoleSelect}
        />
      </div>

      {/* Equipment Modal */}
      <AddEquipmentModal
        open={isEquipmentModalOpen}
        onOpenChange={setIsEquipmentModalOpen}
        onEquipmentAdded={handleEquipmentAdded}
      />

      {/* User Modal */}
      <AddUserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        onUserAdded={handleUserAdded}
      />

      {/* Maintenance Modal */}
      <ScheduleMaintenanceModal
        open={isMaintenanceModalOpen}
        onOpenChange={setIsMaintenanceModalOpen}
        onScheduled={handleMaintenanceScheduled}
      />

    </div>
  );
};

export default QuickActions;
