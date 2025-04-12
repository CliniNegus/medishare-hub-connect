
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Wallet, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const EquipmentFinancingCalculator = () => {
  const { toast } = useToast();
  const [equipmentCost, setEquipmentCost] = useState(10000);
  const [downPayment, setDownPayment] = useState(2000);
  const [term, setTerm] = useState(36); // months
  const [interestRate, setInterestRate] = useState(5); // percentage

  const handleEquipmentCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setEquipmentCost(value);
    }
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setDownPayment(value);
    }
  };

  const handleTermChange = (value: number[]) => {
    setTerm(value[0]);
  };

  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  const calculateMonthlyPayment = () => {
    const loanAmount = equipmentCost - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyInterest * Math.pow(1 + monthlyInterest, term)) / 
      (Math.pow(1 + monthlyInterest, term) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const applyForFinancing = () => {
    toast({
      title: "Financing Application Submitted",
      description: "Your equipment financing application has been received. A finance advisor will contact you shortly.",
    });
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - (equipmentCost - downPayment);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calculator className="mr-2 h-5 w-5 text-medical-primary" />
          Equipment Financing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentCost">Equipment Cost ($)</Label>
              <Input 
                id="equipmentCost" 
                type="number" 
                value={equipmentCost} 
                onChange={handleEquipmentCostChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment ($)</Label>
              <Input 
                id="downPayment" 
                type="number" 
                value={downPayment} 
                onChange={handleDownPaymentChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Term (months): {term}</Label>
              <span className="text-sm text-gray-500">{Math.floor(term / 12)} years, {term % 12} months</span>
            </div>
            <Slider 
              value={[term]} 
              min={12} 
              max={60} 
              step={6} 
              onValueChange={handleTermChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Interest Rate: {interestRate}%</Label>
            <Slider 
              value={[interestRate]} 
              min={3} 
              max={15} 
              step={0.5} 
              onValueChange={handleInterestRateChange}
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-md space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Monthly Payment:</span>
              <span className="font-bold">${monthlyPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Payment:</span>
              <span>${totalPayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Interest:</span>
              <span>${totalInterest.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              className="flex-1" 
              onClick={applyForFinancing}
            >
              Apply for Financing
            </Button>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Go to Investor Wallet
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentFinancingCalculator;
