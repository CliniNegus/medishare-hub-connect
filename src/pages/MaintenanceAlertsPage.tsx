
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, AlertTriangle, Clock, Wrench, Eye, Calendar, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useMaintenanceAlerts } from '@/hooks/useMaintenanceAlerts';
import { format } from 'date-fns';
import ScheduleMaintenanceModal from '@/components/admin/maintenance/ScheduleMaintenanceModal';

const MaintenanceAlertsPage = () => {
  const navigate = useNavigate();
  const { alerts, loading, filterAlerts, updateAlertStatus, getAlertCounts } = useMaintenanceAlerts();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alertCounts = getAlertCounts();

  const handleFilterChange = () => {
    filterAlerts({
      location: locationFilter || undefined,
      urgency: urgencyFilter || undefined,
      status: statusFilter || undefined,
      searchTerm: searchTerm || undefined
    });
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [searchTerm, locationFilter, urgencyFilter, statusFilter]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIssueIcon = (issueType: string) => {
    switch (issueType) {
      case 'calibration_overdue': return <Clock className="h-4 w-4" />;
      case 'error_codes': return <AlertTriangle className="h-4 w-4" />;
      case 'repair_needed': return <Wrench className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatIssueType = (issueType: string) => {
    return issueType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleScheduleMaintenance = (alert: any) => {
    setSelectedAlert(alert);
    setScheduleModalOpen(true);
  };

  const handleResolveAlert = async (alertId: string) => {
    await updateAlertStatus(alertId, 'resolved');
  };

  const uniqueLocations = [...new Set(alerts.map(alert => alert.location))];

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="border-[#E02020] text-[#E02020] hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Maintenance Alerts</h1>
              <p className="text-gray-600">Manage equipment maintenance alerts and schedule repairs</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-red-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-900">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{alertCounts.critical}</div>
            </CardContent>
          </Card>
          <Card className="border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-900">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{alertCounts.high}</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-900">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{alertCounts.pending}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-900">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{alertCounts.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search equipment, location, or issue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Urgency</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading alerts...
                    </TableCell>
                  </TableRow>
                ) : alerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No maintenance alerts found
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getIssueIcon(alert.issue_type)}
                          <div>
                            <div className="font-medium">{alert.equipment_name}</div>
                            <div className="text-sm text-gray-500">{formatIssueType(alert.issue_type)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{alert.location}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="text-sm">{alert.issue_description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getUrgencyColor(alert.urgency)}>
                          {alert.urgency.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(alert.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {alert.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleScheduleMaintenance(alert)}
                              className="border-[#E02020] text-[#E02020] hover:bg-red-50"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                          )}
                          {alert.status !== 'resolved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ScheduleMaintenanceModal
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          selectedAlert={selectedAlert}
          onScheduled={() => {
            setScheduleModalOpen(false);
            setSelectedAlert(null);
          }}
        />
      </div>
    </div>
  );
};

export default MaintenanceAlertsPage;
