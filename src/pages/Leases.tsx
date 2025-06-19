
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Leases = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#E02020]">Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Lease management functionality will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leases;
