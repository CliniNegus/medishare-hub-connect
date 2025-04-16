import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash, Edit, Check, X, Calculator, DollarSign } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleDashboard from '@/components/RoleDashboard';

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  lease_rate: z.coerce.number().positive("Lease rate must be a positive number").optional(),
  condition: z.string().min(2, "Condition must be at least 2 characters"),
  specs: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductManagement = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("add");
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: 0,
      lease_rate: undefined,
      condition: 'New',
      specs: '',
    },
  });
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category || '',
        price: editingProduct.price || 0,
        lease_rate: editingProduct.lease_rate,
        condition: editingProduct.condition || 'New',
        specs: editingProduct.specs || '',
      });
    }
  }, [editingProduct, form]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('equipment').select('*');
      
      if (role === 'manufacturer' && user) {
        query = query.eq('owner_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      
      const leaseRate = values.lease_rate || Math.round(values.price * 0.05);
      
      if (editingProduct) {
        const { error } = await supabase
          .from('equipment')
          .update({
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            lease_rate: leaseRate,
            condition: values.condition,
            specs: values.specs,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);
          
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: `${values.name} has been updated successfully`,
        });
      } else {
        const { error } = await supabase
          .from('equipment')
          .insert({
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            lease_rate: leaseRate,
            condition: values.condition,
            specs: values.specs,
            owner_id: user?.id,
            status: 'Available',
          });
          
        if (error) throw error;
        
        toast({
          title: "Product added",
          description: `${values.name} has been added to your inventory`,
        });
      }
      
      form.reset();
      setEditingProduct(null);
      setActiveTab("list");
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Failed to save product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
      
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const startEditing = (product: any) => {
    setEditingProduct(product);
    setActiveTab("add");
  };
  
  const cancelEditing = () => {
    setEditingProduct(null);
    form.reset();
  };
  
  const calculateLeaseRate = () => {
    const price = form.getValues("price");
    if (!price) return;
    
    const suggestedLeaseRate = Math.round(price * 0.05);
    form.setValue("lease_rate", suggestedLeaseRate);
  };
  
  return (
    <ProtectedRoute>
      <RoleDashboard allowedRoles={['manufacturer', 'admin']}>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">Product Management</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="add">{editingProduct ? "Edit Product" : "Add Product"}</TabsTrigger>
              <TabsTrigger value="list">Product List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add">
              <Card className="border-red-600">
                <CardHeader>
                  <CardTitle className="text-red-600">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                  <CardDescription>
                    {editingProduct 
                      ? "Update the details of your existing medical equipment"
                      : "Add new medical equipment to your inventory"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. MRI Scanner X5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Diagnostic">Diagnostic Equipment</SelectItem>
                                  <SelectItem value="Monitoring">Monitoring Devices</SelectItem>
                                  <SelectItem value="Surgical">Surgical Equipment</SelectItem>
                                  <SelectItem value="Laboratory">Laboratory Equipment</SelectItem>
                                  <SelectItem value="Imaging">Imaging Systems</SelectItem>
                                  <SelectItem value="Emergency">Emergency Equipment</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="condition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condition</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Refurbished">Refurbished</SelectItem>
                                  <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                                  <SelectItem value="Used - Good">Used - Good</SelectItem>
                                  <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-2">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Purchase Price ($)</FormLabel>
                                <div className="flex items-center">
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={calculateLeaseRate}
                                    className="ml-2"
                                    title="Calculate suggested lease rate"
                                  >
                                    <Calculator className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lease_rate"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Monthly Lease Rate ($)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Calculate or enter manually"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    className="pl-8"
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Suggested: ~5% of purchase price
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide a detailed description of the equipment"
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="specs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technical Specifications</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter detailed technical specifications (dimensions, power requirements, etc.)"
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Include detailed technical information that hospitals would need to know
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        {editingProduct && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          type="submit" 
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {loading ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list">
              <Card className="border-red-600">
                <CardHeader>
                  <CardTitle className="text-red-600">Your Products</CardTitle>
                  <CardDescription>
                    Manage your medical equipment inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading products...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't added any products yet</p>
                      <Button 
                        onClick={() => setActiveTab("add")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Product
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Price ($)</TableHead>
                          <TableHead>Lease Rate ($)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category || 'N/A'}</TableCell>
                            <TableCell>{product.condition || 'N/A'}</TableCell>
                            <TableCell>${product.price?.toLocaleString() || 'N/A'}</TableCell>
                            <TableCell>${product.lease_rate?.toLocaleString() || 'N/A'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.status === 'Available' ? 'bg-green-100 text-green-800' :
                                product.status === 'Leased' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {product.status || 'Unknown'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditing(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Products: {products.length}
                    </p>
                  </div>
                  {products.length > 0 && (
                    <Button
                      onClick={() => setActiveTab("add")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add New Product
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </RoleDashboard>
    </ProtectedRoute>
  );
};

export default ProductManagement;
