
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from 'date-fns';
import { Eye, Edit, XCircle, CheckCircle } from "lucide-react";
import LeaseDetailsDialog from "./LeaseDetailsDialog";

interface LeasesListProps {
  leases: any[];
  loading: boolean;
  onRefresh: () => void;
  userRole?: string;
}

const LeasesList = ({ leases, loading, onRefresh, userRole }: LeasesListProps) => {
  const { toast } = useToast();
  const [selectedLease, setSelectedLease] = React.useState<any>(null);
  const [showDetails, setShowDetails] = React.useState(false);

  if (loading) {
    return <div className="text-center py-10">Loading leases...</div>;
  }

  if (leases.length === 0) {
    return <div className="text-center py-10 text-gray-500">No leases found</div>;
  }

  const viewLeaseDetails = (lease: any) => {
    setSelectedLease(lease);
    setShowDetails(true);
  };

  const handleStatusUpdate = async (leaseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leases')
        .update({ status: newStatus })
        .eq('id', leaseId);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Lease status updated to ${newStatus}`,
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getTimeRemaining = (endDateString: string) => {
    if (!endDateString) return "No end date";
    const endDate = new Date(endDateString);
    
    if (endDate < new Date()) {
      return "Expired";
    }
    
    return formatDistanceToNow(endDate, { addSuffix: true });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipment</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Investor</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Time Remaining</TableHead>
            <TableHead>Monthly Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.map((lease) => (
            <TableRow key={lease.id}>
              <TableCell className="font-medium">{lease.equipment?.name || "Unknown Equipment"}</TableCell>
              <TableCell>{lease.hospital?.organization || "Unknown Hospital"}</TableCell>
              <TableCell>{lease.investor?.organization || "Not Assigned"}</TableCell>
              <TableCell>{formatDate(lease.start_date)}</TableCell>
              <TableCell>{formatDate(lease.end_date)}</TableCell>
              <TableCell>{getTimeRemaining(lease.end_date)}</TableCell>
              <TableCell>Ksh {lease.monthly_payment?.toLocaleString() || "0"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs
                  ${lease.status === 'active' ? 'bg-green-100 text-green-800' : 
                  lease.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'}`}>
                  {lease.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewLeaseDetails(lease)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  
                  {userRole === 'admin' && lease.status === 'active' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(lease.id, 'completed')}
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(lease.id, 'canceled')}
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedLease && (
        <LeaseDetailsDialog
          open={showDetails}
          onClose={() => setShowDetails(false)}
          lease={selectedLease}
        />
      )}
    </>
  );
};

export default LeasesList;
