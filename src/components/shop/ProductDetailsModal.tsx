import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star, X, Package, Calendar, Weight, Truck } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/use-products';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailsModal = ({ product, open, onClose }: ProductDetailsModalProps) => {
  const { addToCart } = useCart();
  
  if (!product) return null;
  
  const inStock = product.stock_quantity > 0;
  
  const handleAddToCart = () => {
    if (inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in transition-all duration-300">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground pr-10">{product.name}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute right-0 top-0 h-8 w-8 rounded-full bg-background/80 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="bg-muted/50 dark:bg-muted/20 rounded-xl p-6 flex items-center justify-center min-h-[300px] transition-colors">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
            
            {/* Product Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                {product.category || 'Uncategorized'}
              </Badge>
              {product.rating && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{product.rating}</span>
                </div>
              )}
              {product.is_featured && (
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              )}
              <Badge variant={inStock ? "default" : "destructive"} className="font-medium">
                {inStock ? `${product.stock_quantity} in stock` : 'Out of Stock'}
              </Badge>
            </div>
          </div>
          
          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">Price</h3>
              <div className="text-3xl font-bold text-primary">
                Ksh {product.price.toLocaleString()}
              </div>
              {product.sku && (
                <div className="text-sm text-muted-foreground mt-1">
                  SKU: {product.sku}
                </div>
              )}
            </div>
            
            {/* Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>
            
            <Separator />
            
            {/* Product Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.manufacturer && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Manufacturer</p>
                      <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
                    </div>
                  </div>
                )}
                
                {product.weight && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Weight className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Weight</p>
                      <p className="text-sm text-muted-foreground">{product.weight} kg</p>
                    </div>
                  </div>
                )}
                
                {product.dimensions && (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Dimensions</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof product.dimensions === 'string' 
                          ? product.dimensions 
                          : JSON.stringify(product.dimensions)
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Type</p>
                    <p className="text-sm text-muted-foreground">
                      {product.is_disposable ? 'Disposable' : 'Reusable'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {product.tags && product.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="pt-6 border-t">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="order-2 sm:order-1"
            >
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 order-1 sm:order-2"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
