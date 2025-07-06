import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{
    role: 'student' | 'faculty' | 'admin' | null;
    userData: any;
  }>({ role: null, userData: null });

  const handleLogin = (role: 'student' | 'faculty' | 'admin', userData: any) => {
    setCurrentUser({ role, userData });
  };

  const handleLogout = () => {
    setCurrentUser({ role: null, userData: null });
  };

  if (!currentUser.role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  switch (currentUser.role) {
    case 'student':
      return <StudentDashboard userData={currentUser.userData} onLogout={handleLogout} />;
    case 'faculty':
      return <FacultyDashboard userData={currentUser.userData} onLogout={handleLogout} />;
    case 'admin':
      return <AdminDashboard userData={currentUser.userData} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
};

export default Index;