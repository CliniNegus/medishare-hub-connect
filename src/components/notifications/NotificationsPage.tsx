
import React from 'react';
import { Bell } from 'lucide-react';
import Header from '@/components/Header';
import NotificationSystem from '@/components/communication/NotificationSystem';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-[#E02020]" />
            <h1 className="text-2xl font-bold text-[#333333]">All Notifications</h1>
          </div>
          
          <NotificationSystem />
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
