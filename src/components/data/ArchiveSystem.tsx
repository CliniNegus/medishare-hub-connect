
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Search, RefreshCw, Loader, FileCheck, Clock, X, CheckCheck, ArrowUpDown, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths, isAfter } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface ArchivedItem {
  id: string;
  entity_type: string;
  entity_id: string;
  entity_name?: string;
  archived_at: string;
  archived_by: string;
  reason: string;
  can_restore: boolean;
  status: 'archived' | 'restored';
  metadata?: Record<string, any>;
}

interface ArchivePolicy {
  id: string;
  entity_type: string;
  criteria: string;
  retention_period: number;
  auto_archive: boolean;
  created_at: string;
  last_run?: string;
}

const ArchiveSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [policies, setPolicies] = useState<ArchivePolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [policyName, setPolicyName] = useState('');
  const [policyEntity, setPolicyEntity] = useState('equipment');
  const [policyCriteria, setPolicyCriteria] = useState('');
  const [policyRetention, setPolicyRetention] = useState('12');
  const [policyAutoArchive, setPolicyAutoArchive] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [restoringItems, setRestoringItems] = useState<string[]>([]);

  React.useEffect(() => {
    if (user) {
      fetchArchivedItems();
      fetchPolicies();
    }
  }, [user]);

  const fetchArchivedItems = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockArchived: ArchivedItem[] = [];
      const entityTypes = ['equipment', 'lease', 'maintenance', 'payment', 'user', 'hospital'];
      const reasons = [
        'Obsolete equipment',
        'Completed lease',
        'Inactive for 2+ years',
        'Equipment replacement',
        'Expired contract',
        'Hospital closure',
      ];
      
      const getRandomDate = (maxMonthsAgo: number = 36) => {
        const now = new Date();
        const monthsAgo = Math.floor(Math.random() * maxMonthsAgo) + 1;
        return subMonths(now, monthsAgo).toISOString();
      };
      
      for (let i = 0; i < 50; i++) {
        const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
        const archivedDate = getRandomDate();
        
        mockArchived.push({
          id: `archive-${i}`,
          entity_type: entityType,
          entity_id: `${entityType}-${Math.floor(Math.random() * 1000)}`,
          entity_name: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${Math.floor(Math.random() * 1000)}`,
          archived_at: archivedDate,
          archived_by: `user${Math.floor(Math.random() * 10)}@example.com`,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          can_restore: isAfter(new Date(archivedDate), subMonths(new Date(), 24)),
          status: Math.random() > 0.1 ? 'archived' : 'restored',
          metadata: {
            created_at: subMonths(new Date(archivedDate), Math.floor(Math.random() * 24)).toISOString(),
            last_updated: subMonths(new Date(archivedDate), Math.floor(Math.random() * 6)).toISOString(),
          }
        });
      }
      
      // Sort by archived date, newest first
      mockArchived.sort((a, b) => new Date(b.archived_at).getTime() - new Date(a.archived_at).getTime());
      
      // Apply filters
      let filteredItems = mockArchived;
      
      if (entityFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.entity_type === entityFilter);
      }
      
      if (dateFilter !== 'all') {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (dateFilter) {
          case '3months':
            cutoffDate = subMonths(now, 3);
            break;
          case '6months':
            cutoffDate = subMonths(now, 6);
            break;
          case '1year':
            cutoffDate = subMonths(now, 12);
            break;
        }
        
        filteredItems = filteredItems.filter(item => 
          new Date(item.archived_at) > cutoffDate
        );
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.entity_type.toLowerCase().includes(term) ||
          item.entity_id.toLowerCase().includes(term) ||
          (item.entity_name?.toLowerCase().includes(term) || false) ||
          item.reason.toLowerCase().includes(term)
        );
      }
      
      setArchivedItems(filteredItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching archived items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load archived items',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const fetchPolicies = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockPolicies: ArchivePolicy[] = [
        {
          id: 'pol-1',
          entity_type: 'equipment',
          criteria: 'condition = "obsolete" OR last_used < now() - interval "2 years"',
          retention_period: 24,
          auto_archive: true,
          created_at: subMonths(new Date(), 6).toISOString(),
          last_run: subMonths(new Date(), 1).toISOString(),
        },
        {
          id: 'pol-2',
          entity_type: 'lease',
          criteria: 'status = "completed" AND end_date < now() - interval "1 year"',
          retention_period: 36,
          auto_archive: true,
          created_at: subMonths(new Date(), 4).toISOString(),
          last_run: new Date().toISOString(),
        },
        {
          id: 'pol-3',
          entity_type: 'maintenance',
          criteria: 'status = "completed" AND completed_date < now() - interval "3 years"',
          retention_period: 60,
          auto_archive: false,
          created_at: subMonths(new Date(), 2).toISOString(),
        }
      ];
      
      setPolicies(mockPolicies);
    } catch (error) {
      console.error('Error fetching archive policies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load archive policies',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArchivedItems();
  };

  const savePolicy = async () => {
    if (!policyName.trim() || !policyCriteria.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSavingPolicy(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPolicy: ArchivePolicy = {
        id: `pol-${Date.now()}`,
        entity_type: policyEntity,
        criteria: policyCriteria,
        retention_period: Number(policyRetention),
        auto_archive: policyAutoArchive,
        created_at: new Date().toISOString(),
      };
      
      setPolicies(prev => [newPolicy, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Archive policy has been created',
      });
      
      // Reset form
      setPolicyName('');
      setPolicyEntity('equipment');
      setPolicyCriteria('');
      setPolicyRetention('12');
      setPolicyAutoArchive(false);
      
      setSavingPolicy(false);
    } catch (error) {
      console.error('Error saving archive policy:', error);
      toast({
        title: 'Error',
        description: 'Failed to create archive policy',
        variant: 'destructive',
      });
      setSavingPolicy(false);
    }
  };

  const runPolicyNow = async (policyId: string) => {
    try {
      toast({
        title: 'Policy Execution Started',
        description: 'The archiving policy is now being executed',
      });
      
      // Simulate execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last run time
      setPolicies(prev => 
        prev.map(policy => 
          policy.id === policyId 
            ? { ...policy, last_run: new Date().toISOString() } 
            : policy
        )
      );
      
      toast({
        title: 'Policy Execution Complete',
        description: 'The archiving policy has been executed successfully',
      });
      
      // Refresh archived items to show any new ones
      fetchArchivedItems();
    } catch (error) {
      console.error('Error running archive policy:', error);
      toast({
        title: 'Error',
        description: 'Failed to execute archive policy',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === archivedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(archivedItems.map(item => item.id));
    }
  };

  const restoreItems = async (itemIds: string[]) => {
    try {
      setRestoringItems(itemIds);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update items status
      setArchivedItems(prev => 
        prev.map(item => 
          itemIds.includes(item.id) 
            ? { ...item, status: 'restored' } 
            : item
        )
      );
      
      setSelectedItems(prev => prev.filter(id => !itemIds.includes(id)));
      setRestoringItems([]);
      
      toast({
        title: 'Success',
        description: `${itemIds.length} item(s) have been restored`,
      });
    } catch (error) {
      console.error('Error restoring archived items:', error);
      toast({
        title: 'Error',
        description: 'Failed to restore selected items',
        variant: 'destructive',
      });
      setRestoringItems([]);
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Archive System</CardTitle>
          <CardDescription>Please sign in to manage archived records</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Archive className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Archive System</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchArchivedItems();
              fetchPolicies();
            }}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Archive and restore historical records
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="archived" className="h-full flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="archived">Archived Records</TabsTrigger>
              <TabsTrigger value="policies">Archive Policies</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="archived" className="flex-1 overflow-auto p-4 mt-0 flex flex-col">
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search archived records..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="w-36">
                    <Select value={entityFilter} onValueChange={setEntityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Entity Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="lease">Lease</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-36">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Filter
                  </Button>
                </div>
              </form>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="bg-gray-50 p-3 mb-4 rounded-lg flex justify-between items-center">
                <div className="text-sm">
                  {selectedItems.length} item(s) selected
                </div>
                <Button
                  onClick={() => restoreItems(selectedItems)}
                  disabled={
                    restoringItems.length > 0 || 
                    selectedItems.some(id => {
                      const item = archivedItems.find(i => i.id === id);
                      return !item?.can_restore || item?.status === 'restored';
                    })
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  {restoringItems.length > 0 ? (
                    <>
                      <Loader className="h-4 w-4 mr-1 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    'Restore Selected'
                  )}
                </Button>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-red-600" />
                </div>
              ) : archivedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Archive className="h-16 w-16 text-gray-300 mb-2" />
                  <p>No archived records found matching your criteria</p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30px]">
                          <Checkbox
                            checked={selectedItems.length === archivedItems.length && archivedItems.length > 0}
                            onCheckedChange={selectAllItems}
                          />
                        </TableHead>
                        <TableHead>Date Archived</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Record</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {archivedItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="p-0 text-center">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => toggleSelectItem(item.id)}
                              disabled={item.status === 'restored' || !item.can_restore}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(item.archived_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">{item.entity_type}</span>
                          </TableCell>
                          <TableCell>
                            <div>{item.entity_name || item.entity_id}</div>
                            <div className="text-xs text-gray-500">{item.entity_id}</div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.reason}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              item.status === 'archived' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.status === 'archived' ? 'Archived' : 'Restored'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="end">
                                <div className="p-4 border-b">
                                  <h3 className="font-medium">Record Details</h3>
                                </div>
                                <div className="p-4 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Archived By:</span>
                                    <span>{item.archived_by}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Original Created:</span>
                                    <span>{item.metadata?.created_at ? format(new Date(item.metadata.created_at), 'MMM d, yyyy') : 'Unknown'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Last Updated:</span>
                                    <span>{item.metadata?.last_updated ? format(new Date(item.metadata.last_updated), 'MMM d, yyyy') : 'Unknown'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Can Restore:</span>
                                    <span>{item.can_restore ? 'Yes' : 'No'}</span>
                                  </div>
                                </div>
                                <div className="p-2 bg-gray-50 border-t">
                                  <Button
                                    className="w-full bg-red-600 hover:bg-red-700"
                                    disabled={
                                      item.status === 'restored' || 
                                      !item.can_restore || 
                                      restoringItems.includes(item.id)
                                    }
                                    onClick={() => restoreItems([item.id])}
                                  >
                                    {restoringItems.includes(item.id) ? (
                                      <>
                                        <Loader className="h-4 w-4 mr-1 animate-spin" />
                                        Restoring...
                                      </>
                                    ) : item.status === 'restored' ? (
                                      'Already Restored'
                                    ) : !item.can_restore ? (
                                      'Cannot Restore'
                                    ) : (
                                      'Restore Item'
                                    )}
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="policies" className="flex-1 overflow-auto p-4 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Archive Policies</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity Type</TableHead>
                        <TableHead>Criteria</TableHead>
                        <TableHead>Retention (months)</TableHead>
                        <TableHead>Auto Archive</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {policies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No archive policies defined
                          </TableCell>
                        </TableRow>
                      ) : (
                        policies.map(policy => (
                          <TableRow key={policy.id}>
                            <TableCell className="font-medium capitalize">
                              {policy.entity_type}
                            </TableCell>
                            <TableCell className="max-w-[180px] truncate" title={policy.criteria}>
                              {policy.criteria}
                            </TableCell>
                            <TableCell className="text-center">
                              {policy.retention_period}
                            </TableCell>
                            <TableCell>
                              {policy.auto_archive ? (
                                <CheckCheck className="h-5 w-5 text-green-600" />
                              ) : (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => runPolicyNow(policy.id)}
                                  className="text-xs px-2"
                                >
                                  Run Now
                                </Button>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[250px] p-0" align="center">
                                    <div className="p-3 border-b">
                                      <h3 className="font-medium">Schedule Info</h3>
                                    </div>
                                    <div className="p-3 space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Created:</span>
                                        <span>{format(new Date(policy.created_at), 'MMM d, yyyy')}</span>
                                      </div>
                                      {policy.last_run && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500">Last Run:</span>
                                          <span>{format(new Date(policy.last_run), 'MMM d, yyyy HH:mm')}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Auto Schedule:</span>
                                        <span>{policy.auto_archive ? 'Daily' : 'Manual'}</span>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Create Archive Policy</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="policy-name">Policy Name</Label>
                    <Input
                      id="policy-name"
                      placeholder="Enter policy name"
                      value={policyName}
                      onChange={e => setPolicyName(e.target.value)}
                      disabled={savingPolicy}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-entity">Entity Type</Label>
                    <Select value={policyEntity} onValueChange={setPolicyEntity} disabled={savingPolicy}>
                      <SelectTrigger id="policy-entity">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="lease">Lease</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-criteria">Criteria (SQL WHERE clause)</Label>
                    <Textarea
                      id="policy-criteria"
                      placeholder='E.g., status = "completed" AND updated_at < now() - interval "2 years"'
                      value={policyCriteria}
                      onChange={e => setPolicyCriteria(e.target.value)}
                      disabled={savingPolicy}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-500">
                      Define conditions for records that should be archived
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="policy-retention">Retention Period (months)</Label>
                    <Select value={policyRetention} onValueChange={setPolicyRetention} disabled={savingPolicy}>
                      <SelectTrigger id="policy-retention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                        <SelectItem value="24">2 years</SelectItem>
                        <SelectItem value="36">3 years</SelectItem>
                        <SelectItem value="60">5 years</SelectItem>
                        <SelectItem value="120">10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="policy-auto-archive"
                      checked={policyAutoArchive}
                      onCheckedChange={(checked) => setPolicyAutoArchive(!!checked)}
                      disabled={savingPolicy}
                    />
                    <Label htmlFor="policy-auto-archive" className="cursor-pointer">
                      Enable automatic archiving (runs daily)
                    </Label>
                  </div>
                  
                  <Button
                    className="w-full mt-4 bg-red-600 hover:bg-red-700"
                    onClick={savePolicy}
                    disabled={savingPolicy || !policyName.trim() || !policyCriteria.trim()}
                  >
                    {savingPolicy ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Saving Policy...
                      </>
                    ) : (
                      'Save Policy'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Create Textarea component locally since it wasn't imported
const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default ArchiveSystem;
