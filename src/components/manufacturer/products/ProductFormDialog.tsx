import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormValues {
  name: string;
  description?: string;
  category?: string;
  price: number;
  stock_quantity: number;
  manufacturer?: string;
  image_url?: string;
  is_featured?: boolean;
  is_disposable?: boolean;
  sku?: string;
  tags?: string[];
  weight?: number;
  dimensions?: any;
  has_variants?: boolean;
  variants?: any[];
}

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  initialValues?: Partial<ProductFormValues>;
  isLoading: boolean;
}

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ProductFormValues>({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock_quantity: 0,
    manufacturer: '',
    image_url: '',
    is_featured: false,
    is_disposable: true,
    sku: '',
    tags: [],
    weight: 0,
    has_variants: false,
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        category: initialValues.category || '',
        price: initialValues.price || 0,
        stock_quantity: initialValues.stock_quantity || 0,
        manufacturer: initialValues.manufacturer || '',
        image_url: initialValues.image_url || '',
        is_featured: initialValues.is_featured || false,
        is_disposable: initialValues.is_disposable !== undefined ? initialValues.is_disposable : true,
        sku: initialValues.sku || '',
        tags: initialValues.tags || [],
        weight: initialValues.weight || 0,
        has_variants: initialValues.has_variants || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        stock_quantity: 0,
        manufacturer: '',
        image_url: '',
        is_featured: false,
        is_disposable: true,
        sku: '',
        tags: [],
        weight: 0,
        has_variants: false,
      });
    }
  }, [initialValues, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {initialValues ? 'Update product information' : 'Add a new product to your inventory'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surgical Instruments">Surgical Instruments</SelectItem>
                  <SelectItem value="Disposables">Disposables</SelectItem>
                  <SelectItem value="Personal Protective Equipment">Personal Protective Equipment</SelectItem>
                  <SelectItem value="Diagnostic Equipment">Diagnostic Equipment</SelectItem>
                  <SelectItem value="Laboratory Supplies">Laboratory Supplies</SelectItem>
                  <SelectItem value="Patient Care">Patient Care</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="manufacturer">Manufacturer/Brand</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="price">Price (KES) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_disposable"
                checked={formData.is_disposable}
                onCheckedChange={(checked) => setFormData({ ...formData, is_disposable: checked })}
              />
              <Label htmlFor="is_disposable">Disposable Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? 'Saving...' : initialValues ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
