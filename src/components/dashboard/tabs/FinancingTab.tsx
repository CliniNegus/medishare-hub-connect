
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Calculator, FileText, Percent, Clock, Check, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FinancingTab: React.FC = () => {
  // Mock financing options data
  const financingOptions = [
    {
      id: 1,
      name: "Standard Lease",
      term: "36 months",
      interestRate: "5.9%",
      downPayment: "10%",
      monthlyPayment: "Ksh 250,000",
      totalCost: "Ksh 9,000,000",
      bestFor: "General equipment with consistent usage"
    },
    {
      id: 2,
      name: "Accelerated Acquisition",
      term: "24 months",
      interestRate: "6.5%",
      downPayment: "15%",
      monthlyPayment: "Ksh 380,000",
      totalCost: "Ksh 9,120,000",
      bestFor: "Rapidly depreciating technology"
    },
    {
      id: 3,
      name: "Extended Financing",
      term: "60 months",
      interestRate: "7.2%",
      downPayment: "5%",
      monthlyPayment: "Ksh 165,000",
      totalCost: "Ksh 9,900,000",
      bestFor: "High value equipment with long service life"
    }
  ];

  // Mock equipment available for financing
  const equipmentForFinancing = [
    {
      id: 1,
      name: "MRI Scanner - Premium Model",
      manufacturer: "MediTech Imaging",
      price: "Ksh 125,000,000",
      estimatedMonthly: "Ksh 2,250,000",
      category: "Imaging"
    },
    {
      id: 2,
      name: "Surgical Robot System",
      manufacturer: "SurgicalBots Inc",
      price: "Ksh 89,500,000",
      estimatedMonthly: "Ksh 1,620,000",
      category: "Surgical"
    },
    {
      id: 3,
      name: "CT Scanner - Advanced",
      manufacturer: "ClearView Medical",
      price: "Ksh 75,000,000",
      estimatedMonthly: "Ksh 1,350,000",
      category: "Imaging"
    },
    {
      id: 4,
      name: "Ultrasound System - Professional",
      manufacturer: "SonoWave",
      price: "Ksh 12,500,000",
      estimatedMonthly: "Ksh 230,000",
      category: "Imaging"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Medical Equipment Financing</h2>
          <p className="text-gray-600">Flexible financing options for your hospital's equipment needs</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Payment
        </Button>
      </div>
      
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Flexible Financing Options
          </CardTitle>
          <CardDescription className="text-red-700">
            Choose from multiple financing plans tailored to your hospital's budget and needs
          </CardDescription>
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
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">Select</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Available for Financing</CardTitle>
              <CardDescription>
                Browse premium medical equipment available with financing options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentForFinancing.map(equipment => (
                  <Card key={equipment.id} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{equipment.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {equipment.manufacturer} | {equipment.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-500">Purchase Price:</div>
                        <div className="font-semibold text-red-600">{equipment.price}</div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-500">Est. Monthly Payment:</div>
                        <div className="font-semibold text-red-600">{equipment.estimatedMonthly}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Finance
                        </Button>
                        <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" size="sm">
                          <FileText className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Financing Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Equipment Price</label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Ksh</span>
                    <input 
                      type="text" 
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                      defaultValue="50,000,000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Down Payment (%)</label>
                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md"
                      defaultValue="10"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Term (months)</label>
                  <select className="w-full mt-1 border border-gray-300 rounded-md py-2 px-3">
                    <option>24 months</option>
                    <option selected>36 months</option>
                    <option>48 months</option>
                    <option>60 months</option>
                    <option>72 months</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Interest Rate</label>
                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md"
                      defaultValue="6.5"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                  </div>
                </div>
                
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Payment
                </Button>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500">Estimated Monthly Payment:</div>
                  <div className="text-xl font-bold text-red-600">Ksh 932,542</div>
                  <div className="text-sm text-gray-500 mt-1">Total Finance Amount: Ksh 45,000,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-red-800">Financing Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Preserve cash and credit lines</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Predictable monthly payments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Potential tax advantages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Upgrade to latest technology</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-sm">Flexible end-of-term options</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4 border-red-300 text-red-600 hover:bg-red-100">
                <FileText className="h-4 w-4 mr-2" />
                Download Financing Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancingTab;
