
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Wallet, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const EquipmentFinancingCalculator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [equipmentCost, setEquipmentCost] = useState(65000000); // Default in Ksh (500K USD equivalent)
  const [downPayment, setDownPayment] = useState(13000000); // Default in Ksh (100K USD equivalent)
  const [term, setTerm] = useState(36); // months
  const [interestRate, setInterestRate] = useState(5); // percentage
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const applyForFinancing = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for financing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a financing application record
      const financingData = {
        user_id: user.id,
        equipment_cost: equipmentCost,
        down_payment: downPayment,
        term_months: term,
        interest_rate: interestRate,
        monthly_payment: monthlyPayment,
        total_payment: totalPayment,
        status: 'pending',
        application_date: new Date().toISOString()
      };

      // For now, we'll store this as metadata in a transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          reference: `FINANCE-APP-${Date.now()}`,
          amount: downPayment,
          currency: 'KES',
          status: 'pending',
          metadata: {
            type: 'financing_application',
            ...financingData
          }
        });

      if (error) throw error;

      toast({
        title: "Financing Application Submitted",
        description: "Your equipment financing application has been received. A finance advisor will contact you within 24 hours.",
      });

    } catch (error: any) {
      console.error('Error submitting financing application:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit financing application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - (equipmentCost - downPayment);

  return (
    <Card className="w-full border-[#E02020]/20">
      <CardHeader className="pb-2 bg-[#E02020]/5 border-b border-[#E02020]/20">
        <CardTitle className="text-lg flex items-center">
          <Calculator className="mr-2 h-5 w-5 text-[#E02020]" />
          Equipment Financing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentCost">Equipment Cost (Ksh)</Label>
              <Input 
                id="equipmentCost" 
                type="number" 
                value={equipmentCost} 
                onChange={handleEquipmentCostChange}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                Equivalent to USD ${(equipmentCost / 130).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment (Ksh)</Label>
              <Input 
                id="downPayment" 
                type="number" 
                value={downPayment} 
                onChange={handleDownPaymentChange}
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                {equipmentCost > 0 ? `${((downPayment / equipmentCost) * 100).toFixed(1)}% of total cost` : '0% of total cost'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Term (months): {term}</Label>
                <span className="text-sm text-gray-500 font-medium">
                  {Math.floor(term / 12)} years, {term % 12} months
                </span>
              </div>
              <Slider 
                value={[term]} 
                min={12} 
                max={60} 
                step={6} 
                onValueChange={handleTermChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Interest Rate: {interestRate}%</Label>
                <span className="text-sm text-gray-500">Per annum</span>
              </div>
              <Slider 
                value={[interestRate]} 
                min={3} 
                max={15} 
                step={0.5} 
                onValueChange={handleInterestRateChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-[#E02020]/5 p-6 rounded-lg border border-[#E02020]/20 space-y-4">
            <h3 className="font-semibold text-[#E02020] flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Financing Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Monthly Payment:</span>
                  <span className="font-bold text-[#E02020] text-lg">
                    Ksh {monthlyPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Payment:</span>
                  <span className="text-[#333333]">Ksh {totalPayment.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total Interest:</span>
                  <span className="text-[#333333]">Ksh {totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Loan Amount:</span>
                  <span className="text-[#333333]">Ksh {(equipmentCost - downPayment).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button 
              className="flex-1 bg-[#E02020] hover:bg-[#c01c1c]" 
              onClick={applyForFinancing}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Apply for Financing
                </>
              )}
            </Button>
            <Link to="/investor-dashboard" className="flex-1">
              <Button variant="outline" className="w-full border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white">
                <Wallet className="h-4 w-4 mr-2" />
                View Investor Options
              </Button>
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Calculations are estimates. Final terms subject to approval and may vary based on creditworthiness.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentFinancingCalculator;
