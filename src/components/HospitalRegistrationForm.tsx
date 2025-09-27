
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Users, MapPin, Activity } from 'lucide-react';

const HospitalRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phoneNumber: '',
    hospitalType: '',
    bedsCount: '',
    patientsCaredForAnnually: '',
    specialties: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Register the user with Supabase
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.hospitalName,
            organization: formData.hospitalName,
            organization_type: formData.hospitalType,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            country: formData.country,
            phone_number: formData.phoneNumber,
            beds_count: formData.bedsCount,
            patients_annually: formData.patientsCaredForAnnually,
            specialties: formData.specialties,
            description: formData.description
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Hospital className="h-6 w-6 text-primary" />
          Hospital Registration
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital/Clinic Name</Label>
                <Input
                  id="hospitalName"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalType">Facility Type</Label>
                <Select 
                  value={formData.hospitalType} 
                  onValueChange={(value) => handleSelectChange('hospitalType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_hospital">General Hospital</SelectItem>
                    <SelectItem value="specialty_hospital">Specialty Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="urgent_care">Urgent Care</SelectItem>
                    <SelectItem value="surgical_center">Surgical Center</SelectItem>
                    <SelectItem value="rehabilitation">Rehabilitation Facility</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
            </div>
          </div>
          
          {/* Location Information */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => handleSelectChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Capacity & Specialization */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Capacity & Specialization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedsCount">Number of Beds</Label>
                <Input
                  id="bedsCount"
                  name="bedsCount"
                  type="number"
                  value={formData.bedsCount}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientsCaredForAnnually">Annual Patient Count</Label>
                <Input
                  id="patientsCaredForAnnually"
                  name="patientsCaredForAnnually"
                  type="number"
                  value={formData.patientsCaredForAnnually}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialties">Medical Specialties</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="E.g. Cardiology, Orthopedics, Neurology"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Facility Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your facility"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Register Hospital"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default HospitalRegistrationForm;
