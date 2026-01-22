import React, { useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from './ThemeToggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PiggyBank, ArrowUpRight, ArrowDownRight, TrendingUp,
  Briefcase, DollarSign, Building, FilePlus, BarChart2,
  Calendar, FileSpreadsheet, HelpCircle, Check, X, 
  Map, Hospital, Users, AlertCircle, FileText, LogOut, UserCog,
  Sparkles, Activity, Target, Clock, Bell, Menu
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import InvestmentForm from "@/components/investment/InvestmentForm";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InvestorWallet from "@/components/InvestorWallet";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { AccountDeletionBanner } from './account/AccountDeletionBanner';
import { AccountSettingsModal } from './account/AccountSettingsModal';
import { InvestorClusterMapView } from './cluster-map';

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
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [dialogTabValue, setDialogTabValue] = useState('investment-form');

  const { profile, user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleApproveRequest = useCallback((requestId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Approved request: ${requestId}`);
  }, []);

  const handleRejectRequest = useCallback((requestId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Rejected request: ${requestId}`);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      console.log('Signing out investor...');
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [signOut, toast, navigate]);

  const handleChangeAccountType = useCallback(() => {
    setAccountSettingsOpen(true);
  }, []);

  const handleInvestmentSuccess = () => {
    setInvestmentDialogOpen(false);
    toast({
      title: "Investment Created",
      description: "Your new investment has been created successfully",
      duration: 3000,
    });
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

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'I';
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 w-full max-w-full overflow-x-hidden box-border">
      {/* Modern Hero Section with Streamlined Navbar */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white w-full">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 w-full max-w-full">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full">
              {/* Left Section - Brand and Welcome */}
              <div className="flex items-start min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">Investor Hub</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit text-xs">
                      <Sparkles className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>Premium</span>
                    </Badge>
                  </div>
                  {profile && (
                    <p className="text-white/90 text-sm sm:text-base truncate">
                      Welcome back, {profile.full_name || user?.email?.split('@')[0]}
                    </p>
                  )}
                  {profile?.organization && (
                    <p className="text-white/75 text-xs sm:text-sm flex items-center mt-1">
                      <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{profile.organization}</span>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Right Section - Actions and User Menu - Optimized */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Quick Action - New Investment - Responsive */}
                <div className="hidden sm:flex">
                  <Dialog open={investmentDialogOpen} onOpenChange={setInvestmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-white text-[#E02020] hover:bg-white/90 font-medium transition-all duration-200 hover:scale-105 px-2.5 py-2"
                        onClick={() => {
                          setDialogTabValue('investment-form');
                          setInvestmentDialogOpen(true);
                        }}
                      >
                        <FilePlus className="h-4 w-4" />
                        <span className="hidden md:inline ml-2">New Investment</span>
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
                            <Card>
                              <CardContent className="p-0">
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
                              </CardContent>
                            </Card>
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

                {/* Mobile Actions Dropdown */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 p-2"
                      >
                        <Menu className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover shadow-xl border border-border z-50">
                      <DropdownMenuItem onClick={() => {
                        setDialogTabValue('investment-form');
                        setInvestmentDialogOpen(true);
                      }}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        <span>New Investment</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Theme Toggle - Compact */}
                <ThemeToggleButton />

                {/* Notifications - Functional */}
                <div className="text-white [&>button]:text-white [&>button:hover]:bg-white/10 [&_svg]:text-white [&_.bg-\\[\\#E02020\\]]:bg-white [&_.bg-\\[\\#E02020\\]]:text-[#E02020]">
                  <NotificationDropdown />
                </div>

                {/* User Menu - Compact */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-all duration-200">
                      <Avatar className="h-9 w-9 border-2 border-white/20">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-white text-[#E02020] font-semibold text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-popover shadow-xl border border-border z-50" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {profile?.full_name || 'Investor'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Investor Account
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Mobile Actions - Only show on mobile */}
                    <div className="sm:hidden">
                      <DropdownMenuItem onClick={() => {
                        setDialogTabValue('investment-form');
                        setInvestmentDialogOpen(true);
                      }}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        <span>New Investment</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </div>

                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleChangeAccountType}>
                      <UserCog className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 -mt-4 relative z-20 w-full max-w-full box-border">
        {/* Account Deletion Banner */}
        {profile?.is_deleted && profile?.can_restore_until && (
          <AccountDeletionBanner canRestoreUntil={profile.can_restore_until} />
        )}
        
        {/* Quick Stats Overview */}
        <Card className="mb-8 shadow-lg border-0 w-full max-w-full">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl font-semibold text-[#333333] flex items-center">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020] flex-shrink-0" />
                  <span>Investment Overview</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your portfolio performance at a glance</CardDescription>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span>Growth: +12.4%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 w-full max-w-full box-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium truncate">Total Invested</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">${(stats.totalInvested / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-blue-600 mt-1 truncate">Across {stats.activeInvestments} investments</p>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-green-600 font-medium truncate">Average ROI</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">{stats.averageRoi}%</p>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">+0.5% last month</span>
                    </div>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-purple-600 font-medium truncate">Projected Earnings</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-800">${(stats.projectedEarnings / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-purple-600 mt-1 truncate">Next 12 months</p>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-[#E02020]/10 p-3 sm:p-4 rounded-lg border border-[#E02020]/20 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-[#E02020] font-medium truncate">Available Balance</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#E02020]">${(stats.walletBalance / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-[#E02020] mt-1 truncate">Ready to invest</p>
                  </div>
                  <div className="p-1.5 sm:p-2 bg-[#E02020]/10 rounded-lg flex-shrink-0">
                    <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-[#E02020]" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Tabs */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#333333] mb-2">Investment Management Hub</h2>
              <p className="text-muted-foreground">Manage your portfolio, explore opportunities, and track performance</p>
            </div>

            <Tabs defaultValue="portfolio" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg">
                <TabsTrigger value="portfolio" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Requests</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <PiggyBank className="h-4 w-4" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Opportunities</span>
                </TabsTrigger>
                <TabsTrigger value="cluster-map" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Cluster Map</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200">
                  <BarChart2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#333333]">Investment Portfolio</h3>
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
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-[#E02020] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your investments...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : investments.length === 0 ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center border border-dashed border-gray-300 rounded-lg p-8">
                        <FilePlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Investments Yet</h3>
                        <p className="text-gray-600 mb-6">Start investing to see your portfolio grow and track your returns</p>
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
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-0">
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
                                <Badge variant={
                                  investment.status === 'active' ? 'default' : 
                                  investment.status === 'pending' ? 'secondary' : 
                                  'outline'
                                }>
                                  {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">Details</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="requests" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#333333]">Hospital Funding Requests</h3>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
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
                              <Badge variant={
                                request.status === 'approved' ? 'default' : 
                                request.status === 'rejected' ? 'destructive' : 
                                'secondary'
                              }>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
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
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-[#333333]">Wallet Transactions</h3>
                      <div className="flex space-x-2">
                        <Button className="bg-[#E02020] hover:bg-[#C01010] text-white">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Deposit
                        </Button>
                        <Button variant="outline">
                          <ArrowDownRight className="h-4 w-4 mr-2" />
                          Withdraw
                        </Button>
                      </div>
                    </div>
                    <Card>
                      <CardContent className="p-0">
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
                                  <Badge variant={
                                    transaction.type === 'deposit' ? 'default' : 
                                    transaction.type === 'return' ? 'secondary' : 
                                    'outline'
                                  }>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <InvestorWallet
                      balance={stats.walletBalance}
                      totalInvested={stats.totalInvested}
                      returns={stats.projectedEarnings}
                      returnsPercentage={stats.averageRoi}
                      recentTransactions={walletTransactions}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="opportunities" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#333333]">Investment Opportunities</h3>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How It Works
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-0">
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
                              <Badge variant={
                                opportunity.risk === 'low' ? 'default' : 
                                opportunity.risk === 'medium' ? 'secondary' : 
                                'destructive'
                              }>
                                {opportunity.risk.charAt(0).toUpperCase() + opportunity.risk.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">Details</Button>
                                <Button size="sm" className="bg-[#E02020] hover:bg-[#C01010] text-white">Invest</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cluster-map" className="space-y-4 mt-6">
                <InvestorClusterMapView />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-[#333333]">Investment Analytics</CardTitle>
                    <CardDescription>Track your portfolio performance and investment trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="text-center">
                        <BarChart2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-medium text-gray-600 mb-2">Analytics Dashboard</h4>
                        <p className="text-gray-500">Advanced analytics charts would be displayed here</p>
                        <p className="text-gray-500 text-sm mt-2">Including ROI trends, investment distribution, and performance metrics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <AccountSettingsModal 
        open={accountSettingsOpen} 
        onOpenChange={setAccountSettingsOpen} 
      />
    </div>
  );
};

export default InvestorDashboard;
