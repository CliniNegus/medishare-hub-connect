
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Clock, BarChart2, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AddEquipmentModal from '@/components/equipment/AddEquipmentModal';
import AddUserModal from './AddUserModal';
import { useToast } from '@/hooks/use-toast';

const QuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
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
      action: () => {},
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "View User Dashboard",
      description: "Switch to user interface",
      icon: BarChart2,
      action: () => navigate('/dashboard'),
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
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
              className={`group relative overflow-hidden bg-gradient-to-br ${action.bgGradient} p-4 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
              onClick={action.action}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.gradient} text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-5 w-5" />
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
    </div>
  );
};

export default QuickActions;
