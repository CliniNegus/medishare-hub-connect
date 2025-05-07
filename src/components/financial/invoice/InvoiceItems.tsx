
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Copy } from "lucide-react";
import { EquipmentProps } from '@/components/EquipmentCard';

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceItemsProps {
  invoiceItems: InvoiceItem[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  addInvoiceItem: () => void;
  removeInvoiceItem: (id: number) => void;
  updateItemTotal: (index: number, quantity: number, unitPrice: number) => void;
  populateFromEquipment: (itemIndex: number) => void;
  equipmentData: EquipmentProps[];
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  invoiceItems,
  setInvoiceItems,
  getSubtotal,
  getTax,
  getTotal,
  addInvoiceItem,
  removeInvoiceItem,
  updateItemTotal,
  populateFromEquipment,
  equipmentData
}) => {
  return (
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
            <span className="text-sm">Tax ({invoiceItems.length > 0 ? invoiceItems[0].quantity : 0}%):</span>
            <span>${getTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-red-600">${getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceItems;
