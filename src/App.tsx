
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminAuth from '@/pages/AdminAuth';
import PublicShop from '@/pages/PublicShop';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';
import PaymentCancelled from '@/pages/PaymentCancelled';
import AddEquipmentPage from '@/pages/AddEquipmentPage';
import EquipmentDetails from '@/pages/EquipmentDetails';
import EditEquipment from '@/pages/EditEquipment';
import Orders from '@/pages/Orders';
import UsersPage from '@/pages/UsersPage';
import CategoriesPage from '@/pages/CategoriesPage';
import SettingsPage from '@/pages/SettingsPage';
import TutorialPage from '@/pages/TutorialPage';
import ContactPage from '@/pages/ContactPage';
import AboutUsPage from '@/pages/AboutUsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserRoleProvider>
            <CartProvider>
              <TutorialProvider>
                <Router>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin-auth" element={<AdminAuth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/shop" element={<PublicShop />} />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/payment-failed" element={<PaymentFailed />} />
                      <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                      <Route path="/equipment/create" element={<AddEquipmentPage />} />
                      <Route path="/equipment/:id" element={<EquipmentDetails />} />
                      <Route path="/equipment/:id/edit" element={<EditEquipment />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/tutorial" element={<TutorialPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/about-us" element={<AboutUsPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </Router>
                <Toaster />
                <SonnerToaster />
              </TutorialProvider>
            </CartProvider>
          </UserRoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
