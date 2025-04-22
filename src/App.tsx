
import React, { useEffect } from 'react';
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
import EquipmentManagement from "./pages/EquipmentManagement";
import ProductManagement from "./pages/ProductManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleDashboard from "./components/RoleDashboard";
import HospitalRegistrationForm from "./components/HospitalRegistrationForm";
import HospitalLocations from "./pages/HospitalLocations";
import TwoFactorAuthentication from "./components/auth/TwoFactorAuthentication";
import LoadingState from './components/ui/loading-state';

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
  // Initialize theme from localStorage or user preference
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <UserRoleProvider>
              <Toaster />
              <Sonner />
              <React.Suspense 
                fallback={
                  <LoadingState 
                    active={true} 
                    type="spinner" 
                    color="primary" 
                    fullPage={true} 
                    text="Loading application..." 
                  />
                }
              >
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/register/hospital" element={<HospitalRegistrationForm />} />
                    <Route path="/two-factor" element={
                      <ProtectedRoute>
                        <div className="container mx-auto p-8 max-w-md">
                          <TwoFactorAuthentication />
                        </div>
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

                    <Route path="/equipment" element={
                      <ProtectedRoute>
                        <RoleDashboard allowedRoles={['hospital', 'manufacturer', 'admin']}>
                          <EquipmentManagement />
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

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </React.Suspense>
            </UserRoleProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
