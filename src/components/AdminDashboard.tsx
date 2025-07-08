import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminOverviewCards } from "./admin/AdminOverviewCards";
import { AdminAnalytics } from "./admin/AdminAnalytics";
import { AdminFacultyManagement } from "./admin/AdminFacultyManagement";
import { AdminFeedbackReview } from "./admin/AdminFeedbackReview";
import { AdminReports } from "./admin/AdminReports";
import { AdminSettings } from "./admin/AdminSettings";

interface AdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

export const AdminDashboard = ({ userData, onLogout }: AdminDashboardProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load analytics
      const { data: analyticsData, error: analyticsError } = await supabase.rpc('get_feedback_analytics');
      if (analyticsError) throw analyticsError;
      setAnalytics(analyticsData);

      // Load faculty
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('*')
        .order('name');
      if (facultyError) throw facultyError;
      setFaculty(facultyData || []);

      // Load recent feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select(`
          *,
          faculty:faculty_id (name, designation)
        `)
        .order('submitted_at', { ascending: false })
        .limit(20);
      if (feedbackError) throw feedbackError;
      setFeedback(feedbackData || []);

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleExportData = () => {
    if (!analytics) return;
    
    const reportData = {
      generated_at: new Date().toISOString(),
      total_feedback: analytics.total_feedback_count,
      average_rating: analytics.average_overall_rating,
      faculty_ratings: analytics.faculty_ratings,
      rating_distribution: analytics.rating_distribution,
      monthly_trends: analytics.monthly_trends
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Feedback report has been downloaded successfully."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-white/80">Welcome, {userData?.name}</p>
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
        <AdminOverviewCards analytics={analytics} facultyCount={faculty.length} />

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
            <TabsTrigger value="feedback">Feedback Review</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics analytics={analytics} />
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <AdminFacultyManagement faculty={faculty} onReloadData={loadData} />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <AdminFeedbackReview feedback={feedback} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <AdminReports analytics={analytics} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};