import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Clock, FilePlus, CheckCheck, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExportJob {
  id: string;
  name: string;
  format: string;
  created_at: string;
  status: 'completed' | 'in_progress' | 'failed';
  download_url?: string;
  size?: string;
}

interface ExportOption {
  id: string;
  label: string;
  tables: string[];
  description: string;
}

const DataExport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportName, setExportName] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customFilters, setCustomFilters] = useState('');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const exportOptions: ExportOption[] = [
    {
      id: 'equipment',
      label: 'Equipment Data',
      tables: ['equipment', 'maintenance'],
      description: 'Export all equipment records and maintenance history'
    },
    {
      id: 'financial',
      label: 'Financial Records',
      tables: ['leases', 'transactions', 'invoices'],
      description: 'Export financial transactions, leases, and invoices'
    },
    {
      id: 'users',
      label: 'User Data',
      tables: ['profiles', 'user_preferences'],
      description: 'Export user profiles and preferences'
    },
    {
      id: 'custom',
      label: 'Custom Export',
      tables: [],
      description: 'Select specific tables and data to export'
    }
  ];

  const availableTables = [
    { id: 'equipment', name: 'Equipment' },
    { id: 'maintenance', name: 'Maintenance Records' },
    { id: 'leases', name: 'Leases' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'invoices', name: 'Invoices' },
    { id: 'profiles', name: 'User Profiles' },
    { id: 'messages', name: 'Messages' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'hospitals', name: 'Hospitals' },
    { id: 'hospital_clusters', name: 'Hospital Clusters' }
  ];

  React.useEffect(() => {
    if (user) {
      fetchExportJobs();
    }
  }, [user]);

  const fetchExportJobs = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockExports: ExportJob[] = [
        {
          id: '1',
          name: 'Equipment Export April 2025',
          format: 'csv',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          download_url: '#',
          size: '2.4 MB'
        },
        {
          id: '2',
          name: 'Financial Records Q1 2025',
          format: 'xlsx',
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
          status: 'completed',
          download_url: '#',
          size: '5.7 MB'
        },
        {
          id: '3',
          name: 'Custom Export - Users',
          format: 'json',
          created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
          status: 'completed',
          download_url: '#',
          size: '1.1 MB'
        }
      ];
      
      setExportJobs(mockExports);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching export jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export history',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const startExport = async () => {
    if (!exportName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a name for your export',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedOption) {
      toast({
        title: 'Validation Error',
        description: 'Please select an export option',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedOption === 'custom' && selectedTables.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one table for custom export',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setExportInProgress(true);
      
      toast({
        title: 'Export Started',
        description: 'Your data export is being processed',
      });
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newExport: ExportJob = {
        id: `exp-${Date.now()}`,
        name: exportName,
        format: exportFormat,
        created_at: new Date().toISOString(),
        status: 'completed',
        download_url: '#',
        size: '3.2 MB'
      };
      
      setExportJobs(prev => [newExport, ...prev]);
      
      toast({
        title: 'Export Completed',
        description: 'Your data export is ready for download',
      });
      
      setExportInProgress(false);
      resetForm();
    } catch (error) {
      console.error('Error starting export:', error);
      toast({
        title: 'Error',
        description: 'Failed to process export request',
        variant: 'destructive',
      });
      setExportInProgress(false);
    }
  };

  const downloadExport = (exportId: string) => {
    // In a real system, this would generate a download link
    toast({
      title: 'Download Started',
      description: 'Your export file is being prepared for download',
    });
    
    // Simulate download preparation
    setTimeout(() => {
      toast({
        title: 'Download Ready',
        description: 'Your export file is ready to download',
      });
    }, 2000);
  };

  const resetForm = () => {
    setExportName('');
    setSelectedOption(null);
    setCustomFilters('');
    setSelectedTables([]);
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId);
    
    // If not custom, pre-select tables based on the option
    if (optionId !== 'custom') {
      const option = exportOptions.find(opt => opt.id === optionId);
      if (option) {
        setSelectedTables(option.tables);
      }
    } else {
      setSelectedTables([]);
    }
  };

  const toggleTable = (tableId: string) => {
    setSelectedTables(prev => 
      prev.includes(tableId)
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const selectCreateTab = () => {
    const createTab = document.querySelector('[data-value="create"]');
    if (createTab && createTab instanceof HTMLElement) {
      createTab.click();
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Please sign in to export data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-red-600" />
            <CardTitle>Data Export</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExportJobs}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
        <CardDescription>
          Export your data in various formats for analysis and backup
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="create" className="h-full flex flex-col">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="create">Create Export</TabsTrigger>
              <TabsTrigger value="history">Export History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create" className="flex-1 overflow-auto p-4 mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-name">Export Name</Label>
                <Input
                  id="export-name"
                  placeholder="Enter a name for this export"
                  value={exportName}
                  onChange={e => setExportName(e.target.value)}
                  disabled={exportInProgress}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select 
                  value={exportFormat} 
                  onValueChange={setExportFormat} 
                  disabled={exportInProgress}
                >
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label>Export Options</Label>
                <div className="grid grid-cols-1 gap-3">
                  {exportOptions.map(option => (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedOption === option.id 
                          ? 'border-red-600 bg-red-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionChange(option.id)}
                    >
                      <div className="flex items-start">
                        <Checkbox
                          checked={selectedOption === option.id}
                          onCheckedChange={() => handleOptionChange(option.id)}
                          className="mt-0.5"
                        />
                        <div className="ml-2">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedOption === 'custom' && (
                <div className="space-y-3 p-3 border rounded-lg">
                  <Label>Select Tables to Export</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTables.map(table => (
                      <div key={table.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`table-${table.id}`}
                          checked={selectedTables.includes(table.id)}
                          onCheckedChange={() => toggleTable(table.id)}
                        />
                        <Label htmlFor={`table-${table.id}`} className="cursor-pointer">
                          {table.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="custom-filters">Custom Filters (SQL WHERE clause)</Label>
                    <Textarea
                      id="custom-filters"
                      placeholder="E.g., created_at > '2025-01-01'"
                      value={customFilters}
                      onChange={e => setCustomFilters(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <p className="text-xs text-gray-500">
                      Optional: Add SQL WHERE conditions to filter the exported data
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={startExport}
                  disabled={
                    exportInProgress || 
                    !exportName.trim() || 
                    !selectedOption || 
                    (selectedOption === 'custom' && selectedTables.length === 0)
                  }
                >
                  {exportInProgress ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Processing Export...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Export
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="flex-1 overflow-auto p-4 mt-0">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader className="h-6 w-6 animate-spin text-red-600" />
              </div>
            ) : exportJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <FilePlus className="h-12 w-12 text-gray-300 mb-2" />
                <p>No exports found</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={selectCreateTab}
                >
                  Create Your First Export
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportJobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.name}</TableCell>
                      <TableCell className="uppercase">{job.format}</TableCell>
                      <TableCell>
                        {format(new Date(job.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{job.size || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          job.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : job.status === 'in_progress' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {job.status === 'completed' && <CheckCheck className="h-3 w-3 mr-1" />}
                          {job.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                          {job.status === 'completed' ? 'Completed' : job.status === 'in_progress' ? 'Processing' : 'Failed'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadExport(job.id)}
                          disabled={job.status !== 'completed'}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

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

export default DataExport;
