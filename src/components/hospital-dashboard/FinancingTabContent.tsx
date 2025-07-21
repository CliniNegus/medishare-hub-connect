
import React, { useState, useEffect } from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, FileText, Download, DollarSign, TrendingUp, Calculator, Plus, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useRealTimeLeases } from '@/hooks/use-real-time-leases';
import { useLeaseAnalytics } from '@/hooks/use-lease-analytics';
import PaymentProcessing from '../financial/PaymentProcessing';
import FinancialReporting from '../financial/reporting/FinancialReporting';
import InvoiceGeneration from '../financial/InvoiceGeneration';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FinancingTabContentProps {
  equipmentData: EquipmentProps[];
}

const FinancingTabContent: React.FC<FinancingTabContentProps> = ({ equipmentData }) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("overview");
  const [realEquipment, setRealEquipment] = useState<any[]>([]);
  const [isCreatingLease, setIsCreatingLease] = useState(false);
  
  const { transactions, metrics, loading, refreshData } = useFinancialData();
  const { leases, loading: leasesLoading, refetch: refetchLeases } = useRealTimeLeases();
  const leaseAnalytics = useLeaseAnalytics(leases);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch real equipment from Supabase
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .eq('status', 'Available')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRealEquipment(data || []);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
  }, []);

  // Real financing options data with calculated pricing
  const financingOptions = [
    {
      id: 1,
      name: "Standard Lease",
      term: "36 months",
      interestRate: "5.9%",
      downPayment: "10%",
      monthlyPaymentPercent: 0.032,
      totalCostMultiplier: 1.17,
      bestFor: "General equipment with consistent usage",
      available: true
    },
    {
      id: 2,
      name: "Accelerated Acquisition",
      term: "24 months",
      interestRate: "6.5%",
      downPayment: "15%",
      monthlyPaymentPercent: 0.045,
      totalCostMultiplier: 1.08,
      bestFor: "Rapidly depreciating technology",
      available: true
    },
    {
      id: 3,
      name: "Extended Financing",
      term: "60 months",
      interestRate: "7.2%",
      downPayment: "5%",
      monthlyPaymentPercent: 0.019,
      totalCostMultiplier: 1.14,
      bestFor: "High value equipment with long service life",
      available: true
    }
  ];

  const handleApplyForFinancing = async (optionId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for financing.",
        variant: "destructive",
      });
      return;
    }

    const option = financingOptions.find(opt => opt.id === optionId);
    
    try {
      // Create a support request for financing application
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user.id,
          subject: `Financing Application - ${option?.name}`,
          message: `I would like to apply for the ${option?.name} financing option. 
                   Term: ${option?.term}
                   Interest Rate: ${option?.interestRate}
                   Down Payment: ${option?.downPayment}
                   Please contact me with more details and next steps.`,
          priority: 'high',
          tags: ['financing', 'equipment', 'lease']
        });

      if (error) throw error;

      toast({
        title: "Financing Application Submitted",
        description: `Your application for ${option?.name} has been submitted successfully. A finance advisor will contact you within 24 hours.`,
      });
    } catch (error: any) {
      console.error('Error submitting financing application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit financing application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRequestQuote = async (equipmentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request a quote.",
        variant: "destructive",
      });
      return;
    }

    const equipment = realEquipment.find(eq => eq.id === equipmentId);
    
    try {
      // Create a support request for quote
      const { error } = await supabase
        .from('support_requests')
        .insert({
          user_id: user.id,
          subject: `Equipment Quote Request - ${equipment?.name}`,
          message: `I would like to request a detailed quote for:
                   Equipment: ${equipment?.name}
                   Manufacturer: ${equipment?.manufacturer || 'Not specified'}
                   Category: ${equipment?.category || 'Not specified'}
                   
                   Please provide financing options and terms.`,
          priority: 'normal',
          tags: ['quote', 'equipment', 'financing']
        });

      if (error) throw error;

      toast({
        title: "Quote Request Submitted",
        description: `Quote request for ${equipment?.name} has been submitted. You'll receive a detailed quote within 2 business days.`,
      });
    } catch (error: any) {
      console.error('Error submitting quote request:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateLease = async (equipmentId: string, financingOption: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a lease.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingLease(true);
    
    try {
      const equipment = realEquipment.find(eq => eq.id === equipmentId);
      if (!equipment || !equipment.price) {
        throw new Error('Equipment price not available');
      }

      const equipmentPrice = Number(equipment.price);
      const monthlyPayment = equipmentPrice * financingOption.monthlyPaymentPercent;
      const totalValue = equipmentPrice * financingOption.totalCostMultiplier;
      const termMonths = parseInt(financingOption.term);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + termMonths);

      const { error } = await supabase
        .from('leases')
        .insert({
          equipment_id: equipmentId,
          hospital_id: user.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          monthly_payment: monthlyPayment,
          total_value: totalValue,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Lease Created",
        description: `Lease agreement for ${equipment.name} has been created and is pending approval.`,
      });

      refetchLeases();
    } catch (error: any) {
      console.error('Error creating lease:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create lease. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLease(false);
    }
  };

  const handleExportFinancialData = async () => {
    try {
      // Create CSV data from transactions and leases
      const csvData = [
        ['Type', 'Reference', 'Amount', 'Status', 'Date'],
        ...transactions.map(t => ['Transaction', t.reference, t.amount, t.status, t.created_at]),
        ...leases.map(l => ['Lease', `LEASE-${l.id.slice(0, 8)}`, l.monthly_payment, l.status, l.created_at])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Your financial report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export financial data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#E02020]">Financial Management</h2>
          <p className="text-gray-600">Manage payments, invoices, financing, and financial reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white" onClick={handleExportFinancialData}>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-[#E02020] hover:bg-[#c01c1c]" onClick={refreshData}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">Ksh {(metrics.totalRevenue * 130).toLocaleString()}</div>
            <p className="text-xs text-gray-500">From successful transactions</p>
          </CardContent>
        </Card>
        
        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">{metrics.activeLeases}</div>
            <p className="text-xs text-gray-500">Equipment under lease</p>
          </CardContent>
        </Card>
        
        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">{metrics.pendingInvoices}</div>
            <p className="text-xs text-gray-500">Ksh {(metrics.pendingInvoicesAmount * 130).toLocaleString()} outstanding</p>
          </CardContent>
        </Card>
        
        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">Ksh {(metrics.cashFlow * 130).toLocaleString()}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeFinanceTab} onValueChange={setActiveFinanceTab} className="w-full">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financing" className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
            <Calculator className="h-4 w-4 mr-2" />
            Equipment Financing
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Processing
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-[#E02020] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Invoice Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card className="border-[#E02020]/20">
              <CardHeader>
                <CardTitle className="text-[#333333]">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-[#333333]">{transaction.reference}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#E02020]">Ksh {(transaction.amount * 130).toLocaleString()}</p>
                          <Badge 
                            className={`text-xs ${
                              transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="border-[#E02020]/20">
              <CardHeader>
                <CardTitle className="text-[#333333]">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-[#E02020] mr-3" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-gray-500">Direct bank payments</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-[#E02020] mr-3" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-sm text-gray-500">M-Pesa, Airtel Money</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-[#E02020] mr-3" />
                      <div>
                        <p className="font-medium">Credit/Debit Cards</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financing" className="mt-4">
          <div className="space-y-6">
            {/* Financing Options */}
            <Card className="border-[#E02020]/20">
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-[#E02020]" />
                  Equipment Financing Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Interest Rate</TableHead>
                      <TableHead>Down Payment</TableHead>
                      <TableHead>Monthly Payment</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Best For</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financingOptions.map(option => (
                      <TableRow key={option.id}>
                        <TableCell className="font-medium">{option.name}</TableCell>
                        <TableCell>{option.term}</TableCell>
                        <TableCell>{option.interestRate}</TableCell>
                        <TableCell>{option.downPayment}</TableCell>
                        <TableCell>{(option.monthlyPaymentPercent * 100).toFixed(1)}% of price</TableCell>
                        <TableCell>{(option.totalCostMultiplier * 100).toFixed(0)}% of price</TableCell>
                        <TableCell className="text-sm">{option.bestFor}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            className="bg-[#E02020] hover:bg-[#c01c1c]"
                            onClick={() => handleApplyForFinancing(option.id)}
                          >
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Equipment Available for Financing */}
            <Card className="border-[#E02020]/20">
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center justify-between">
                  Equipment Available for Financing
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = '/equipment-management'}
                    className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {realEquipment.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No equipment available for financing</p>
                    <p className="text-sm text-gray-400">Equipment will appear here when available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {realEquipment.slice(0, 6).map(equipment => {
                      const equipmentPrice = Number(equipment.price) || 0;
                      const estimatedMonthly = equipmentPrice * 0.032; // Standard lease rate
                      
                      return (
                        <div key={equipment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-[#333333]">{equipment.name}</h3>
                              <p className="text-sm text-gray-600">{equipment.manufacturer || 'Not specified'}</p>
                              <Badge variant="outline" className="mt-1 text-xs">{equipment.category || 'General'}</Badge>
                            </div>
                            <Badge className="bg-green-100 text-green-800">{equipment.status}</Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Purchase Price:</span>
                              <span className="font-medium text-[#333333]">
                                {equipmentPrice > 0 ? `Ksh ${equipmentPrice.toLocaleString()}` : 'Contact for price'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Est. Monthly:</span>
                              <span className="font-medium text-[#E02020]">
                                {equipmentPrice > 0 ? `Ksh ${estimatedMonthly.toLocaleString()}` : 'TBD'}
                              </span>
                            </div>
                            {equipment.location && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Location:</span>
                                <span className="text-sm text-gray-600">{equipment.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Button 
                              className="w-full bg-[#E02020] hover:bg-[#c01c1c]"
                              onClick={() => handleRequestQuote(equipment.id)}
                            >
                              Request Quote
                            </Button>
                            {equipmentPrice > 0 && (
                              <Button 
                                variant="outline"
                                className="w-full border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
                                onClick={() => handleCreateLease(equipment.id, financingOptions[0])}
                                disabled={isCreatingLease}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Lease
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Leases */}
            <Card className="border-[#E02020]/20">
              <CardHeader>
                <CardTitle className="text-[#333333] flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#E02020]" />
                  Your Current Leases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leasesLoading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020] mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading leases...</p>
                  </div>
                ) : leases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No active leases</p>
                    <p className="text-sm text-gray-400">Your equipment leases will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leases.slice(0, 5).map((lease) => (
                      <div key={lease.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-[#333333]">{lease.equipment?.name || 'Unknown Equipment'}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">{lease.equipment?.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#E02020]">Ksh {lease.monthly_payment.toLocaleString()}/month</p>
                          <Badge 
                            className={`text-xs ${
                              lease.status === 'active' ? 'bg-green-100 text-green-800' :
                              lease.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {lease.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-4 shadow-sm rounded-lg">
          <PaymentProcessing equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="reports" className="mt-4 shadow-sm rounded-lg">
          <FinancialReporting />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4 shadow-sm rounded-lg">
          <InvoiceGeneration equipmentData={equipmentData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancingTabContent;
