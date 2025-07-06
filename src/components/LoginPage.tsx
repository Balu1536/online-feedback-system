import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, Shield } from "lucide-react";

interface LoginPageProps {
  onLogin: (role: 'student' | 'faculty' | 'admin', userData: any) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        role,
        name: role === 'student' ? 'John Doe' : role === 'faculty' ? 'Dr. Smith' : 'Admin User',
        department: role === 'student' ? 'Computer Science' : role === 'faculty' ? 'Computer Science' : 'Administration'
      };
      
      onLogin(role, userData);
      setLoading(false);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${userData.name}!`
      });
    }, 1000);
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'student': return <User className="w-5 h-5" />;
      case 'faculty': return <GraduationCap className="w-5 h-5" />;
      case 'admin': return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-elegant">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Voice</h1>
          <p className="text-white/80">Faculty Feedback System</p>
        </div>

        <Card className="shadow-elegant border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Login As</Label>
                <Select value={role} onValueChange={(value: 'student' | 'faculty' | 'admin') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('student')}
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('faculty')}
                        <span>Faculty</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('admin')}
                        <span>Administrator</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>Username: demo | Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};