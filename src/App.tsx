
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
import Auth from './pages/Auth';
import AdminAuth from './pages/AdminAuth';
import Dashboard from './components/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import MaintenanceAlertsPage from './pages/MaintenanceAlertsPage';
import Orders from './pages/Orders';
import MedicalShop from './pages/MedicalShop';

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
                      path="/shop" 
                      element={
                        <ProtectedRoute>
                          <MedicalShop />
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
