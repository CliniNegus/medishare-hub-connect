
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  LineChart,
  Plus,
  Search,
  Filter,
  Briefcase
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import InvestorWallet from './InvestorWallet';

const recentTransactions = [
  { id: '1', date: 'Apr 10, 2025', description: 'Investment Return - MRI Scanner', amount: 240, type: 'return' },
  { id: '2', date: 'Apr 07, 2025', description: 'Deposit to Investment Pool', amount: 5000, type: 'deposit' },
  { id: '3', date: 'Apr 05, 2025', description: 'Equipment Purchase - Ultrasound', amount: 1200, type: 'withdrawal' },
  { id: '4', date: 'Apr 02, 2025', description: 'Investment Return - Ventilators', amount: 320, type: 'return' },
];

const InvestorDashboard = () => {
  return (
    <div className="p-6">
      <Tabs defaultValue="investments" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="investments" className="text-sm">
              <Briefcase className="h-4 w-4 mr-2" />
              Investments
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="text-sm">
              <LineChart className="h-4 w-4 mr-2" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>

        <TabsContent value="investments" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search investments..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Invested</p>
                      <p className="text-2xl font-bold">$85,000</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current Returns</p>
                      <p className="text-2xl font-bold">$12,650</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">ROI</p>
                      <p className="text-2xl font-bold">14.9%</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <PiggyBank className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Financing Calculator Link */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <h2 className="text-lg font-medium mb-2 text-blue-800">Equipment Financing Program</h2>
                <p className="text-sm text-blue-700 mb-3">
                  Looking to invest in medical equipment? Check our financing calculator for projected returns.
                </p>
                <Button variant="default" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Financing Calculator
                </Button>
              </div>
              
              {/* Investment Portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">MRI Equipment</span>
                        <span className="text-sm text-green-600">+8.3%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$35,700 invested</span>
                        <span>42% of portfolio</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Surgical Equipment</span>
                        <span className="text-sm text-green-600">+5.7%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$23,800 invested</span>
                        <span>28% of portfolio</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Monitoring Systems</span>
                        <span className="text-sm text-green-600">+12.1%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$25,500 invested</span>
                        <span>30% of portfolio</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Wallet */}
            <div>
              <InvestorWallet 
                balance={25000}
                totalInvested={85000}
                returns={12650}
                returnsPercentage={14.9}
                recentTransactions={recentTransactions}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="opportunities">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <LineChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Investment Opportunities</h3>
              <p className="text-sm">Discover new investment opportunities in medical equipment.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
              <p className="text-sm">View detailed analytics of your investment performance.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestorDashboard;
