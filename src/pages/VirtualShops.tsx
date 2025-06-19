
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VirtualShops = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#E02020]">Virtual Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Virtual shops functionality will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VirtualShops;
