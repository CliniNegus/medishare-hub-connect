
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import LandingPage from "./pages/LandingPage";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import LeaseManagement from "./pages/LeaseManagement";
import HospitalLocations from "./pages/HospitalLocations";
import EquipmentTracking from "./pages/EquipmentTracking";
import ProductManagement from "./pages/ProductManagement";
import VirtualShops from "./pages/VirtualShops";
import ClientManagement from "./pages/ClientManagement";
import MedicalShop from "./pages/MedicalShop";
import PublicShop from "./pages/PublicShop";
import SystemManagement from "./pages/SystemManagement";
import AdminDashboard from "./pages/AdminDashboard";
import ProfileManagement from "./pages/ProfileManagement";
import SecuritySettings from "./pages/SecuritySettings";
import Integrations from "./pages/Integrations";
import FinancingCalculator from "./pages/FinancingCalculator";
import EquipmentManagement from "./pages/EquipmentManagement";
import AddEquipmentPage from "./pages/AddEquipmentPage";
import EquipmentDetailsPage from "./pages/EquipmentDetailsPage";
import MaintenanceAlertsPage from "./pages/MaintenanceAlertsPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import SupportPage from "./pages/SupportPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <UserRoleProvider>
              <CartProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route path="/shop" element={<PublicShop />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Navigate to="/landing" replace />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/inventory" element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/financing" element={
                      <ProtectedRoute>
                        <FinancingCalculator />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/leases" element={
                      <ProtectedRoute>
                        <LeaseManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/hospital-locations" element={
                      <ProtectedRoute>
                        <HospitalLocations />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/tracking" element={
                      <ProtectedRoute>
                        <EquipmentTracking />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/products" element={
                      <ProtectedRoute>
                        <ProductManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/virtual-shops" element={
                      <ProtectedRoute>
                        <VirtualShops />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/clients" element={
                      <ProtectedRoute>
                        <ClientManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/medical-shop" element={
                      <ProtectedRoute>
                        <MedicalShop />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/support" element={
                      <ProtectedRoute>
                        <SupportPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/system" element={
                      <ProtectedRoute>
                        <SystemManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfileManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/security" element={
                      <ProtectedRoute>
                        <SecuritySettings />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/integrations" element={
                      <ProtectedRoute>
                        <Integrations />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/equipment" element={
                      <ProtectedRoute>
                        <EquipmentManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/equipment/add" element={
                      <ProtectedRoute>
                        <AddEquipmentPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/equipment/:id" element={
                      <ProtectedRoute>
                        <EquipmentDetailsPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/maintenance-alerts" element={
                      <ProtectedRoute>
                        <MaintenanceAlertsPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </CartProvider>
            </UserRoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
