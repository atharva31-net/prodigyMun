import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, 
  Flag, 
  Globe, 
  GraduationCap, 
  Download, 
  LogOut,
  ArrowLeft,
  Check,
  X,
  Trash2,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getCommitteeById } from "@/lib/committees";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Registration {
  id: number;
  name: string;
  class: string;
  division: string;
  committee: string;
  email?: string;
  suggestions?: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  indianCommittees: number;
  internationalCommittees: number;
  seniorStudents: number;
  pending: number;
  confirmed: number;
  rejected: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrationsResponse, isLoading: loadingRegistrations } = useQuery({
    queryKey: ["/api/registrations"],
  });

  const { data: statsResponse, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/registrations/stats"],
  });

  const registrations = (registrationsResponse as any)?.registrations || [];
  const stats = (statsResponse as any)?.stats;

  // Mutation for updating registration status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/registrations/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations/stats"] });
      toast({
        title: "Status Updated",
        description: "Registration status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update registration status",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting registration
  const deleteRegistrationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/registrations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/registrations/stats"] });
      toast({
        title: "Registration Deleted",
        description: "Registration has been permanently removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete registration",
        variant: "destructive",
      });
    },
  });

  const exportData = () => {
    if (registrations.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Name', 'Class', 'Division', 'Committee', 'Email', 'Suggestions', 'Registration Time'];
    const rows = registrations.map((reg: any) => [
      reg.name,
      reg.class,
      reg.division,
      getCommitteeById(reg.committee)?.name || reg.committee,
      reg.email || 'Not provided',
      reg.suggestions || '',
      new Date(reg.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mun_registrations_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: "Registration data has been downloaded",
    });
  };

  const getCommitteeBadge = (committeeId: string) => {
    const committee = getCommitteeById(committeeId);
    if (!committee) return <Badge variant="secondary">{committeeId}</Badge>;
    
    return (
      <Badge variant="default" className="bg-primary text-primary-foreground">
        {committee.name}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDeleteRegistration = (id: number) => {
    deleteRegistrationMutation.mutate(id);
  };

  if (loadingRegistrations || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex space-x-4">
              <Button onClick={exportData} className="bg-secondary hover:bg-secondary/90">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Link href="/">
                <Button variant="outline">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-foreground">{stats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-foreground">{stats?.pending || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                    <p className="text-xl font-bold text-foreground">{stats?.confirmed || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Rejected</p>
                    <p className="text-xl font-bold text-foreground">{stats?.rejected || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <Flag className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Indian</p>
                    <p className="text-xl font-bold text-foreground">{stats?.indianCommittees || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">International</p>
                    <p className="text-xl font-bold text-foreground">{stats?.internationalCommittees || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-muted-foreground">Senior</p>
                    <p className="text-xl font-bold text-foreground">{stats?.seniorStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registrations Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Student Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No registrations yet</p>
                  <p className="text-sm text-muted-foreground">Students will appear here once they register</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Division</TableHead>
                        <TableHead>Committee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registration Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg: any) => (
                        <TableRow key={reg.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{reg.name}</TableCell>
                          <TableCell>{reg.class}</TableCell>
                          <TableCell>{reg.division}</TableCell>
                          <TableCell>{getCommitteeBadge(reg.committee)}</TableCell>
                          <TableCell>{getStatusBadge(reg.status || 'pending')}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {reg.email || 'Not provided'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(reg.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {reg.status !== 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleStatusUpdate(reg.id, 'confirmed')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              {reg.status !== 'rejected' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                    disabled={deleteRegistrationMutation.isPending}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently delete {reg.name}'s registration? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteRegistration(reg.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
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
      </div>
    </div>
  );
}
