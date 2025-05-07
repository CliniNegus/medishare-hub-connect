
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface InvoiceNotesProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const InvoiceNotes: React.FC<InvoiceNotesProps> = ({ notes, setNotes }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="invoice-notes" className="flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Notes & Terms
      </Label>
      <Textarea
        id="invoice-notes"
        placeholder="Add notes, payment terms or delivery instructions..."
        className="h-24"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
    </div>
  );
};

export default InvoiceNotes;
