import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from './contexts/AuthContext';
import { UserRoleProvider } from './contexts/UserRoleContext';

import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './components/notifications/NotificationProvider';
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
import ManageHospitalAccounts from './pages/admin/ManageHospitalAccounts';
import ManageManufacturerAccounts from './pages/admin/ManageManufacturerAccounts';
import ManageInvestorAccounts from './pages/admin/ManageInvestorAccounts';
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
import EmailVerification from './pages/EmailVerification';
import NotificationsPage from './components/notifications/NotificationsPage';
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import EquipmentPage from './pages/EquipmentPage';
import DeleteAccountRequest from './pages/DeleteAccountRequest';
import WishlistPage from './pages/WishlistPage';
import HelpSupport from './pages/HelpSupport';


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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <UserRoleProvider>
              <CartProvider>
                <WishlistProvider>
                  <ErrorBoundary>
                  <Router>
                    <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/delete-account" element={<DeleteAccountRequest />} />
                    <Route path="/shop" element={<PublicShop />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/verify" element={<EmailVerification />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
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
                      path="/admin/users/hospitals" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <ManageHospitalAccounts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users/manufacturers" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <ManageManufacturerAccounts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users/investors" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <ManageInvestorAccounts />
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
                        path="/equipment" 
                        element={
                          <ProtectedRoute>
                            <EquipmentPage />
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
                      <Route 
                       path="/wishlist" 
                       element={
                         <ProtectedRoute>
                           <Layout>
                             <WishlistPage />
                           </Layout>
                         </ProtectedRoute>
                       } 
                      />
                      <Route 
                       path="/help" 
                       element={
                         <ProtectedRoute>
                           <Layout>
                             <HelpSupport />
                           </Layout>
                         </ProtectedRoute>
                       } 
                      />
                      <Route 
                       path="/notifications" 
                       element={
                         <ProtectedRoute>
                           <NotificationsPage />
                         </ProtectedRoute>
                       } 
                      />
                      {/* Catch-all route for 404 */}
                      <Route path="*" element={<NotFound />} />
                   </Routes>
                   <Toaster />
                </Router>
                </ErrorBoundary>
                </WishlistProvider>
              </CartProvider>
            </UserRoleProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
