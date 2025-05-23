
import { useState } from 'react';
import { EquipmentProps } from '../../EquipmentCard';
import { useToast } from '@/components/ui/use-toast';

export type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceStatus = "paid" | "sent" | "overdue" | "draft";

export type Invoice = {
  id: string;
  date: Date;
  dueDate: Date;
  customer: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
};

// Export the hook with the correct name
export const useInvoice = (equipmentData: EquipmentProps[]) => {
  const { toast } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2025-0001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState('');

  // Calculate invoice totals
  const getSubtotal = () => invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.07;
  const getTax = () => getSubtotal() * taxRate;
  const getTotal = () => getSubtotal() + getTax();

  // Generate sample invoices
  const generateSampleInvoices = (): Invoice[] => {
    return [
      {
        id: 'INV-2025-0001',
        date: new Date('2025-04-15'),
        dueDate: new Date('2025-05-15'),
        customer: 'Memorial Hospital',
        status: 'paid',
        items: [
          { id: 1, description: 'MRI Scanner Monthly Lease', quantity: 1, unitPrice: 3500, total: 3500 },
          { id: 2, description: 'Maintenance Service', quantity: 1, unitPrice: 850, total: 850 }
        ],
        subtotal: 4350,
        tax: 304.5,
        total: 4654.5,
        notes: 'Thank you for your business!'
      },
      {
        id: 'INV-2025-0002',
        date: new Date('2025-04-20'),
        dueDate: new Date('2025-05-20'),
        customer: 'City Medical Center',
        status: 'sent',
        items: [
          { id: 1, description: 'CT Scanner Usage - Q1', quantity: 1, unitPrice: 5200, total: 5200 }
        ],
        subtotal: 5200,
        tax: 364,
        total: 5564,
        notes: 'Net 30 payment terms'
      },
      {
        id: 'INV-2025-0003',
        date: new Date('2025-03-10'),
        dueDate: new Date('2025-04-10'),
        customer: 'University Health',
        status: 'overdue',
        items: [
          { id: 1, description: 'Ultrasound Equipment Lease', quantity: 2, unitPrice: 1800, total: 3600 },
          { id: 2, description: 'Training Session', quantity: 1, unitPrice: 750, total: 750 }
        ],
        subtotal: 4350,
        tax: 304.5,
        total: 4654.5,
        notes: 'Please remit payment immediately'
      }
    ];
  };

  const recentInvoices = generateSampleInvoices();

  // Add item to invoice
  const addInvoiceItem = () => {
    const newId = invoiceItems.length > 0 ? Math.max(...invoiceItems.map(item => item.id)) + 1 : 1;
    setInvoiceItems([...invoiceItems, { id: newId, description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  // Remove item from invoice
  const removeInvoiceItem = (id: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter(item => item.id !== id));
    } else {
      toast({
        title: "Cannot Remove Item",
        description: "Invoice must have at least one line item",
        variant: "destructive"
      });
    }
  };

  // Update item details
  const updateItemTotal = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Add equipment to invoice
  const populateFromEquipment = (equipment: EquipmentProps) => {
    const newId = invoiceItems.length > 0 ? Math.max(...invoiceItems.map(item => item.id)) + 1 : 1;
    
    // Use pricePerUse if available, fallback to 0
    const unitPrice = equipment.pricePerUse || 0;
    
    setInvoiceItems([
      ...invoiceItems,
      {
        id: newId,
        description: `${equipment.name} - ${equipment.type || 'Equipment'}`,
        quantity: 1,
        unitPrice: unitPrice,
        total: unitPrice
      }
    ]);
    
    toast({
      title: "Added to Invoice",
      description: `${equipment.name} has been added to this invoice.`
    });
  };

  // Generate/create invoice
  const handleCreateInvoice = () => {
    // Validate fields
    if (!customerName) {
      toast({
        title: "Missing Information",
        description: "Please enter a customer name",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceItems.some(item => item.description === '' || item.total === 0)) {
      toast({
        title: "Invalid Line Items",
        description: "Please complete all line items with description and price",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save the invoice to the database
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoiceNumber} for $${getTotal().toFixed(2)} has been created.`
    });
    
    // Reset form or redirect to the invoice page
    console.log('Invoice created:', {
      invoiceNumber,
      invoiceDate,
      dueDate,
      customerName,
      customerEmail,
      customerAddress,
      invoiceItems,
      subtotal: getSubtotal(),
      tax: getTax(),
      total: getTotal(),
      notes
    });
  };

  // Send invoice
  const handleSendInvoice = () => {
    // First ensure invoice is created
    if (!customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter customer name and email to send invoice",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would email the invoice to the customer
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoiceNumber} has been sent to ${customerEmail}`
    });
    
    console.log('Invoice sent to:', customerEmail);
  };

  return {
    // Form state
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,
    taxRate,
    setTaxRate: (value: number) => {/* This is a placeholder as taxRate is currently constant */},
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

// Export default for backward compatibility
export default useInvoice;
