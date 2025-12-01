import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, Search, Filter, Calendar, ShoppingCart, 
  CreditCard, Clock, MapPin, Activity 
} from 'lucide-react';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { formatCurrency } from '@/utils/formatters';
import BookingModal from '@/components/BookingModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const HospitalEquipmentView = () => {
  const { equipment, loading, refetchEquipment } = useEquipmentData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.type === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const availableEquipment = filteredEquipment.filter(item => 
    ['available'].includes(item.type)
  );

  const categories = [...new Set(equipment.map(item => item.category).filter(Boolean))];

  const handleBookEquipment = (equipment) => {
    setSelectedEquipment(equipment);
    setBookingModalOpen(true);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'in-use':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'maintenance':
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
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Equipment Management</h1>
        </div>
        <p className="text-white/90">Browse, book, and manage medical equipment for your hospital</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Available Equipment</h3>
            <p className="text-2xl font-bold">{availableEquipment.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Categories</h3>
            <p className="text-2xl font-bold">{categories.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Quick Actions</h3>
            <div className="flex gap-2 mt-1">
              <Button size="sm" variant="secondary" className="text-xs">
                Book Now
              </Button>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <SelectItem value="In Use">In Use</SelectItem>
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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={getStatusColor(item.type)}>
                  {item.type}
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
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{item.location || 'Location not specified'}</span>
                </div>
              {item.payPerUseEnabled && item.payPerUsePrice && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Pay per use: {formatCurrency(item.payPerUsePrice)}/day</span>
                  </div>
                )}
                {item.leaseRate && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span>Lease: ${item.leaseRate}/month</span>
                  </div>
                )}
                {item.price && (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <span>Purchase: {formatCurrency(item.price)}</span>
                  </div>
                )}
              </div>

              {item.type === 'available' && (
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-[#E02020] hover:bg-[#c01c1c]"
                    onClick={() => handleBookEquipment(item)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Equipment
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    {item.price && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Purchase
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Purchase Equipment</DialogTitle>
                          </DialogHeader>
                          <div className="p-4">
                            <p>Purchase {item.name} for {formatCurrency(item.price || 0)}</p>
                            <Button className="w-full mt-4 bg-[#E02020]">
                              Proceed to Purchase
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {item.leaseRate && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Lease
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Lease Equipment</DialogTitle>
                          </DialogHeader>
                          <div className="p-4">
                            <p>Lease {item.name} for ${item.leaseRate}/month</p>
                            <Button className="w-full mt-4 bg-[#E02020]">
                              Start Lease Application
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              )}
              
              {item.type === 'in-use' && (
                <Button variant="outline" className="w-full" disabled>
                  <Activity className="h-4 w-4 mr-2" />
                  Currently In Use
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Equipment Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </Card>
      )}

      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal
          isOpen={bookingModalOpen}
          equipmentId={selectedEquipment.id}
          equipmentName={selectedEquipment.name}
          pricePerUse={selectedEquipment.payPerUsePrice || 0}
          onClose={() => setBookingModalOpen(false)}
          onConfirm={(date, duration, notes) => {
            console.log('Booking confirmed:', { equipment: selectedEquipment.name, date, duration, notes });
            setBookingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HospitalEquipmentView;