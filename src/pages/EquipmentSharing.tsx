import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  RefreshCcw, 
  ArrowLeftRight, 
  Inbox, 
  Send, 
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useEquipmentSharing, EquipmentRequest } from '@/hooks/use-equipment-sharing';
import { useAuth } from '@/contexts/AuthContext';
import { RequestCard } from '@/components/equipment-sharing/RequestCard';
import { TransferCard } from '@/components/equipment-sharing/TransferCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const EquipmentSharing = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [responseModal, setResponseModal] = useState<{ open: boolean; requestId: string; action: 'approve' | 'reject' } | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [responding, setResponding] = useState(false);
  
  const { user } = useAuth();
  const { requests, transfers, loading, respondToRequest, cancelRequest, updateTransferStatus, refetch } = useEquipmentSharing();

  const incomingRequests = requests.filter(r => r.owning_hospital_id === user?.id);
  const outgoingRequests = requests.filter(r => r.requesting_hospital_id === user?.id);

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    active: transfers.filter(t => ['scheduled', 'picked_up', 'in_transit'].includes(t.status)).length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const handleApprove = (requestId: string) => {
    setResponseModal({ open: true, requestId, action: 'approve' });
  };

  const handleReject = (requestId: string) => {
    setResponseModal({ open: true, requestId, action: 'reject' });
  };

  const handleSubmitResponse = async () => {
    if (!responseModal) return;
    
    setResponding(true);
    await respondToRequest(responseModal.requestId, responseModal.action === 'approve' ? 'approved' : 'rejected', responseNotes);
    setResponding(false);
    setResponseModal(null);
    setResponseNotes('');
  };

  const filteredIncoming = incomingRequests.filter(r => 
    r.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requesting_hospital?.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOutgoing = outgoingRequests.filter(r => 
    r.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.owning_hospital?.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
              Equipment Sharing
            </h1>
            <p className="text-muted-foreground">
              Request, share, and track equipment between hospitals
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">Active Transfers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="incoming" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Incoming
              {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {incomingRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Outgoing
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transfers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-6">
            {filteredIncoming.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Incoming Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    When other hospitals request your equipment, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIncoming.map(request => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="mt-6">
            {filteredOutgoing.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Outgoing Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Request equipment from other hospitals to see your requests here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOutgoing.map(request => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onCancel={cancelRequest}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transfers" className="mt-6">
            {transfers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Active Transfers</h3>
                  <p className="text-sm text-muted-foreground">
                    Approved equipment requests will create transfer records here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transfers.map(transfer => (
                  <TransferCard
                    key={transfer.id}
                    transfer={transfer}
                    onUpdateStatus={(id, status) => updateTransferStatus(id, status)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Response Modal */}
      <Dialog open={responseModal?.open || false} onOpenChange={() => setResponseModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseModal?.action === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {responseModal?.action === 'approve' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <p className="font-medium">
                  {responseModal?.action === 'approve' 
                    ? 'This will approve the equipment request and create a transfer record.'
                    : 'This will reject the equipment request.'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Response Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes or instructions..."
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseModal(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitResponse}
              disabled={responding}
              variant={responseModal?.action === 'reject' ? 'destructive' : 'default'}
            >
              {responding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {responseModal?.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EquipmentSharing;
