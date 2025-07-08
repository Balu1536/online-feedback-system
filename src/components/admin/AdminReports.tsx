import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminReportsProps {
  analytics: any;
}

export const AdminReports = ({ analytics }: AdminReportsProps) => {
  const { toast } = useToast();

  const handleExportData = (type: string) => {
    if (!analytics) return;
    
    let reportData;
    let filename;

    switch (type) {
      case 'complete':
        reportData = {
          generated_at: new Date().toISOString(),
          total_feedback: analytics.total_feedback_count,
          average_rating: analytics.average_overall_rating,
          faculty_ratings: analytics.faculty_ratings,
          rating_distribution: analytics.rating_distribution,
          monthly_trends: analytics.monthly_trends
        };
        filename = `complete-analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      case 'faculty':
        reportData = {
          generated_at: new Date().toISOString(),
          faculty_performance: analytics.faculty_ratings,
          summary: {
            total_faculty: analytics.faculty_ratings?.length || 0,
            highest_rated: analytics.faculty_ratings?.[0],
            lowest_rated: analytics.faculty_ratings?.[analytics.faculty_ratings?.length - 1]
          }
        };
        filename = `faculty-performance-report-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      case 'summary':
        reportData = {
          generated_at: new Date().toISOString(),
          executive_summary: {
            total_feedback_submissions: analytics.total_feedback_count,
            overall_satisfaction_rating: analytics.average_overall_rating,
            rating_breakdown: analytics.rating_distribution,
            key_insights: {
              satisfaction_rate: analytics.rating_distribution?.filter((r: any) => r.rating >= 7).reduce((sum: number, r: any) => sum + r.count, 0),
              improvement_needed: analytics.rating_distribution?.filter((r: any) => r.rating < 6).reduce((sum: number, r: any) => sum + r.count, 0)
            }
          }
        };
        filename = `feedback-summary-report-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      case 'department':
        reportData = {
          generated_at: new Date().toISOString(),
          department_analysis: analytics.faculty_ratings?.reduce((acc: any, faculty: any) => {
            const dept = faculty.designation || 'Unknown';
            if (!acc[dept]) {
              acc[dept] = { faculty_count: 0, total_rating: 0, feedback_count: 0 };
            }
            acc[dept].faculty_count++;
            acc[dept].total_rating += faculty.avg_rating;
            acc[dept].feedback_count += faculty.feedback_count;
            return acc;
          }, {})
        };
        filename = `department-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
        break;
      
      default:
        reportData = analytics;
        filename = `feedback-report-${new Date().toISOString().split('T')[0]}.json`;
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} report has been downloaded successfully.`
    });
  };

  const generateCSVReport = (type: string) => {
    if (!analytics) return;

    let csvContent = '';
    let filename = '';

    if (type === 'faculty-csv') {
      csvContent = 'Faculty ID,Name,Average Rating,Feedback Count\n';
      analytics.faculty_ratings?.forEach((faculty: any) => {
        csvContent += `${faculty.faculty_id || 'N/A'},${faculty.faculty_name},${faculty.avg_rating},${faculty.feedback_count}\n`;
      });
      filename = `faculty-ratings-${new Date().toISOString().split('T')[0]}.csv`;
    } else if (type === 'trends-csv') {
      csvContent = 'Month,Year,Submission Count,Average Rating\n';
      analytics.monthly_trends?.forEach((trend: any) => {
        csvContent += `${trend.month},${trend.year},${trend.count},${trend.avg_rating}\n`;
      });
      filename = `monthly-trends-${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Report Exported",
      description: "CSV report has been downloaded successfully."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Create detailed reports and analytics in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-gradient-primary" onClick={() => handleExportData('complete')}>
              <Download className="w-4 h-4 mr-2" />
              Complete Analytics Report (JSON)
            </Button>
            
            <Button variant="outline" onClick={() => handleExportData('faculty')}>
              <Download className="w-4 h-4 mr-2" />
              Faculty Performance Report
            </Button>
            
            <Button variant="outline" onClick={() => handleExportData('summary')}>
              <Download className="w-4 h-4 mr-2" />
              Executive Summary Report
            </Button>
            
            <Button variant="outline" onClick={() => handleExportData('department')}>
              <Download className="w-4 h-4 mr-2" />
              Department Analysis Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>CSV Data Exports</CardTitle>
          <CardDescription>Export data in spreadsheet-friendly format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => generateCSVReport('faculty-csv')}>
              <Download className="w-4 h-4 mr-2" />
              Faculty Ratings (CSV)
            </Button>
            
            <Button variant="secondary" onClick={() => generateCSVReport('trends-csv')}>
              <Download className="w-4 h-4 mr-2" />
              Monthly Trends (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
          <CardDescription>Overview of available data for reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{analytics?.total_feedback_count || 0}</div>
              <div className="text-sm text-muted-foreground">Total Feedback</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success">{analytics?.faculty_ratings?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Faculty Members</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-warning">{analytics?.monthly_trends?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Months Data</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{analytics?.average_overall_rating || 0}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};