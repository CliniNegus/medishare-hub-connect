
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const PublicShopHeader = () => {
  const { user } = useAuth();
  const { setIsOpen, totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewCart = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to view your cart.",
        variant: "default",
      });
      navigate('/auth');
      return;
    }
    setIsOpen(true);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Medical Supplies Shop
              </h1>
              <p className="text-gray-600 text-sm">Professional healthcare equipment & supplies</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/auth">
                <Button variant="outline" className="border-red-200 hover:border-red-300 hover:bg-red-50 font-medium">
                  Sign In
                </Button>
              </Link>
            )}
            <Button 
              variant="primary-red"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleViewCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>View Cart</span>
              {totalItems > 0 && (
                <Badge className="bg-white text-red-600 ml-1">{totalItems}</Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicShopHeader;
