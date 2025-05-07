
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InvoiceNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes, setNotes }) => {
  return (
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
  );
};

export default InvoiceNotes;
