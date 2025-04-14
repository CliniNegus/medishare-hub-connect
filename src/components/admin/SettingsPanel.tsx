
import React from 'react';
import { Button } from "@/components/ui/button";

const SettingsPanel = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">System Settings</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">System Name</h4>
              <p className="text-sm text-gray-500">Name of the application</p>
            </div>
            <div className="text-right">
              <p className="font-medium">CliniBuilds</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Maintenance Reminder</h4>
              <p className="text-sm text-gray-500">Days before maintenance to send reminder</p>
            </div>
            <div className="text-right">
              <p className="font-medium">7 days</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">System Currency</h4>
              <p className="text-sm text-gray-500">Default currency for financial transactions</p>
            </div>
            <div className="text-right">
              <p className="font-medium">USD ($)</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">User Permissions</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Hospital Accounts</h4>
              <p className="text-sm text-gray-500">Default permissions for hospital users</p>
            </div>
            <div className="text-right">
              <p className="font-medium">View, Order, Manage Inventory</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Manufacturer Accounts</h4>
              <p className="text-sm text-gray-500">Default permissions for manufacturer users</p>
            </div>
            <div className="text-right">
              <p className="font-medium">View, Manage Products, Maintenance</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
            <div>
              <h4 className="font-medium">Investor Accounts</h4>
              <p className="text-sm text-gray-500">Default permissions for investor users</p>
            </div>
            <div className="text-right">
              <p className="font-medium">View, Manage Investments</p>
              <Button variant="outline" size="sm" className="mt-2">Edit</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">System Maintenance</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">Database Backup</h4>
            <p className="text-sm text-gray-500 mb-4">Last backup: 2025-04-12 06:00 AM</p>
            <Button>Run Manual Backup</Button>
          </div>
          
          <div className="p-4 border rounded-md">
            <h4 className="font-medium mb-2">System Logs</h4>
            <p className="text-sm text-gray-500 mb-4">View and download system logs for troubleshooting</p>
            <Button>View System Logs</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
