
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

interface LeaseDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  lease: any;
}

const LeaseDetailsDialog = ({ open, onClose, lease }: LeaseDetailsDialogProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), 'PPP');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Lease Details</DialogTitle>
          <DialogDescription>
            Complete information about this lease
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Equipment</h4>
              <p className="text-base font-medium">{lease.equipment?.name || "Unknown"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <p className="text-base">{lease.equipment?.category || "N/A"}</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Lease Parties</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Hospital</span>
                  <p className="text-sm mt-1">{lease.hospital?.organization || lease.hospital?.email || "Unknown Hospital"}</p>
                </div>
                {lease.investor && (
                  <div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Investor</span>
                    <p className="text-sm mt-1">{lease.investor?.organization || lease.investor?.email || "No Investor"}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
              <p className="text-base">{formatDate(lease.start_date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">End Date</h4>
              <p className="text-base">{formatDate(lease.end_date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Monthly Payment</h4>
              <p className="text-base font-medium">${lease.monthly_payment?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Value</h4>
              <p className="text-base font-medium">${lease.total_value?.toLocaleString() || "0"}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs
              ${lease.status === 'active' ? 'bg-green-100 text-green-800' : 
              lease.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'}`}>
              {lease.status}
            </span>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Created At</h4>
            <p className="text-sm">{formatDate(lease.created_at)}</p>
          </div>
        </div>
        
        <Button onClick={onClose} className="w-full mt-2">Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default LeaseDetailsDialog;
