import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, MessageSquare, Star } from "lucide-react";

interface FeedbackFormV2Props {
  userData: any;
  onBack: () => void;
}

interface CourseOption {
  course_id: string;
  course_name: string;
  faculty_id: string;
  faculty_name: string;
}

export const FeedbackFormV2 = ({ userData, onBack }: FeedbackFormV2Props) => {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentUuid, setStudentUuid] = useState<string | null>(null);
  const { toast } = useToast();

  // Rating states
  const [teachingEffectiveness, setTeachingEffectiveness] = useState([8]);
  const [courseContent, setCourseContent] = useState([8]);
  const [communicationSkills, setCommunicationSkills] = useState([8]);
  const [punctuality, setPunctuality] = useState([8]);
  const [studentInteraction, setStudentInteraction] = useState([8]);
  const [overallRating, setOverallRating] = useState([8]);

  // Text feedback states
  const [positiveFeedback, setPositiveFeedback] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  useEffect(() => {
    loadStudentData();
    loadAvailableCourses();
  }, [userData]);

  const loadStudentData = async () => {
    try {
      // Get student's UUID from profiles table using roll number or email
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('roll_number')
        .eq('roll_number', userData?.roll_number || userData?.college_email)
        .single();

      if (error) throw error;
      
      // For now, we'll create a UUID from the roll number for consistency
      // In production, you'd want to use proper user authentication
      const uuid = userData?.roll_number ? `00000000-0000-0000-0000-${userData.roll_number.padStart(12, '0')}` : null;
      setStudentUuid(uuid);
    } catch (error: any) {
      console.error('Error loading student data:', error);
      // Generate a UUID-like string from roll number as fallback
      const uuid = userData?.roll_number ? `00000000-0000-0000-0000-${userData.roll_number.padStart(12, '0')}` : null;
      setStudentUuid(uuid);
    }
  };

  const loadAvailableCourses = async () => {
    try {
      setLoading(true);
      
      // Get student's section from userData
      const studentSection = userData?.section || 'A';
      
      // Load courses for the student's section
      const { data: courseAssignments, error } = await supabase
        .from('course_assignments')
        .select(`
          course_id,
          faculty_id,
          courses:course_id (
            course_name
          ),
          faculty:faculty_id (
            name
          )
        `)
        .eq('section', studentSection)
        .eq('semester', '3rd')
        .eq('academic_year', '2024-25');

      if (error) throw error;

      // Transform data for easier use
      const courseOptions: CourseOption[] = courseAssignments?.map(assignment => ({
        course_id: assignment.course_id,
        course_name: assignment.courses?.course_name || 'Unknown Course',
        faculty_id: assignment.faculty_id,
        faculty_name: assignment.faculty?.name || 'Unknown Faculty'
      })) || [];

      setCourses(courseOptions);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error Loading Courses",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course to provide feedback for.",
        variant: "destructive"
      });
      return;
    }

    if (!studentUuid) {
      toast({
        title: "Student Data Error",
        description: "Unable to identify student. Please try logging in again.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);

      const feedbackData = {
        student_id: studentUuid, // Use the UUID instead of roll number
        faculty_id: selectedCourse.faculty_id,
        subject_name: selectedCourse.course_name,
        semester: '3rd',
        academic_year: '2024-25',
        teaching_effectiveness: teachingEffectiveness[0],
        course_content: courseContent[0],
        communication_skills: communicationSkills[0],
        punctuality: punctuality[0],
        student_interaction: studentInteraction[0],
        overall_rating: overallRating[0],
        positive_feedback: positiveFeedback.trim() || null,
        suggestions_for_improvement: suggestions.trim() || null,
        additional_comments: additionalComments.trim() || null,
        is_anonymous: true
      };

      const { error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback!"
      });

      // Reset form
      setSelectedCourse(null);
      setTeachingEffectiveness([8]);
      setCourseContent([8]);
      setCommunicationSkills([8]);
      setPunctuality([8]);
      setStudentInteraction([8]);
      setOverallRating([8]);
      setPositiveFeedback('');
      setSuggestions('');
      setAdditionalComments('');

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Course Feedback</h1>
              <p className="text-white/80">Share your learning experience</p>
            </div>
          </div>
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Selection */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Select Course
              </CardTitle>
              <CardDescription>
                Choose the course you want to provide feedback for (Section: {userData?.section || 'A'})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCourse?.course_id || ''}
                onValueChange={(courseId) => {
                  const course = courses.find(c => c.course_id === courseId);
                  setSelectedCourse(course || null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course, index) => (
                    <SelectItem key={`${course.course_id}-${course.faculty_id}-${index}`} value={course.course_id}>
                      {course.course_name} - {course.faculty_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCourse && (
            <>
              {/* Rating Section */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rating Evaluation
                  </CardTitle>
                  <CardDescription>
                    Rate different aspects of the course and faculty performance (1-10 scale)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Teaching Effectiveness: {teachingEffectiveness[0]}/10</Label>
                      <Slider
                        value={teachingEffectiveness}
                        onValueChange={setTeachingEffectiveness}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Course Content Quality: {courseContent[0]}/10</Label>
                      <Slider
                        value={courseContent}
                        onValueChange={setCourseContent}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Communication Skills: {communicationSkills[0]}/10</Label>
                      <Slider
                        value={communicationSkills}
                        onValueChange={setCommunicationSkills}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Punctuality: {punctuality[0]}/10</Label>
                      <Slider
                        value={punctuality}
                        onValueChange={setPunctuality}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Student Interaction: {studentInteraction[0]}/10</Label>
                      <Slider
                        value={studentInteraction}
                        onValueChange={setStudentInteraction}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Overall Rating: {overallRating[0]}/10</Label>
                      <Slider
                        value={overallRating}
                        onValueChange={setOverallRating}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Written Feedback */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Written Feedback</CardTitle>
                  <CardDescription>
                    Share your detailed thoughts and suggestions (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="positive">What did you like about this course?</Label>
                    <Textarea
                      id="positive"
                      placeholder="Share positive aspects of the course, teaching methods, etc..."
                      value={positiveFeedback}
                      onChange={(e) => setPositiveFeedback(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suggestions">Suggestions for improvement</Label>
                    <Textarea
                      id="suggestions"
                      placeholder="Share constructive suggestions for improving the course..."
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional">Additional comments</Label>
                    <Textarea
                      id="additional"
                      placeholder="Any other feedback or comments..."
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gradient-primary px-8"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};