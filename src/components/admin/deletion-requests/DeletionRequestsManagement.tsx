import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Check, X, Eye, Search, RefreshCw, AlertTriangle, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface DeletionRequest {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string | null;
  account_type: string | null;
  reason: string | null;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  completed_at: string | null;
  admin_notes: string | null;
}

const DeletionRequestsManagement = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deletion_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching deletion requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch deletion requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (req) =>
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewRequest = (request: DeletionRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setViewDialogOpen(true);
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !user) return;
    setProcessing(true);

    try {
      const { error } = await supabase
        .from('deletion_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          admin_notes: adminNotes,
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast({
        title: 'Request Rejected',
        description: 'The deletion request has been rejected.',
      });

      setViewDialogOpen(false);
      fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the request',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveAndDelete = async () => {
    if (!selectedRequest || !user) return;
    setProcessing(true);

    try {
      // First update the request status to approved
      const { error: updateError } = await supabase
        .from('deletion_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          admin_notes: adminNotes,
        })
        .eq('id', selectedRequest.id);

      if (updateError) throw updateError;

      // If there's a user_id, permanently delete the account
      if (selectedRequest.user_id) {
        const { error: deleteError } = await supabase.rpc('permanent_delete_account', {
          target_user_id: selectedRequest.user_id,
        });

        if (deleteError) {
          console.error('Error deleting account:', deleteError);
          // Still mark as approved but not completed
          toast({
            title: 'Partial Success',
            description: 'Request approved but account deletion failed. Manual intervention required.',
            variant: 'destructive',
          });
          setViewDialogOpen(false);
          setConfirmDeleteOpen(false);
          fetchRequests();
          return;
        }
      }

      // Mark as completed
      const { error: completeError } = await supabase
        .from('deletion_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', selectedRequest.id);

      if (completeError) throw completeError;

      toast({
        title: 'Account Deleted',
        description: selectedRequest.user_id 
          ? 'The account and all associated data have been permanently deleted.'
          : 'The deletion request has been marked as completed.',
      });

      setViewDialogOpen(false);
      setConfirmDeleteOpen(false);
      fetchRequests();
    } catch (error: any) {
      console.error('Error processing deletion:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process the deletion',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-destructive" />
                Account Deletion Requests
              </CardTitle>
              <CardDescription>
                Review and process user account deletion requests
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No matching requests found' : 'No deletion requests yet'}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.email}</TableCell>
                      <TableCell>{request.full_name || '-'}</TableCell>
                      <TableCell className="capitalize">{request.account_type || '-'}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {format(new Date(request.requested_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View/Manage Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Deletion Request Details</DialogTitle>
            <DialogDescription>
              Review the request and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedRequest.full_name || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Type</p>
                  <p className="font-medium capitalize">{selectedRequest.account_type || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-muted-foreground">User ID</p>
                  <p className="font-mono text-xs">{selectedRequest.user_id || 'Not linked'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested</p>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.requested_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              {selectedRequest.reason && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Reason</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedRequest.reason}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground text-sm mb-1">Admin Notes</p>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  disabled={selectedRequest.status === 'completed'}
                />
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      {selectedRequest.user_id
                        ? 'Approving this request will permanently delete the user account and all associated data. This action cannot be undone.'
                        : 'No user account is linked to this email. The request will be marked as completed.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleRejectRequest}
                  disabled={processing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={processing}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Approve & Delete
                </Button>
              </>
            )}
            {selectedRequest?.status !== 'pending' && (
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Deletion Alert */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Permanent Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRequest?.user_id ? (
                <>
                  This will permanently delete the account for{' '}
                  <strong>{selectedRequest?.email}</strong> and all associated data including:
                  <ul className="list-disc list-inside mt-2 text-left">
                    <li>Profile information</li>
                    <li>Orders and transactions</li>
                    <li>Equipment listings</li>
                    <li>Notifications</li>
                    <li>All other related records</li>
                  </ul>
                  <p className="mt-2 font-semibold text-destructive">
                    This action cannot be undone.
                  </p>
                </>
              ) : (
                <>
                  No user account is linked to this email. The deletion request will be marked as
                  completed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveAndDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'Processing...' : 'Confirm Deletion'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeletionRequestsManagement;
