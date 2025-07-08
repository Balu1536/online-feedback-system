import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Course {
  course_id: string;
  course_name: string;
  assignments: CourseAssignment[];
}

interface CourseAssignment {
  id: string;
  section: string;
  faculty: {
    faculty_id: string;
    name: string;
  };
}

export const AdminCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // Load courses with their assignments
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('course_id');
      
      if (coursesError) throw coursesError;

      // Load course assignments with faculty info
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('course_assignments')
        .select(`
          id,
          course_id,
          section,
          faculty:faculty_id (
            faculty_id,
            name
          )
        `);
      
      if (assignmentsError) throw assignmentsError;

      // Combine courses with their assignments
      const coursesWithAssignments = coursesData?.map(course => ({
        ...course,
        assignments: assignmentsData?.filter(assignment => assignment.course_id === course.course_id) || []
      })) || [];

      setCourses(coursesWithAssignments);
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || 
                          course.assignments.some(assignment => assignment.section === selectedSection);
    return matchesSearch && matchesSection;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>Manage course-to-faculty mappings and assignments</CardDescription>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Course Assignment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search courses by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
              <SelectItem value="C">Section C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.course_id} className="border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.course_name}</CardTitle>
                    <CardDescription>Course ID: {course.course_id}</CardDescription>
                  </div>
                  <Badge variant="outline">{course.assignments.length} assignments</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Faculty ID</TableHead>
                      <TableHead>Faculty Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <Badge variant="secondary">Section {assignment.section}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{assignment.faculty.faculty_id}</TableCell>
                        <TableCell>{assignment.faculty.name}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {course.assignments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No assignments found for this course
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};