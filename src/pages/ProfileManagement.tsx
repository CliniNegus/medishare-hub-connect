
import React from 'react';
import Layout from '@/components/Layout';
import ProfileForm from '@/components/profile/ProfileForm';

const ProfileManagement = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Profile Management</h1>
        <ProfileForm />
      </div>
    </Layout>
  );
};

export default ProfileManagement;
