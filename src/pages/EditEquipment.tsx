
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EditEquipment = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#E02020]">Edit Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Editing equipment ID: {id}</p>
            <p className="text-gray-500 mt-4">Equipment editing functionality will be implemented soon.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditEquipment;
