import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Page imports
import Index from './pages/Index';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Auth from './pages/Auth';
import AdminAuth from './pages/AdminAuth';
import Dashboard from './components/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import MaintenanceAlertsPage from './pages/MaintenanceAlertsPage';
import Orders from './pages/Orders';
import MedicalShop from './pages/MedicalShop';
import ProfileManagement from './pages/ProfileManagement';
import Inventory from './pages/Inventory';
import FinancingCalculator from './pages/FinancingCalculator';
import LeaseManagement from './pages/LeaseManagement';
import HospitalLocations from './pages/HospitalLocations';
import EquipmentTracking from './pages/EquipmentTracking';
import ProductManagement from './pages/ProductManagement';
import VirtualShops from './pages/VirtualShops';
import ClientManagement from './pages/ClientManagement';
import SystemManagement from './pages/SystemManagement';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import PublicShop from './pages/PublicShop';
import PaymentCancelled from './pages/PaymentCancelled';
import PaymentSuccess from './pages/PaymentSuccess';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserRoleProvider>
          <ThemeProvider>
            <CartProvider>
              <ErrorBoundary>
                <Router>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/shop" element={<PublicShop />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin-auth" element={<AdminAuth />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Dashboard />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/maintenance-alerts" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <MaintenanceAlertsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/inventory" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Inventory />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/equipment/:id" 
                      element={
                        <ProtectedRoute>
                          <EquipmentDetailsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Orders />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/financing" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <FinancingCalculator />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/leases" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <LeaseManagement />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/hospital-locations" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <HospitalLocations />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/tracking" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <EquipmentTracking />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <ProductManagement />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/virtual-shops" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <VirtualShops />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/clients" 
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <ClientManagement />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/internal-shop" 
                      element={
                        <ProtectedRoute>
                          <MedicalShop />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/system" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'hospital', 'manufacturer', 'investor']}>
                          <Layout>
                            <SystemManagement />
                          </Layout>
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfileManagement />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                  <Toaster />
                </Router>
              </ErrorBoundary>
            </CartProvider>
          </ThemeProvider>
        </UserRoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
