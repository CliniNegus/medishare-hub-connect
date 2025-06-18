
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#E02020]">About Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">About us content will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutUsPage;
