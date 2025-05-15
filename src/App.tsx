import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from '@/components/ui/sonner';

import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import MedicalShop from './pages/MedicalShop';
import PublicShop from './pages/PublicShop';
import { CartProvider } from './contexts/CartContext';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Inventory from './pages/Inventory';
import Leases from './pages/Leases';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/shop" element={<PublicShop />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard/*" element={<Index />} />
          <Route path="/medical-shop" element={<MedicalShop />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/manufacturer/*" element={<ManufacturerDashboard />} />
          <Route path="/hospital/*" element={<HospitalDashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/leases" element={<Leases />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner position="bottom-right" />
      </Router>
    </CartProvider>
  );
}

export default App;
