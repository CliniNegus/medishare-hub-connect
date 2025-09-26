import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, Search, Plus, Edit, BarChart3, 
  DollarSign, TrendingUp, Settings, Eye
} from 'lucide-react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import PopularEquipmentSection from '@/components/dashboard/PopularEquipmentSection';
import AddEquipmentModal from '@/components/admin/equipment/AddEquipmentModal';
import EquipmentEditModal from '@/components/admin/equipment/EquipmentEditModal';
import EquipmentViewModal from '@/components/admin/equipment/EquipmentViewModal';

const ManufacturerEquipmentView = () => {
  const { equipment, loading } = useEquipmentData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Filter equipment by manufacturer - only show equipment owned by current user
  const manufacturerEquipment = equipment.filter(item => item.ownerId === user?.id);

  const filteredEquipment = manufacturerEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(manufacturerEquipment.map(item => item.category).filter(Boolean))];

  const stats = {
    total: manufacturerEquipment.length,
    available: manufacturerEquipment.filter(item => item.status === 'Available').length,
    leased: manufacturerEquipment.filter(item => item.status === 'Leased').length,
    maintenance: manufacturerEquipment.filter(item => item.status === 'Under Maintenance').length,
    totalRevenue: manufacturerEquipment.reduce((sum, item) => sum + (item.revenueGenerated || 0), 0),
    totalUsageHours: manufacturerEquipment.reduce((sum, item) => sum + (item.usageHours || 0), 0)
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setEditModalOpen(true);
  };

  const handleViewEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setViewModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Leased':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">My Equipment Portfolio</h1>
              <p className="text-white/90">Manage your equipment inventory and performance</p>
            </div>
          </div>
          <Button 
            onClick={() => setAddModalOpen(true)}
            className="bg-white text-[#E02020] hover:bg-white/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Total Equipment</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Available</h3>
            <p className="text-2xl font-bold">{stats.available}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Revenue Generated</h3>
            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Total Usage Hours</h3>
            <p className="text-2xl font-bold">{stats.totalUsageHours.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Leased">Leased</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Most Popular Equipment */}
      <PopularEquipmentSection />

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{item.category}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              
              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage Hours:</span>
                  <span className="font-medium">{item.usageHours || 0}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium text-green-600">${(item.revenueGenerated || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{item.type || 'N/A'}</span>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-2 text-sm">
                {item.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Purchase Price:</span>
                    <span className="font-medium">{formatCurrency(item.price)}</span>
                  </div>
                )}
                {item.leaseRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lease Rate:</span>
                    <span className="font-medium">${item.leaseRate}/month</span>
                  </div>
                )}
                {item.payPerUsePrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pay per Use:</span>
                    <span className="font-medium">{formatCurrency(item.payPerUsePrice)}/day</span>
                  </div>
                )}
              </div>

              {/* Action Buttons - Only show edit for owned equipment */}
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewEquipment(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {/* Only show edit button for equipment owned by current manufacturer */}
                {item.ownerId === user?.id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditEquipment(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Equipment Found</h3>
          <p className="text-gray-500 mb-4">
            {manufacturerEquipment.length === 0 
              ? "You haven't added any equipment yet." 
              : "Try adjusting your search criteria or filters"
            }
          </p>
          {manufacturerEquipment.length === 0 && (
            <Button onClick={() => setAddModalOpen(true)} className="bg-[#E02020]">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Equipment
            </Button>
          )}
        </Card>
      )}

      {/* Modals */}
      <AddEquipmentModal 
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      />
      
      {selectedEquipment && (
        <>
          <EquipmentEditModal
            equipment={selectedEquipment}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSave={async () => {
              setEditModalOpen(false);
              return selectedEquipment;
            }}
          />
          <EquipmentViewModal
            equipment={selectedEquipment}
            open={viewModalOpen}
            onOpenChange={setViewModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default ManufacturerEquipmentView;