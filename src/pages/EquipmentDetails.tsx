
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EquipmentDetails = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#E02020]">Equipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Equipment ID: {id}</p>
            <p className="text-gray-500 mt-4">Equipment details will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EquipmentDetails;
