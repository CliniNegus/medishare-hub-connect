
import React, { useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PiggyBank, ArrowUpRight, ArrowDownRight, TrendingUp,
  Briefcase, DollarSign, Building, FilePlus, BarChart2,
  Calendar, FileSpreadsheet, HelpCircle, Check, X, 
  Map, Hospital, Users, AlertCircle, FileText, LogOut, UserCog
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ChangeAccountTypeModal from "@/components/ChangeAccountTypeModal";
import InvestmentForm from "@/components/investment/InvestmentForm";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface Investment {
  id: string;
  hospital: string;
  equipment: string;
  amount: number;
  date: string;
  term: string;
  roi: number;
  status: 'active' | 'completed' | 'pending';
}

interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'return';
}

interface Opportunity {
  id: string;
  hospital: string;
  equipment: string;
  amount: number;
  term: string;
  estimatedRoi: number;
  risk: 'low' | 'medium' | 'high';
}

interface FundingRequest {
  id: string;
  hospital: string;
  cluster: string;
  equipment: string;
  amount: number;
  term: string;
  expectedRoi: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface HospitalCluster {
  id: string;
  name: string;
  location: string;
  hospitals: number;
  equipmentNeeds: string[];
  predictedValue: number;
}

const InvestorDashboard = () => {
  const stats = {
    totalInvested: 850000,
    activeInvestments: 18,
    averageRoi: 8.4,
    projectedEarnings: 71400,
    walletBalance: 123500
  };

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const walletTransactions: WalletTransaction[] = [
    {
      id: 'TRX-001',
      date: '2025-04-05',
      description: 'Investment Return - MRI Scanner',
      amount: 5750,
      type: 'return'
    },
    {
      id: 'TRX-002',
      date: '2025-04-02',
      description: 'Deposit from Bank Account',
      amount: 50000,
      type: 'deposit'
    },
    {
      id: 'TRX-003',
      date: '2025-03-28',
      description: 'New Investment - Patient Monitors',
      amount: 35000,
      type: 'withdrawal'
    },
    {
      id: 'TRX-004',
      date: '2025-03-25',
      description: 'Investment Return - CT Scanner',
      amount: 3850,
      type: 'return'
    },
    {
      id: 'TRX-005',
      date: '2025-03-20',
      description: 'Withdrawal to Bank Account',
      amount: 15000,
      type: 'withdrawal'
    }
  ];

  const opportunities: Opportunity[] = [
    {
      id: 'OPP-001',
      hospital: 'North Shore Medical',
      equipment: 'MRI Scanner Pro',
      amount: 275000,
      term: '36 months',
      estimatedRoi: 9.5,
      risk: 'low'
    },
    {
      id: 'OPP-002',
      hospital: 'Westside Health Center',
      equipment: 'Robotic Surgery System',
      amount: 420000,
      term: '48 months',
      estimatedRoi: 11.2,
      risk: 'high'
    },
    {
      id: 'OPP-003',
      hospital: 'Downtown Urgent Care',
      equipment: 'Diagnostic Lab Equipment',
      amount: 150000,
      term: '30 months',
      estimatedRoi: 8.7,
      risk: 'medium'
    }
  ];

  const fundingRequests: FundingRequest[] = [
    {
      id: 'FR-001',
      hospital: 'Memorial Medical Center',
      cluster: 'Northeast Medical Cluster',
      equipment: 'MRI Scanner X9',
      amount: 289000,
      term: '36 months',
      expectedRoi: 9.8,
      status: 'pending',
      date: '2025-04-10'
    },
    {
      id: 'FR-002',
      hospital: 'City General Hospital',
      cluster: 'West Coast Health Network',
      equipment: 'CT Scanner Ultra',
      amount: 185000,
      term: '24 months',
      expectedRoi: 8.5,
      status: 'pending',
      date: '2025-04-08'
    },
    {
      id: 'FR-003',
      hospital: 'University Hospital',
      cluster: 'Southern Medical Group',
      equipment: 'Robotic Surgery System',
      amount: 430000,
      term: '48 months',
      expectedRoi: 11.2,
      status: 'pending',
      date: '2025-04-05'
    }
  ];

  const hospitalClusters: HospitalCluster[] = [
    {
      id: 'CLST-001',
      name: 'Northeast Medical Cluster',
      location: 'Boston, MA',
      hospitals: 5,
      equipmentNeeds: ['MRI Scanner', 'Robotic Surgery System', 'Ultrasound Units'],
      predictedValue: 850000
    },
    {
      id: 'CLST-002',
      name: 'West Coast Health Network',
      location: 'San Francisco, CA',
      hospitals: 7,
      equipmentNeeds: ['CT Scanner', 'Patient Monitoring Systems', 'X-Ray Machines'],
      predictedValue: 1200000
    },
    {
      id: 'CLST-003',
      name: 'Southern Medical Group',
      location: 'Atlanta, GA',
      hospitals: 4,
      equipmentNeeds: ['Anesthesia Workstations', 'Diagnostic Equipment', 'ICU Beds'],
      predictedValue: 650000
    }
  ];

  const [activeTab, setActiveTab] = useState('portfolio');
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);
  const [changeAccountTypeOpen, setChangeAccountTypeOpen] = useState(false);
  const [dialogTabValue, setDialogTabValue] = useState('investment-form');

  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();

