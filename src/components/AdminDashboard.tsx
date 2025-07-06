import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Shield, Users, GraduationCap, BookOpen, TrendingUp, Download, Search, Plus } from "lucide-react";

interface AdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

export const AdminDashboard = ({ userData, onLogout }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for admin analytics
  const overallStats = {
    totalStudents: 1250,
    totalFaculty: 85,
    totalSubjects: 180,
    feedbackSubmitted: 1125,
    responseRate: 90
  };

  const departmentData = [
    { name: 'Computer Science', faculty: 25, students: 450, avgRating: 8.7, feedbackCount: 420 },
    { name: 'Mathematics', faculty: 20, students: 300, avgRating: 8.9, feedbackCount: 285 },
    { name: 'Physics', faculty: 18, students: 250, avgRating: 8.5, feedbackCount: 235 },
    { name: 'Chemistry', faculty: 15, students: 200, avgRating: 8.8, feedbackCount: 185 },
    { name: 'Biology', faculty: 12, students: 150, avgRating: 9.1, feedbackCount: 145 }
  ];

  const monthlyTrends = [
    { month: 'Jan', responses: 950, avgRating: 8.4 },
    { month: 'Feb', responses: 1050, avgRating: 8.6 },
    { month: 'Mar', responses: 1100, avgRating: 8.7 },
    { month: 'Apr', responses: 1125, avgRating: 8.8 },
    { month: 'May', responses: 1080, avgRating: 8.5 }
  ];

  const topPerformingFaculty = [
    { name: 'Dr. Sarah Johnson', department: 'Computer Science', rating: 9.4, responses: 45 },
    { name: 'Prof. Michael Chen', department: 'Mathematics', rating: 9.2, responses: 38 },
    { name: 'Dr. Emily Rodriguez', department: 'Physics', rating: 9.1, responses: 42 },
    { name: 'Prof. David Wilson', department: 'Chemistry', rating: 9.0, responses: 35 },
    { name: 'Dr. Lisa Anderson', department: 'Biology', rating: 8.9, responses: 40 }
  ];

  const recentFeedback = [
    { student: 'Anonymous', faculty: 'Dr. Sarah Johnson', subject: 'Data Structures', rating: 9, date: '2024-01-15' },
    { student: 'Anonymous', faculty: 'Prof. Michael Chen', subject: 'Calculus II', rating: 8, date: '2024-01-15' },
    { student: 'Anonymous', faculty: 'Dr. Emily Rodriguez', subject: 'Quantum Physics', rating: 9, date: '2024-01-14' },
    { student: 'Anonymous', faculty: 'Prof. David Wilson', subject: 'Organic Chemistry', rating: 8, date: '2024-01-14' },
    { student: 'Anonymous', faculty: 'Dr. Lisa Anderson', subject: 'Molecular Biology', rating: 10, date: '2024-01-13' }
  ];

  const handleExportData = () => {
    // In a real app, this would generate and download a report
    alert('Report download started! (Demo)');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80">System Overview & Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="secondary" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalStudents.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <GraduationCap className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalFaculty}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalSubjects}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.feedbackSubmitted.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{overallStats.responseRate}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Response Trends</CardTitle>
                  <CardDescription>Monthly feedback response patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="responses" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Performance */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Average ratings by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis domain={[8, 10]} />
                      <Tooltip />
                      <Bar dataKey="avgRating" fill="hsl(var(--success))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest student feedback submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFeedback.map((feedback, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{feedback.subject}</p>
                        <p className="text-sm text-muted-foreground">Faculty: {feedback.faculty}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={feedback.rating >= 9 ? 'default' : feedback.rating >= 7 ? 'secondary' : 'destructive'}>
                          {feedback.rating}/10
                        </Badge>
                        <span className="text-sm text-muted-foreground">{feedback.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Performance metrics for each department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{dept.name}</h3>
                        <Badge variant="default" className="text-lg px-3 py-1">
                          {dept.avgRating}/10
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Faculty: </span>
                          <span className="font-medium">{dept.faculty}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Students: </span>
                          <span className="font-medium">{dept.students}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Responses: </span>
                          <span className="font-medium">{dept.feedbackCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Response Rate: </span>
                          <span className="font-medium text-success">
                            {((dept.feedbackCount / dept.students) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Faculty</CardTitle>
                <CardDescription>Faculty members with highest ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingFaculty.map((faculty, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{faculty.name}</p>
                        <p className="text-sm text-muted-foreground">{faculty.department}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {faculty.responses} responses
                        </span>
                        <Badge variant="default">
                          {faculty.rating}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-primary" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Faculty
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Manage Subjects
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure feedback system parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback Period</label>
                    <Select defaultValue="semester">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semester">Per Semester</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Anonymous Feedback</label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};