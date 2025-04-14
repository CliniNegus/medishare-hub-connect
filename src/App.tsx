
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import FinancingCalculator from "./pages/FinancingCalculator";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import LeaseManagement from "./pages/LeaseManagement";
import EquipmentTracking from "./pages/EquipmentTracking";
import MedicalShop from "./pages/MedicalShop";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleDashboard from "./components/RoleDashboard";
import HospitalRegistrationForm from "./components/HospitalRegistrationForm";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
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
                <Route path="/register/hospital" element={<HospitalRegistrationForm />} />

                {/* Dashboard - accessible by all authenticated users but content differs by role */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />

                {/* Hospital specific routes */}
                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <RoleDashboard allowedRoles={['hospital', 'admin']}>
                      <Inventory />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Orders - accessible to hospitals and manufacturers */}
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <RoleDashboard allowedRoles={['hospital', 'manufacturer', 'admin']}>
                      <Orders />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Financing - accessible to hospitals and investors */}
                <Route path="/financing" element={
                  <ProtectedRoute>
                    <RoleDashboard allowedRoles={['hospital', 'investor', 'admin']}>
                      <FinancingCalculator />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Leases - accessible to hospitals, investors and manufacturers */}
                <Route path="/leases" element={
                  <ProtectedRoute>
                    <RoleDashboard allowedRoles={['hospital', 'manufacturer', 'investor', 'admin']}>
                      <LeaseManagement />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Equipment tracking - for manufacturers primarily */}
                <Route path="/tracking" element={
                  <ProtectedRoute>
                    <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
                      <EquipmentTracking />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Admin dashboard - strictly admin only */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <RoleDashboard allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleDashboard>
                  </ProtectedRoute>
                } />

                {/* Shop - accessible to all authenticated users */}
                <Route path="/shop" element={
                  <ProtectedRoute>
                    <MedicalShop />
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserRoleProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
