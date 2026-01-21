import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building2,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ManufacturerApprovalDetail from './ManufacturerApprovalDetail';

interface ManufacturerOnboarding {
  id: string;
  user_id: string;
  company_name: string | null;
  shop_name: string | null;
  status: string | null;
  business_models: string[] | null;
  submitted_at: string | null;
  created_at: string | null;
  contact_email: string | null;
  country: string | null;
  credit_limit: number | null;
  payment_cycle: number | null;
  billing_basis: string | null;
  returns_policy: string | null;
  usage_policy: string | null;
  direct_payment_terms: string | null;
  product_categories: string[] | null;
  shop_description: string | null;
  shop_logo_url: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

const ManufacturerApprovals = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ManufacturerOnboarding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ManufacturerOnboarding | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('manufacturer_onboarding')
        .select('*')
        .order('submitted_at', { ascending: false, nullsFirst: false });

      // Filter out drafts that haven't been submitted
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      } else {
        // Show all except draft status (only submitted items)
        query = query.neq('status', 'draft');
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load manufacturer submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Submission list has been updated',
    });
  };

  const filteredSubmissions = submissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.company_name?.toLowerCase().includes(searchLower) ||
      submission.shop_name?.toLowerCase().includes(searchLower) ||
      submission.contact_email?.toLowerCase().includes(searchLower) ||
      submission.country?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBusinessModels = (models: string[] | null) => {
    if (!models || models.length === 0) return '-';
    return models.map(m => m.replace(/_/g, ' ')).join(', ');
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (selectedSubmission) {
    return (
      <ManufacturerApprovalDetail
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
        onUpdate={() => {
          fetchSubmissions();
          setSelectedSubmission(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-[#333333]">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-[#333333] opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-[#333333]">
              Manufacturer Approval Queue
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, shop, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submitted</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-[#333333]">No submissions found</h3>
              <p className="text-muted-foreground mt-1">
                {statusFilter !== 'all'
                  ? 'Try changing the filter to see more results'
                  : 'No manufacturer submissions are available for review'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Business Models</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#333333]">
                            {submission.company_name || 'Unknown Company'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {submission.shop_name || submission.contact_email || '-'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(submission.submitted_at)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatBusinessModels(submission.business_models)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {submission.country || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                          className="hover:bg-[#E02020] hover:text-white hover:border-[#E02020]"
                        >
                          Review
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
    </div>
  );
};

export default ManufacturerApprovals;
