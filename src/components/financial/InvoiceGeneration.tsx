
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentProps } from '../EquipmentCard';
import { useInvoice } from './invoice/useInvoice';
import InvoiceForm from './invoice/InvoiceForm';
import InvoiceItems from './invoice/InvoiceItems';
import InvoiceNotes from './invoice/InvoiceNotes';
import InvoiceActions from './invoice/InvoiceActions';
import RecentInvoices from './invoice/RecentInvoices';
import InvoiceTemplates from './invoice/InvoiceTemplates';

interface InvoiceGenerationProps {
  equipmentData: EquipmentProps[];
}

const InvoiceGeneration: React.FC<InvoiceGenerationProps> = ({ equipmentData }) => {
  const {
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
  } = useInvoice(equipmentData);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Create New Invoice</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <InvoiceForm 
              invoiceDate={invoiceDate}
              setInvoiceDate={setInvoiceDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              customerAddress={customerAddress}
              setCustomerAddress={setCustomerAddress}
              notes={notes}
              setNotes={setNotes}
            />
            
            <InvoiceItems 
              invoiceItems={invoiceItems}
              setInvoiceItems={setInvoiceItems}
              getSubtotal={getSubtotal}
              getTax={getTax}
              getTotal={getTotal}
              addInvoiceItem={addInvoiceItem}
              removeInvoiceItem={removeInvoiceItem}
              updateItemTotal={(index, quantity, unitPrice) => {
                updateItemTotal(invoiceItems[index].id, 'quantity', quantity);
                updateItemTotal(invoiceItems[index].id, 'unitPrice', unitPrice);
                // Recalculate total
                const total = quantity * unitPrice;
                updateItemTotal(invoiceItems[index].id, 'total', total);
              }}
              populateFromEquipment={(itemIndex) => {
                // Assuming we want to use the first equipment item for demonstration
                if (equipmentData && equipmentData.length > 0) {
                  populateFromEquipment(equipmentData[0]);
                }
              }}
              equipmentData={equipmentData}
            />
            
            <InvoiceNotes 
              notes={notes}
              setNotes={setNotes}
            />
            
            <InvoiceActions 
              handleCreateInvoice={handleCreateInvoice}
              handleSendInvoice={handleSendInvoice}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <RecentInvoices 
          recentInvoices={recentInvoices}
        />
        
        <InvoiceTemplates />
      </div>
    </div>
  );
};

export default InvoiceGeneration;
