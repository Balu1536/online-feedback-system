import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Eye, Filter, Download, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminFeedbackReviewProps {
  feedback: any[];
}

export const AdminFeedbackReview = ({ feedback }: AdminFeedbackReviewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const { toast } = useToast();

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.faculty?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'high' && item.overall_rating >= 8) ||
                         (ratingFilter === 'medium' && item.overall_rating >= 6 && item.overall_rating < 8) ||
                         (ratingFilter === 'low' && item.overall_rating < 6);
    const matchesSemester = semesterFilter === 'all' || item.semester === semesterFilter;
    
    return matchesSearch && matchesRating && matchesSemester;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'default';
    if (rating >= 6) return 'secondary';
    return 'destructive';
  };

  const getProgressColor = (rating: number) => {
    if (rating >= 8) return 'bg-success';
    if (rating >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  const handleExportFilteredFeedback = () => {
    const exportData = filteredFeedback.map(item => ({
      subject: item.subject_name,
      faculty: item.faculty?.name || 'Unknown',
      semester: item.semester,
      academic_year: item.academic_year,
      overall_rating: item.overall_rating,
      teaching_effectiveness: item.teaching_effectiveness,
      course_content: item.course_content,
      communication_skills: item.communication_skills,
      punctuality: item.punctuality,
      student_interaction: item.student_interaction,
      positive_feedback: item.positive_feedback,
      suggestions: item.suggestions_for_improvement,
      additional_comments: item.additional_comments,
      submitted_at: item.submitted_at,
      is_anonymous: item.is_anonymous
    }));

    const csvContent = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).map(val => `"${val || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredFeedback.length} feedback records.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Feedback Review & Management</CardTitle>
              <CardDescription>Review, filter, and analyze student feedback submissions</CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => handleExportFilteredFeedback()}
            >
              <Download className="w-4 h-4" />
              Export Filtered
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by subject or faculty name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rating Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="high">8-10 (High)</SelectItem>
                <SelectItem value="medium">6-7 (Medium)</SelectItem>
                <SelectItem value="low">0-5 (Low)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="1st">1st Semester</SelectItem>
                <SelectItem value="2nd">2nd Semester</SelectItem>
                <SelectItem value="3rd">3rd Semester</SelectItem>
                <SelectItem value="4th">4th Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredFeedback.map((item) => (
            <Card key={item.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.subject_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Faculty: {item.faculty?.name} | {item.semester} Semester | {item.academic_year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRatingColor(item.overall_rating)}>
                      <Star className="w-3 h-3 mr-1" />
                      {item.overall_rating}/10
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  {[
                    { label: 'Teaching', value: item.teaching_effectiveness },
                    { label: 'Content', value: item.course_content },
                    { label: 'Communication', value: item.communication_skills },
                    { label: 'Punctuality', value: item.punctuality },
                    { label: 'Interaction', value: item.student_interaction }
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{label}</span>
                        <span>{value}/10</span>
                      </div>
                      <Progress value={value * 10} className="h-2" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Submitted: {new Date(item.submitted_at).toLocaleDateString()}
                  {item.is_anonymous && <Badge variant="outline" className="ml-2">Anonymous</Badge>}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {filteredFeedback.map((item) => (
            <Card key={item.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-xl">{item.subject_name}</h3>
                      <p className="text-muted-foreground">
                        Faculty: {item.faculty?.name} | {item.semester} Semester | {item.academic_year}
                      </p>
                    </div>
                    <Badge variant={getRatingColor(item.overall_rating)} className="text-lg p-2">
                      <Star className="w-4 h-4 mr-1" />
                      {item.overall_rating}/10
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Teaching Effectiveness', value: item.teaching_effectiveness },
                      { label: 'Course Content', value: item.course_content },
                      { label: 'Communication Skills', value: item.communication_skills },
                      { label: 'Punctuality', value: item.punctuality },
                      { label: 'Student Interaction', value: item.student_interaction }
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-sm font-bold">{value}/10</span>
                        </div>
                        <Progress value={value * 10} className="h-3" />
                      </div>
                    ))}
                  </div>

                  {item.positive_feedback && (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                      <h4 className="font-medium text-success mb-2">Positive Feedback</h4>
                      <p className="text-sm">{item.positive_feedback}</p>
                    </div>
                  )}

                  {item.suggestions_for_improvement && (
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                      <h4 className="font-medium text-warning mb-2">Suggestions for Improvement</h4>
                      <p className="text-sm">{item.suggestions_for_improvement}</p>
                    </div>
                  )}

                  {item.additional_comments && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Additional Comments</h4>
                      <p className="text-sm">{item.additional_comments}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(item.submitted_at).toLocaleString()}
                      {item.is_anonymous && <Badge variant="outline" className="ml-2">Anonymous</Badge>}
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export This Feedback
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="summary">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Feedback Summary</CardTitle>
              <CardDescription>Statistical overview of filtered feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredFeedback.length}</div>
                  <div className="text-sm text-muted-foreground">Total Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {(filteredFeedback.reduce((sum, item) => sum + item.overall_rating, 0) / filteredFeedback.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round((filteredFeedback.filter(item => item.overall_rating >= 7).length / filteredFeedback.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};