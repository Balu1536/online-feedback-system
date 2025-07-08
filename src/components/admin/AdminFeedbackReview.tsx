import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminFeedbackReviewProps {
  feedback: any[];
}

export const AdminFeedbackReview = ({ feedback }: AdminFeedbackReviewProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Review and manage student feedback submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{item.subject_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Faculty: {item.faculty?.name} | {item.semester} Semester | {item.academic_year}
                  </p>
                </div>
                <Badge variant={item.overall_rating >= 8 ? 'default' : item.overall_rating >= 6 ? 'secondary' : 'destructive'}>
                  {item.overall_rating}/10
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm mb-3">
                <div>Teaching: {item.teaching_effectiveness}/10</div>
                <div>Content: {item.course_content}/10</div>
                <div>Communication: {item.communication_skills}/10</div>
                <div>Punctuality: {item.punctuality}/10</div>
                <div>Interaction: {item.student_interaction}/10</div>
              </div>

              {item.positive_feedback && (
                <div className="mb-2">
                  <strong className="text-sm">Positive Feedback:</strong>
                  <p className="text-sm text-muted-foreground">{item.positive_feedback}</p>
                </div>
              )}

              {item.suggestions_for_improvement && (
                <div>
                  <strong className="text-sm">Suggestions:</strong>
                  <p className="text-sm text-muted-foreground">{item.suggestions_for_improvement}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Submitted: {new Date(item.submitted_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};