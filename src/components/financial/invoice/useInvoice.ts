
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { EquipmentProps } from '@/components/EquipmentCard';

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const useInvoice = (equipmentData: EquipmentProps[]) => {
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

  const populateFromEquipment = (itemIndex: number) => {
    if (equipmentData.length === 0) return;
    
    const randomEquipment = equipmentData[Math.floor(Math.random() * equipmentData.length)];
    const price = randomEquipment.price || 0;
    
    const updatedItems = [...invoiceItems];
    updatedItems[itemIndex].description = `${randomEquipment.name} - Monthly Rental`;
    updatedItems[itemIndex].quantity = 1;
    updatedItems[itemIndex].unitPrice = price;
    updatedItems[itemIndex].total = price;
    setInvoiceItems(updatedItems);
  };

  // Mock recent invoices data
  const recentInvoices = [
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

  return {
    // Form state
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,
    taxRate,
    setTaxRate,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerAddress,
    setCustomerAddress,
    invoiceItems,
    setInvoiceItems,
    notes,
    setNotes,
    
    // Invoice item functions
    calculateTotal,
    updateItemTotal,
    addInvoiceItem,
    removeInvoiceItem,
    
    // Total calculation functions
    getSubtotal,
    getTax,
    getTotal,
    
    // Action handlers
    handleCreateInvoice,
    handleSendInvoice,
    populateFromEquipment,
    
    // Mock data
    recentInvoices,
  };
};
