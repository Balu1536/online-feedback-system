import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GraduationCap, TrendingUp, Users, Star, BookOpen } from "lucide-react";

interface FacultyDashboardProps {
  userData: any;
  onLogout: () => void;
}

export const FacultyDashboard = ({ userData, onLogout }: FacultyDashboardProps) => {
  // Mock feedback data for the faculty
  const feedbackData = [
    { criteria: 'Punctuality', score: 8.5, maxScore: 10 },
    { criteria: 'Teaching Quality', score: 9.2, maxScore: 10 },
    { criteria: 'Understandability', score: 8.8, maxScore: 10 },
    { criteria: 'Student Interaction', score: 9.0, maxScore: 10 },
    { criteria: 'Communication', score: 8.7, maxScore: 10 },
    { criteria: 'Syllabus Coverage', score: 9.3, maxScore: 10 }
  ];

  const overallRating = feedbackData.reduce((sum, item) => sum + item.score, 0) / feedbackData.length;

  const subjects = [
    { name: 'Data Structures', students: 45, feedbackCount: 42, avgRating: 8.9 },
    { name: 'Database Systems', students: 38, feedbackCount: 35, avgRating: 9.1 },
    { name: 'Software Engineering', students: 52, feedbackCount: 48, avgRating: 8.7 }
  ];

  const ratingDistribution = [
    { name: '9-10 (Excellent)', value: 65, color: '#10B981' },
    { name: '7-8 (Good)', value: 25, color: '#F59E0B' },
    { name: '5-6 (Average)', value: 8, color: '#EF4444' },
    { name: '1-4 (Poor)', value: 2, color: '#DC2626' }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-success';
    if (rating >= 7) return 'text-warning';
    if (rating >= 5) return 'text-orange-500';
    return 'text-destructive';
  };

  const getRatingBadgeVariant = (rating: number) => {
    if (rating >= 9) return 'default';
    if (rating >= 7) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
              <p className="text-white/80">Welcome back, {userData.name}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallRating.toFixed(1)}/10</div>
              <p className="text-xs text-muted-foreground">
                Across all criteria
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135</div>
              <p className="text-xs text-muted-foreground">
                Across {subjects.length} subjects
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125</div>
              <p className="text-xs text-muted-foreground">
                92.6% response rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">
                Active this semester
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Feedback by Criteria */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Feedback by Criteria</CardTitle>
              <CardDescription>
                Your performance across different teaching aspects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedbackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="criteria" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>
                How students rated your overall performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>
              Detailed feedback for each subject you teach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjects.map((subject, index) => {
                const responseRate = (subject.feedbackCount / subject.students) * 100;
                return (
                  <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{subject.name}</h3>
                        <p className="text-muted-foreground">
                          {subject.students} students • {subject.feedbackCount} responses
                        </p>
                      </div>
                      <Badge 
                        variant={getRatingBadgeVariant(subject.avgRating)}
                        className="text-lg px-3 py-1"
                      >
                        {subject.avgRating}/10
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Rate</span>
                        <span className={responseRate >= 80 ? 'text-success' : 'text-warning'}>
                          {responseRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={responseRate} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Criteria Breakdown */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <CardTitle>Detailed Performance Analysis</CardTitle>
            <CardDescription>
              Your scores across all evaluation criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackData.map((criteria, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{criteria.criteria}</span>
                      <span className={`font-bold ${getRatingColor(criteria.score)}`}>
                        {criteria.score}/10
                      </span>
                    </div>
                    <Progress value={criteria.score * 10} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};