  // Fetch investments from Supabase
  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('investments')
          .select(`
            id, 
            amount, 
            date, 
            term, 
            roi, 
            status, 
            notes,
            hospitals:hospital_id(name),
            equipment:equipment_id(name)
          `)
          .eq('investor_id', user.id);
        
        if (error) throw error;
        
        const formattedInvestments = data.map(item => ({
          id: item.id,
          hospital: item.hospitals?.name || 'Unknown Hospital',
          equipment: item.equipment?.name || 'Unknown Equipment',
          amount: Number(item.amount),
          date: new Date(item.date).toISOString().split('T')[0],
          term: item.term,
          roi: Number(item.roi),
          status: (item.status as 'active' | 'completed' | 'pending')
        }));
        
        setInvestments(formattedInvestments);
      } catch (error) {
        console.error('Error fetching investments:', error);
        toast({
          title: 'Error loading investments',
          description: 'There was a problem loading your investments. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvestments();
  }, [user, toast]);

  // Fix: Update handler function to properly handle event types
  const handleApproveRequest = useCallback((requestId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Approved request: ${requestId}`);
  }, []);

  const handleRejectRequest = useCallback((requestId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Rejected request: ${requestId}`);
  }, []);

  const handleSignOut = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
        duration: 3000, // Reduced from default for better UX
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [signOut, toast]);

  const handleChangeAccountType = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setChangeAccountTypeOpen(true);
  }, []);

  const handleInvestmentSuccess = () => {
    setInvestmentDialogOpen(false);
    toast({
      title: "Investment Created",
      description: "Your new investment has been created successfully",
      duration: 3000,
    });
    // Refresh investments after successful creation
    if (user) {
      supabase
        .from('investments')
        .select(`
          id, 
          amount, 
          date, 
          term, 
          roi, 
          status, 
          notes,
          hospitals:hospital_id(name),
          equipment:equipment_id(name)
        `)
        .eq('investor_id', user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching investments:', error);
            return;
          }
          
          if (data) {
            const formattedInvestments = data.map(item => ({
              id: item.id,
              hospital: item.hospitals?.name || 'Unknown Hospital',
              equipment: item.equipment?.name || 'Unknown Equipment',
              amount: Number(item.amount),
              date: new Date(item.date).toISOString().split('T')[0],
              term: item.term,
              roi: Number(item.roi),
              status: (item.status as 'active' | 'completed' | 'pending')
            }));
            
            setInvestments(formattedInvestments);
          }
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8 investor-dashboard-header">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Investor Dashboard</h1>
          {profile && (
            <p className="text-gray-600">
              {profile.full_name || user?.email} {profile.organization && `• ${profile.organization}`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={handleChangeAccountType}
          >
            <UserCog className="h-4 w-4 mr-2" />
            Change Account Type
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          
          <Dialog open={investmentDialogOpen} onOpenChange={setInvestmentDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={(e) => {
                  e.preventDefault(); 
                  setDialogTabValue('investment-form');
                  setInvestmentDialogOpen(true);
                }}
                className="bg-[#E02020] hover:bg-[#C01010] text-white"
              >
                <FilePlus className="mr-2 h-4 w-4" />
                New Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>New Investment</DialogTitle>
                <DialogDescription>
                  Create a new investment or browse investment opportunities.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Tabs defaultValue={dialogTabValue} value={dialogTabValue} onValueChange={setDialogTabValue} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="investment-form">
                      <FilePlus className="h-4 w-4 mr-2" />
                      Create Investment
                    </TabsTrigger>
                    <TabsTrigger value="requests">
                      <FileText className="h-4 w-4 mr-2" />
                      Funding Requests
                    </TabsTrigger>
                    <TabsTrigger value="clusters">
                      <Map className="h-4 w-4 mr-2" />
                      Hospital Clusters
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="investment-form">
                    <InvestmentForm 
                      onSuccess={handleInvestmentSuccess}
                      onCancel={() => setInvestmentDialogOpen(false)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="requests">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Hospital</TableHead>
                            <TableHead>Equipment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Term</TableHead>
                            <TableHead>Expected ROI</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fundingRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{request.hospital}</div>
                                  <div className="text-xs text-gray-500">{request.cluster}</div>
                                </div>
                              </TableCell>
                              <TableCell>{request.equipment}</TableCell>
                              <TableCell>${request.amount.toLocaleString()}</TableCell>
                              <TableCell>{request.term}</TableCell>
                              <TableCell>
                                <span className="text-green-600 font-medium">{request.expectedRoi}%</span>
                              </TableCell>
                              <TableCell>{request.date}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={(e) => handleApproveRequest(request.id, e)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={(e) => handleRejectRequest(request.id, e)}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="clusters">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospitalClusters.map((cluster) => (
                        <Card key={cluster.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle>{cluster.name}</CardTitle>
                            <CardDescription>{cluster.location} • {cluster.hospitals} hospitals</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div>
                                <div className="text-sm font-medium">Equipment Needs:</div>
                                <ul className="text-sm list-disc list-inside">
                                  {cluster.equipmentNeeds.map((need, idx) => (
                                    <li key={idx}>{need}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex justify-between items-center pt-2">
                                <div>
                                  <div className="text-sm font-medium">Predicted Value:</div>
                                  <div className="text-xl font-bold text-green-600">${cluster.predictedValue.toLocaleString()}</div>
                                </div>
                                <Button 
                                  onClick={() => {
                                    setDialogTabValue('investment-form');
                                    toast({
                                      title: "Cluster Selected",
                                      description: `Preparing investment for ${cluster.name}`,
                                    });
                                  }}
                                  className="bg-[#E02020] hover:bg-[#C01010] text-white"
                                >
                                  Invest in Cluster
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-8 wallet-balance-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold">Wallet Balance</CardTitle>
            <CardDescription>Available funds for investment</CardDescription>
          </div>
          <PiggyBank className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold">${stats.walletBalance.toLocaleString()}</div>
            <Button variant="outline" className="ml-auto" size="sm">
              <DollarSign className="h-4 w-4 mr-2" />
              Manage Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalInvested / 1000).toFixed(0)}k</div>
            <p className="text-xs text-gray-500">Across {stats.activeInvestments} active investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRoi}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>0.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projected Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.projectedEarnings / 1000).toFixed(1)}k</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>Next 12 months</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hospital Partners</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Across 8 regions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="portfolio" className="text-sm" data-tab="portfolio">
            <Briefcase className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="requests" className="text-sm" data-tab="requests">
            <AlertCircle className="h-4 w-4 mr-2" />
            Funding Requests
          </TabsTrigger>
          <TabsTrigger value="wallet" className="text-sm" data-tab="wallet">
            <PiggyBank className="h-4 w-4 mr-2" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="text-sm" data-tab="opportunities">
            <TrendingUp className="h-4 w-4 mr-2" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm" data-tab="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Investment Portfolio</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button 
                  size="sm"
                  className="bg-[#E02020] hover:bg-[#C01010] text-white"
                  onClick={() => {
                    setDialogTabValue('investment-form');
                    setInvestmentDialogOpen(true);
                  }}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  New Investment
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading investments...</p>
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <FilePlus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Investments Yet</h3>
                <p className="text-gray-500 mb-4">Start investing to see your portfolio grow</p>
                <Button 
                  onClick={() => {
                    setDialogTabValue('investment-form');
                    setInvestmentDialogOpen(true);
                  }}
                  className="bg-[#E02020] hover:bg-[#C01010] text-white"
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Create First Investment
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Investment Date</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.id.substring(0, 8)}</TableCell>
                      <TableCell>{investment.hospital}</TableCell>
                      <TableCell>{investment.equipment}</TableCell>
                      <TableCell>${investment.amount.toLocaleString()}</TableCell>
                      <TableCell>{investment.date}</TableCell>
                      <TableCell>{investment.term}</TableCell>
                      <TableCell>{investment.roi}%</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${investment.status === 'active' ? 'bg-green-100 text-green-800' : 
                            investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Hospital Funding Requests</h2>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Cluster</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Expected ROI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.hospital}</TableCell>
                    <TableCell>{request.cluster}</TableCell>
                    <TableCell>{request.equipment}</TableCell>
                    <TableCell>${request.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{request.expectedRoi}%</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => handleApproveRequest(request.id, e)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={(e) => handleRejectRequest(request.id, e)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Wallet Transactions</h2>
              <div className="flex space-x-2">
                <Button>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                          transaction.type === 'return' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Investment Opportunities</h2>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                How It Works
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Est. ROI</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.id}</TableCell>
                    <TableCell>{opportunity.hospital}</TableCell>
                    <TableCell>{opportunity.equipment}</TableCell>
                    <TableCell>${opportunity.amount.toLocaleString()}</TableCell>
                    <TableCell>{opportunity.term}</TableCell>
                    <TableCell>{opportunity.estimatedRoi}%</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${opportunity.risk === 'low' ? 'bg-green-100 text-green-800' : 
                          opportunity.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {opportunity.risk.charAt(0).toUpperCase() + opportunity.risk.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button size="sm">Invest</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Investment Analytics</h2>
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Analytics charts would be displayed here in a real implementation.</p>
                <p className="text-gray-500 text-sm mt-2">Including ROI trends, investment distribution, and performance metrics.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add the ChangeAccountTypeModal */}
      <ChangeAccountTypeModal 
        open={changeAccountTypeOpen} 
        onOpenChange={setChangeAccountTypeOpen} 
      />
    </div>
  );
};

export default InvestorDashboard;
