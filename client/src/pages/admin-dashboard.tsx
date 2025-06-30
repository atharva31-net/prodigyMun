import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Flag, 
  Globe, 
  GraduationCap, 
  Download, 
  LogOut,
  ArrowLeft 
} from "lucide-react";
import { getCommitteeById } from "@/lib/committees";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: number;
  name: string;
  class: string;
  division: string;
  committee: string;
  email?: string;
  suggestions?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  indianCommittees: number;
  internationalCommittees: number;
  seniorStudents: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();

  const { data: registrationsResponse, isLoading: loadingRegistrations } = useQuery({
    queryKey: ["/api/registrations"],
  });

  const { data: statsResponse, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/registrations/stats"],
  });

  const registrations = registrationsResponse?.registrations || [];
  const stats = statsResponse?.stats;

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
    const rows = registrations.map(reg => [
      reg.name,
      reg.class,
      reg.division,
      getCommitteeById(reg.committee)?.name || reg.committee,
      reg.email || 'Not provided',
      reg.suggestions || '',
      new Date(reg.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.total || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Flag className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Indian Committees</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.indianCommittees || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">International</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.internationalCommittees || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <GraduationCap className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">Senior Students</p>
                    <p className="text-2xl font-bold text-foreground">{stats?.seniorStudents || 0}</p>
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
                        <TableHead>Email</TableHead>
                        <TableHead>Registration Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg) => (
                        <TableRow key={reg.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{reg.name}</TableCell>
                          <TableCell>{reg.class}</TableCell>
                          <TableCell>{reg.division}</TableCell>
                          <TableCell>{getCommitteeBadge(reg.committee)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {reg.email || 'Not provided'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(reg.createdAt).toLocaleString()}
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
