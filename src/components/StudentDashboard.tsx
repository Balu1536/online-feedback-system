import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, CheckCircle, Clock } from "lucide-react";
import { FeedbackForm } from "./FeedbackForm";

interface StudentDashboardProps {
  userData: any;
  onLogout: () => void;
}

export const StudentDashboard = ({ userData, onLogout }: StudentDashboardProps) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  // Real data for subjects and feedback status - IV Semester
  const subjects = [
    {
      id: 1,
      name: "Operating Systems",
      faculty: "Ms. Z. Shoba Rani",
      code: "2305401",
      feedbackSubmitted: false,
      semester: "IV Semester"
    },
    {
      id: 2,
      name: "Database Management Systems",
      faculty: "Mr. Y. Prasada Reddy",
      code: "2339402",
      feedbackSubmitted: true,
      semester: "IV Semester"
    },
    {
      id: 3,
      name: "Software Engineering",
      faculty: "Mr. A. Ramprakash Reddy",
      code: "2305402",
      feedbackSubmitted: false,
      semester: "IV Semester"
    },
    {
      id: 4,
      name: "Managerial Economics and Financial Analysis",
      faculty: "Mr. K. Radha Krishna",
      code: "23HS421",
      feedbackSubmitted: false,
      semester: "IV Semester"
    },
    {
      id: 5,
      name: "Probability and Statistics",
      faculty: "Dr. G. Sreedhar",
      code: "23HS402",
      feedbackSubmitted: true,
      semester: "IV Semester"
    },
    {
      id: 6,
      name: "Full Stack Development – 1",
      faculty: "Ms. B. Swetha",
      code: "2305452",
      feedbackSubmitted: false,
      semester: "IV Semester"
    },
    {
      id: 7,
      name: "Design Thinking and Innovation",
      faculty: "Dr. G. Suneel Kumar",
      code: "2304453",
      feedbackSubmitted: false,
      semester: "IV Semester"
    }
  ];

  const completedCount = subjects.filter(s => s.feedbackSubmitted).length;
  const progressPercentage = (completedCount / subjects.length) * 100;

  const handleProvideFeedback = (subject: any) => {
    setSelectedSubject(subject);
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedbackForm(false);
    setSelectedSubject(null);
    // In a real app, you would update the subject's feedback status
  };

  if (showFeedbackForm && selectedSubject) {
    return (
      <FeedbackForm 
        subject={selectedSubject}
        onSubmit={handleFeedbackSubmitted}
        onCancel={() => setShowFeedbackForm(false)}
      />
    );
  }

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
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-white/80">Welcome back, {userData.name}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedCount}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{subjects.length - completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Feedback Progress</CardTitle>
            <CardDescription>
              Complete feedback for all your subjects this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Subjects List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Subjects - IV Semester 2024-25</CardTitle>
            <CardDescription>
              Provide feedback for your faculty members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div 
                  key={subject.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{subject.name}</h3>
                      <Badge variant="outline">{subject.code}</Badge>
                      {subject.feedbackSubmitted && (
                        <Badge className="bg-success text-success-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">Faculty: {subject.faculty}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {subject.feedbackSubmitted ? (
                      <Button variant="outline" disabled>
                        Feedback Submitted
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleProvideFeedback(subject)}
                        className="bg-gradient-primary hover:shadow-button"
                      >
                        Provide Feedback
                      </Button>
                    )}
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