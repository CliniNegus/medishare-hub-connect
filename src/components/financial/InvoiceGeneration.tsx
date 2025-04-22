
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Send, 
  DollarSign,
  Calendar,
  Copy
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { EquipmentProps } from '../EquipmentCard';

interface InvoiceGenerationProps {
  equipmentData: EquipmentProps[];
}

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  date: Date;
  dueDate: Date;
  customer: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

const InvoiceGeneration: React.FC<InvoiceGenerationProps> = ({ equipmentData }) => {
  const { toast } = useToast();
  const [invoiceDate, setInvoiceDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState<string>(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState<string>("");
  const [taxRate, setTaxRate] = useState<number>(7);
  
  // Mock recent invoices data
  const recentInvoices: Invoice[] = [
    {
      id: 'INV-2025-001',
      date: new Date(2025, 3, 15),
      dueDate: new Date(2025, 4, 15),
      customer: 'City General Hospital',
      status: 'paid',
      items: [
        { id: 1, description: 'MRI Scanner Rental', quantity: 1, unitPrice: 5000, total: 5000 },
        { id: 2, description: 'Maintenance Service', quantity: 2, unitPrice: 500, total: 1000 }
      ],
      subtotal: 6000,
      tax: 420,
      total: 6420,
      notes: 'Thank you for your business'
    },
    {
      id: 'INV-2025-002',
      date: new Date(2025, 3, 10),
      dueDate: new Date(2025, 4, 10),
      customer: 'University Medical Center',
      status: 'sent',
      items: [
        { id: 1, description: 'CT Scanner Rental', quantity: 1, unitPrice: 4200, total: 4200 },
        { id: 2, description: 'Technical Support', quantity: 5, unitPrice: 200, total: 1000 }
      ],
      subtotal: 5200,
      tax: 364,
      total: 5564,
      notes: 'Net 30 payment terms'
    },
    {
      id: 'INV-2025-003',
      date: new Date(2025, 3, 5),
      dueDate: new Date(2025, 3, 20),
      customer: 'Community Health Center',
      status: 'overdue',
      items: [
        { id: 1, description: 'Ultrasound Equipment', quantity: 1, unitPrice: 3000, total: 3000 }
      ],
      subtotal: 3000,
      tax: 210,
      total: 3210,
      notes: 'Please pay promptly'
    }
  ];
  
  const calculateTotal = (item: InvoiceItem) => {
    return item.quantity * item.unitPrice;
  };
  
  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].total = calculateTotal(updatedItems[index]);
    setInvoiceItems(updatedItems);
  };
  
  const addInvoiceItem = () => {
    const newId = invoiceItems.length > 0 
      ? Math.max(...invoiceItems.map(item => item.id)) + 1 
      : 1;
    setInvoiceItems([...invoiceItems, { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };
  
  const removeInvoiceItem = (id: number) => {
    if (invoiceItems.length === 1) {
      toast({
        title: "Cannot Remove Item",
        description: "Invoice must have at least one item",
        variant: "destructive"
      });
      return;
    }
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };
  
  const getSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  };
  
  const getTax = () => {
    return getSubtotal() * (taxRate / 100);
  };
  
  const getTotal = () => {
    return getSubtotal() + getTax();
  };
  
  const handleCreateInvoice = () => {
    if (!customerName) {
      toast({
        title: "Missing Information",
        description: "Please enter a customer name",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceItems.some(item => !item.description || item.total === 0)) {
      toast({
        title: "Invalid Invoice Items",
        description: "Please complete all invoice items",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save the invoice to the database
    toast({
      title: "Invoice Created",
      description: `Invoice for ${customerName} has been created successfully`,
    });
  };
  
  const handleSendInvoice = () => {
    if (!customerEmail) {
      toast({
        title: "Missing Email",
        description: "Please enter a customer email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would email the invoice to the customer
    toast({
      title: "Invoice Sent",
      description: `Invoice has been sent to ${customerEmail}`,
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const populateFromEquipment = (itemIndex: number) => {
    if (equipmentData.length === 0) return;
    
    const randomEquipment = equipmentData[Math.floor(Math.random() * equipmentData.length)];
    const pricePerUse = randomEquipment.pricePerUse;
    const price = pricePerUse * 100; // Convert to dollars
    
    const updatedItems = [...invoiceItems];
    updatedItems[itemIndex].description = `${randomEquipment.name} - Monthly Rental`;
    updatedItems[itemIndex].quantity = 1;
    updatedItems[itemIndex].unitPrice = price;
    updatedItems[itemIndex].total = price;
    setInvoiceItems(updatedItems);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="invoice-date" 
                      type="date" 
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="due-date" 
                      type="date" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="tax-rate" 
                      type="number" 
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="pl-10"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input 
                    id="customer-name" 
                    placeholder="Enter customer name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input 
                    id="customer-email" 
                    type="email" 
                    placeholder="customer@example.com" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer-address">Customer Address</Label>
                  <Textarea 
                    id="customer-address" 
                    placeholder="Enter customer address" 
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="h-[76px]"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={addInvoiceItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[150px]">Unit Price</TableHead>
                    <TableHead className="w-[150px]">Total</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Input 
                            placeholder="Item description" 
                            value={item.description}
                            onChange={(e) => {
                              const updatedItems = [...invoiceItems];
                              updatedItems[index].description = e.target.value;
                              setInvoiceItems(updatedItems);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => populateFromEquipment(index)}
                            title="Select equipment"
                            className="ml-2"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 0;
                            updateItemTotal(index, qty, item.unitPrice);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            className="pl-8"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const price = parseFloat(e.target.value) || 0;
                              updateItemTotal(index, item.quantity, price);
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <Input 
                            readOnly 
                            value={item.total.toFixed(2)}
                            className="pl-8 bg-gray-50"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeInvoiceItem(item.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-6">
                <div className="w-60 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax ({taxRate}%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-red-600">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="invoice-notes">Notes</Label>
              <Textarea 
                id="invoice-notes" 
                placeholder="Enter invoice notes or terms..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-20"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCreateInvoice}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleSendInvoice}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="p-4">
                      <div className="flex items-start">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-gray-500">
                            {invoice.customer}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(invoice.dueDate, 'PP')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium text-red-600">${invoice.total.toFixed(2)}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                View All Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 mt-6">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Invoice Templates</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Standard Invoice</div>
                <div className="text-sm text-gray-500">Basic invoice template with standard terms</div>
              </div>
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Equipment Rental</div>
                <div className="text-sm text-gray-500">Template for equipment rental invoicing</div>
              </div>
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                <div className="font-medium">Maintenance Service</div>
                <div className="text-sm text-gray-500">For maintenance and service contracts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceGeneration;
