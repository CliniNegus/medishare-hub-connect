
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, BarChart2, Zap, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import AddUserModal from './AddUserModal';
import ScheduleMaintenanceModal from './maintenance/ScheduleMaintenanceModal';
import UserSelectModal from './UserSelectModal';
import ImpersonationConfirmModal from './ImpersonationConfirmModal';
import { useToast } from '@/hooks/use-toast';
import { useAuditLogger } from '@/hooks/useAuditLogger';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  organization: string;
  last_active: string;
}

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logAuditEvent } = useAuditLogger();
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isUserSelectModalOpen, setIsUserSelectModalOpen] = useState(false);
  const [isImpersonationModalOpen, setIsImpersonationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
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

  const handleViewUserDashboard = () => {
    setIsUserSelectModalOpen(true);
  };

  const handleUserSelected = async (user: UserProfile, mode: 'view' | 'impersonate') => {
    setSelectedUser(user);
    
    if (mode === 'impersonate') {
      setIsImpersonationModalOpen(true);
    } else {
      await handleViewDashboard(user, 'view');
    }
  };

  const handleConfirmImpersonation = async () => {
    if (selectedUser) {
      setIsImpersonationModalOpen(false);
      await handleViewDashboard(selectedUser, 'impersonate');
    }
  };

  const handleViewDashboard = async (user: UserProfile, mode: 'view' | 'impersonate') => {
    try {
      setIsNavigating(true);
      
      // Log the admin action
      await logAuditEvent(
        mode === 'view' ? 'ADMIN_VIEW_USER_DASHBOARD' : 'ADMIN_IMPERSONATE_USER',
        'user_management',
        user.id,
        null,
        {
          target_user_email: user.email,
          target_user_role: user.role,
          mode: mode
        }
      );

      toast({
        title: "Redirecting...",
        description: `${mode === 'view' ? 'Loading user dashboard (read-only)' : 'Starting impersonation session'}`,
      });

      // Navigate to the user dashboard view
      navigate(`/admin/view-dashboard/${user.id}?mode=${mode}&role=${user.role}`);
    } catch (error) {
      console.error('Error viewing user dashboard:', error);
      toast({
        title: "Navigation Error",
        description: "Failed to load user dashboard",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
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
    {
      title: "View User Dashboard",
      description: "Switch to user interface",
      icon: isNavigating ? Loader2 : BarChart2,
      action: handleViewUserDashboard,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      disabled: isNavigating,
    },
  ];
  
  return (
    <div className="bg-gradient-to-r from-white to-gray-50/50 p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-[#E02020] to-[#c01010] rounded-xl mr-3">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#333333]">Quick Actions</h2>
          <p className="text-sm text-gray-500">Frequently used administrative tasks</p>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <div
              key={action.title}
              className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-gray-200/50'
              }`}
              onClick={action.disabled ? undefined : action.action}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-5 w-5 ${isNavigating && action.title === 'View User Dashboard' ? 'animate-spin' : ''}`} />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {action.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {action.description}
              </p>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
          );
        })}
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

      {/* User Select Modal */}
      <UserSelectModal
        open={isUserSelectModalOpen}
        onOpenChange={setIsUserSelectModalOpen}
        onUserSelected={handleUserSelected}
      />

      {/* Impersonation Confirmation Modal */}
      <ImpersonationConfirmModal
        open={isImpersonationModalOpen}
        onOpenChange={setIsImpersonationModalOpen}
        user={selectedUser}
        onConfirm={handleConfirmImpersonation}
      />
    </div>
  );
};

export default QuickActions;
