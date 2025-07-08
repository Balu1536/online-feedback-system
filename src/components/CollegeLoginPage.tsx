import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface CollegeLoginPageProps {
  onLogin: (role: 'student' | 'faculty' | 'admin', userData: any) => void;
}
export const CollegeLoginPage = ({
  onLogin
}: CollegeLoginPageProps) => {
  const [collegeEmail, setCollegeEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dob');
  const {
    toast
  } = useToast();
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter your college email ID",
        variant: "destructive"
      });
      return;
    }
    if (activeTab === 'dob' && !dateOfBirth) {
      toast({
        title: "Missing Information",
        description: "Please enter your date of birth",
        variant: "destructive"
      });
      return;
    }
    if (activeTab === 'roll' && !rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter your roll number",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Verify student credentials
      const {
        data: verificationResult,
        error: verifyError
      } = await supabase.rpc('verify_student_credentials', {
        p_college_email: collegeEmail,
        ...(activeTab === 'dob' ? {
          p_date_of_birth: dateOfBirth
        } : {
          p_roll_number: rollNumber
        })
      });
      if (verifyError) {
        throw verifyError;
      }
      if (!verificationResult || verificationResult.length === 0 || !verificationResult[0].is_valid) {
        toast({
          title: "Invalid Credentials",
          description: "Please check your college email and verification details",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const studentData = verificationResult[0].student_data as any;

      // Sign up/Sign in with Supabase Auth
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email: collegeEmail,
        password: studentData.roll_number + studentData.date_of_birth,
        // Use roll number + DOB as password
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: studentData.name,
            roll_number: studentData.roll_number
          }
        }
      });
      if (authError && authError.message !== "User already registered") {
        throw authError;
      }

      // If user already exists, try to sign in
      if (authError?.message === "User already registered") {
        const {
          data: signInData,
          error: signInError
        } = await supabase.auth.signInWithPassword({
          email: collegeEmail,
          password: studentData.roll_number + studentData.date_of_birth
        });
        if (signInError) {
          throw signInError;
        }
      }
      toast({
        title: "Login Successful",
        description: `Welcome, ${studentData.name}!`
      });
      onLogin('student', {
        id: studentData.id,
        name: studentData.name,
        roll_number: studentData.roll_number,
        section: studentData.section,
        role: 'student'
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // For now, use simple faculty login
    const facultyData = {
      id: 'faculty-1',
      name: 'Dr. Faculty Member',
      role: 'faculty',
      department: 'Computer Science'
    };
    onLogin('faculty', facultyData);
    toast({
      title: "Faculty Login Successful",
      description: `Welcome, ${facultyData.name}!`
    });
  };
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('adminEmail') as string;
    const password = formData.get('adminPassword') as string;
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Verify admin credentials
      const {
        data: verificationResult,
        error: verifyError
      } = await supabase.rpc('verify_admin_credentials', {
        p_email: email,
        p_password: password
      });
      if (verifyError) {
        throw verifyError;
      }
      if (!verificationResult || verificationResult.length === 0 || !verificationResult[0].is_valid) {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const adminData = verificationResult[0].admin_data as any;
      toast({
        title: "Admin Login Successful",
        description: `Welcome, ${adminData.name}!`
      });
      onLogin('admin', {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: 'admin'
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-elegant">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-2 font-bold">Online Feedback System</h1>
          <p className="text-white/80">Faculty Feedback System</p>
        </div>

        <Card className="shadow-elegant border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl text-center">Login to Your Account</CardTitle>
            <CardDescription className="text-center">
              Choose your login type below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="faculty" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Faculty
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collegeEmail">College Email ID</Label>
                    <Input id="collegeEmail" type="email" placeholder="e.g., 239Y1A0501@ksrmce.ac.in" value={collegeEmail} onChange={e => setCollegeEmail(e.target.value)} required />
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dob" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date of Birth
                      </TabsTrigger>
                      <TabsTrigger value="roll" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Roll Number
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="dob" className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
                    </TabsContent>
                    
                    <TabsContent value="roll" className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input id="rollNumber" type="text" placeholder="e.g., 239Y1A0501" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
                    </TabsContent>
                  </Tabs>

                  <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In as Student'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="faculty">
                <form onSubmit={handleFacultyLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyId">Faculty ID</Label>
                    <Input id="facultyId" type="text" placeholder="Enter your faculty ID" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facultyPassword">Password</Label>
                    <Input id="facultyPassword" type="password" placeholder="Enter your password" required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300">
                    Sign In as Faculty
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" placeholder="Enter your admin email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Password</Label>
                    <Input id="adminPassword" name="adminPassword" type="password" placeholder="Enter your password" required />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Students: Use your college email and date of birth/roll number</p>
              <p>Demo Student: 239Y1A0536@ksrmce.ac.in | DOB: 2005-04-11</p>
              <p>Demo Admin: balasubramanyam200517@gmail.com | Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};