

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import FinancingCalculator from "./pages/FinancingCalculator";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import ResetPassword from "./pages/ResetPassword";
import LeaseManagement from "./pages/LeaseManagement";
import EquipmentTracking from "./pages/EquipmentTracking";
import MedicalShop from "./pages/MedicalShop";
import ProductManagement from "./pages/ProductManagement";
import SecuritySettings from "./pages/SecuritySettings";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleDashboard from "./components/RoleDashboard";
import HospitalRegistrationForm from "./components/HospitalRegistrationForm";
import HospitalLocations from "./pages/HospitalLocations";
import SystemManagement from "./pages/SystemManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <UserRoleProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin-auth" element={<AdminAuth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/register/hospital" element={<HospitalRegistrationForm />} />
                  <Route path="/security-settings" element={
                    <ProtectedRoute>
                      <SecuritySettings />
                    </ProtectedRoute>
                  } />

                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />

                  <Route path="/inventory" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['hospital', 'admin']}>
                        <Inventory />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['hospital', 'manufacturer', 'admin']}>
                        <Orders />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/financing" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['hospital', 'investor', 'admin']}>
                        <FinancingCalculator />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/leases" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['hospital', 'manufacturer', 'investor', 'admin']}>
                        <LeaseManagement />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/tracking" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
                        <EquipmentTracking />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/products" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
                        <ProductManagement />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <MedicalShop />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/system" element={
                    <ProtectedRoute>
                      <RoleDashboard allowedRoles={['admin', 'hospital', 'manufacturer', 'investor']}>
                        <SystemManagement />
                      </RoleDashboard>
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </UserRoleProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

