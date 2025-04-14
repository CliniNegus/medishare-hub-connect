
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, Bell, Calendar, Settings, 
  FileText, BarChart2, Clock, DollarSign
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, setActiveTab }: AdminSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 mr-2"></div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center p-2 rounded-md ${activeTab === 'overview' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`w-full flex items-center p-2 rounded-md ${activeTab === 'equipment' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <Package className="h-5 w-5 mr-3" />
              Equipment
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center p-2 rounded-md ${activeTab === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <Users className="h-5 w-5 mr-3" />
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center p-2 rounded-md ${activeTab === 'maintenance' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <Clock className="h-5 w-5 mr-3" />
              Maintenance
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center p-2 rounded-md ${activeTab === 'finance' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Finance
            </button>
          </li>
        </ul>
        <div className="pt-8 border-t border-gray-800 mt-8">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-2 rounded-md ${activeTab === 'settings' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center p-2 rounded-md hover:bg-gray-800"
              >
                <FileText className="h-5 w-5 mr-3" />
                Back to Home
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
