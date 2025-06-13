
import React, { useState } from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, FileText, Download, DollarSign, TrendingUp, Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFinancialData } from '@/hooks/useFinancialData';
import PaymentProcessing from '../financial/PaymentProcessing';
import FinancialReporting from '../financial/reporting/FinancialReporting';
import InvoiceGeneration from '../financial/InvoiceGeneration';
import { useToast } from '@/hooks/use-toast';

interface FinancingTabContentProps {
  equipmentData: EquipmentProps[];
}

const FinancingTabContent: React.FC<FinancingTabContentProps> = ({ equipmentData }) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("overview");
  const { transactions, metrics, loading, refreshData } = useFinancialData();
  const { toast } = useToast();

  // Mock financing options data with Ksh pricing
  const financingOptions = [
    {
      id: 1,
      name: "Standard Lease",
      term: "36 months",
      interestRate: "5.9%",
      downPayment: "10%",
      monthlyPayment: "Ksh 325,000",
      totalCost: "Ksh 11,700,000",
      bestFor: "General equipment with consistent usage",
      available: true
    },
    {
      id: 2,
      name: "Accelerated Acquisition",
      term: "24 months",
      interestRate: "6.5%",
      downPayment: "15%",
      monthlyPayment: "Ksh 494,000",
      totalCost: "Ksh 11,856,000",
      bestFor: "Rapidly depreciating technology",
      available: true
    },
    {
      id: 3,
      name: "Extended Financing",
      term: "60 months",
      interestRate: "7.2%",
      downPayment: "5%",
      monthlyPayment: "Ksh 214,500",
      totalCost: "Ksh 12,870,000",
      bestFor: "High value equipment with long service life",
      available: true
    }
  ];

  // Equipment available for financing with Ksh pricing
  const equipmentForFinancing = [
    {
      id: 1,
      name: "MRI Scanner - Premium Model",
      manufacturer: "MediTech Imaging",
      price: "Ksh 162,500,000",
      estimatedMonthly: "Ksh 2,925,000",
      category: "Imaging",
      available: true
    },
    {
      id: 2,
      name: "Surgical Robot System",
      manufacturer: "SurgicalBots Inc",
      price: "Ksh 116,350,000",
      estimatedMonthly: "Ksh 2,106,000",
      category: "Surgical",
      available: true
    },
    {
      id: 3,
      name: "CT Scanner - Advanced",
      manufacturer: "ClearView Medical",
      price: "Ksh 97,500,000",
      estimatedMonthly: "Ksh 1,755,000",
      category: "Imaging",
      available: true
    },
    {
      id: 4,
      name: "Ultrasound System - Professional",
      manufacturer: "SonoWave",
      price: "Ksh 16,250,000",
      estimatedMonthly: "Ksh 299,000",
      category: "Imaging",
      available: true
    }
  ];

  const handleApplyForFinancing = (optionId: number) => {
    const option = financingOptions.find(opt => opt.id === optionId);
    toast({
      title: "Financing Application Started",
      description: `Your application for ${option?.name} has been initiated. A finance advisor will contact you within 24 hours.`,
    });
  };

  const handleRequestQuote = (equipmentId: number) => {
    const equipment = equipmentForFinancing.find(eq => eq.id === equipmentId);
    toast({
      title: "Quote Request Submitted",
      description: `Quote request for ${equipment?.name} has been sent. You'll receive a detailed quote within 2 business days.`,
    });
  };

  const handleExportFinancialData = () => {
    toast({
      title: "Export Started",
      description: "Your financial reports are being prepared for download.",
    });
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
                        <TableCell>{option.monthlyPayment}</TableCell>
                        <TableCell>{option.totalCost}</TableCell>
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
                <CardTitle className="text-[#333333]">Equipment Available for Financing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipmentForFinancing.map(equipment => (
                    <div key={equipment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-[#333333]">{equipment.name}</h3>
                          <p className="text-sm text-gray-600">{equipment.manufacturer}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{equipment.category}</Badge>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Purchase Price:</span>
                          <span className="font-medium text-[#333333]">{equipment.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Est. Monthly:</span>
                          <span className="font-medium text-[#E02020]">{equipment.estimatedMonthly}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#E02020] hover:bg-[#c01c1c]"
                        onClick={() => handleRequestQuote(equipment.id)}
                      >
                        Request Quote
                      </Button>
                    </div>
                  ))}
                </div>
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
