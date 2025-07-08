import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminReportsProps {
  analytics: any;
}

export const AdminReports = ({ analytics }: AdminReportsProps) => {
  const { toast } = useToast();

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

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
        <CardDescription>Create detailed reports and analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full bg-gradient-primary" onClick={handleExportData}>
          <Download className="w-4 h-4 mr-2" />
          Export Complete Analytics Report
        </Button>
        
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Generate Faculty Performance Report
        </Button>
        
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Student Feedback Summary
        </Button>
        
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Department Wise Analysis
        </Button>
      </CardContent>
    </Card>
  );
};