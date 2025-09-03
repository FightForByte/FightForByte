import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/dashboard/StudentDashboard';
import FacultyDashboard from './components/dashboard/FacultyDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AddActivity from './components/activities/AddActivity';
import Portfolio from './components/portfolio/Portfolio';
import ApprovalPanel from './components/approval/ApprovalPanel';
import LoadingSpinner from './components/common/LoadingSpinner';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();
  
  console.log('ProtectedRoute - currentUser:', currentUser, 'userData:', userData, 'loading:', loading);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    console.log('ProtectedRoute - No current user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (!userData) {
    console.log('ProtectedRoute - No user data yet, showing loading');
    return <LoadingSpinner />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    console.log('ProtectedRoute - Role not allowed, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }
  
  console.log('ProtectedRoute - All checks passed, rendering children');
  return children;
};

// Dashboard Route Component
const DashboardRoute = () => {
  const { userData, loading } = useAuth();
  
  console.log('DashboardRoute - userData:', userData, 'loading:', loading);
  
  if (loading || !userData) {
    return <LoadingSpinner />;
  }
  
  switch (userData?.role) {
    case 'student':
      console.log('DashboardRoute - Rendering StudentDashboard');
      return <StudentDashboard />;
    case 'faculty':
      console.log('DashboardRoute - Rendering FacultyDashboard');
      return <FacultyDashboard />;
    case 'admin':
      console.log('DashboardRoute - Rendering AdminDashboard');
      return <AdminDashboard />;
    default:
      console.log('DashboardRoute - Unknown role, redirecting to login');
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/activities/add" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AddActivity />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Portfolio />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/approvals" 
              element={
                <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                  <ApprovalPanel />
                </ProtectedRoute>
              } 
            />
            
            {/* Home Route */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        {/* Global footer credit */}
        <footer className="w-full text-center mt-6 text-sm text-gray-500 py-4 border-t border-gray-100">
          Built by the FightTheByte team
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
