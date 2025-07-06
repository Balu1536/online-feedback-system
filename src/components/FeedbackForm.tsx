import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star } from "lucide-react";

interface FeedbackFormProps {
  subject: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const feedbackCriteria = [
  { id: 'punctuality', label: 'Punctuality', description: 'Faculty arrives on time and starts class promptly' },
  { id: 'teaching_quality', label: 'Teaching Quality', description: 'Overall effectiveness of teaching methods' },
  { id: 'understandability', label: 'Understandability', description: 'How well concepts are explained and understood' },
  { id: 'impartial_behavior', label: 'Impartial Behavior', description: 'Fair treatment of all students' },
  { id: 'blackboard_usage', label: 'Blackboard Usage', description: 'Effective use of blackboard for teaching' },
  { id: 'ppt_usage', label: 'PPT Usage', description: 'Quality and effectiveness of presentation slides' },
  { id: 'projector_usage', label: 'Digital Projector Usage', description: 'Effective use of digital projector' },
  { id: 'student_interaction', label: 'Interaction with Students', description: 'Engagement and interaction with students' },
  { id: 'syllabus_coverage', label: 'Syllabus Coverage', description: 'Complete coverage of syllabus content' },
  { id: 'question_encouragement', label: 'Encouragement of Questions', description: 'Welcomes and answers student questions' },
  { id: 'motivation', label: 'Motivation & Inspiration', description: 'Motivates and inspires students to learn' },
  { id: 'communication', label: 'Communication Skills', description: 'Clear and effective communication' },
  { id: 'doubt_solving', label: 'Clarity in Doubt-Solving', description: 'Ability to clear student doubts effectively' },
  { id: 'assignments_tests', label: 'Assignments/Tests Conduction', description: 'Regular and fair assessment methods' }
];

export const FeedbackForm = ({ subject, onSubmit, onCancel }: FeedbackFormProps) => {
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRatingChange = (criteria: string, value: string) => {
    setRatings(prev => ({ ...prev, [criteria]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all ratings are provided
    const missingRatings = feedbackCriteria.filter(c => !ratings[c.id]);
    if (missingRatings.length > 0) {
      toast({
        title: "Incomplete Feedback",
        description: `Please provide ratings for all criteria. Missing: ${missingRatings.length} items.`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Feedback Submitted Successfully",
        description: `Your feedback for ${subject.name} has been recorded. Thank you!`
      });
      setLoading(false);
      onSubmit();
    }, 1500);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-success';
    if (rating >= 6) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Faculty Feedback</h1>
            <p className="text-white/80">{subject.name} - {subject.faculty}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Rate Your Faculty
            </CardTitle>
            <CardDescription>
              Please rate {subject.faculty} on the following criteria (1 = Poor, 10 = Excellent)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Feedback Criteria */}
              <div className="space-y-6">
                {feedbackCriteria.map((criteria) => (
                  <div key={criteria.id} className="space-y-3">
                    <div>
                      <Label className="text-base font-medium">{criteria.label}</Label>
                      <p className="text-sm text-muted-foreground">{criteria.description}</p>
                    </div>
                    
                    <RadioGroup
                      value={ratings[criteria.id] || ''}
                      onValueChange={(value) => handleRatingChange(criteria.id, value)}
                      className="flex flex-wrap gap-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <div key={rating} className="flex items-center space-x-1">
                          <RadioGroupItem 
                            value={rating.toString()} 
                            id={`${criteria.id}-${rating}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`${criteria.id}-${rating}`}
                            className={`
                              w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer
                              transition-all duration-200 hover:scale-105
                              ${ratings[criteria.id] === rating.toString()
                                ? `bg-primary text-primary-foreground border-primary shadow-button ${getRatingColor(rating)}`
                                : 'border-border hover:border-primary/50 bg-background'
                              }
                            `}
                          >
                            {rating}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {ratings[criteria.id] && (
                      <div className="text-sm font-medium">
                        <span className="text-muted-foreground">Selected: </span>
                        <span className={getRatingColor(parseInt(ratings[criteria.id]))}>
                          {ratings[criteria.id]}/10
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Additional Comments (Optional)</Label>
                <Textarea
                  placeholder="Share any additional thoughts about the faculty's teaching methods, suggestions for improvement, or positive feedback..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-primary hover:shadow-button h-12 text-lg"
                >
                  {loading ? 'Submitting Feedback...' : 'Submit Feedback'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};