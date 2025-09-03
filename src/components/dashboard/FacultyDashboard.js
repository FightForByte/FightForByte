import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  Users, 
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingActivities } from '../../firebase/firestore';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const FacultyDashboard = () => {
  const { userData } = useAuth();
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPending: 0,
    todaySubmissions: 0,
    totalStudents: 45, // Mock data
    approvalRate: 92 // Mock data
  });

  useEffect(() => {
    const fetchPendingActivities = async () => {
      const result = await getPendingActivities();
      if (result.success) {
        setPendingActivities(result.activities);
        setStats(prev => ({
          ...prev,
          totalPending: result.activities.length,
          todaySubmissions: result.activities.filter(
            activity => new Date(activity.createdAt?.toDate()).toDateString() === new Date().toDateString()
          ).length
        }));
      }
      setLoading(false);
    };

    fetchPendingActivities();
  }, []);

  const getActivityTypeIcon = (type) => {
    const iconMap = {
      'certification': Award,
      'internship': TrendingUp,
      'competition': Award,
      'conference': Calendar,
      'volunteering': Users,
      'leadership': Users
    };
    return iconMap[type] || FileText;
  };

  if (loading) {
    return <LoadingSpinner text="Loading faculty dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Faculty Dashboard 📋
              </h1>
              <p className="mt-2 text-gray-600">
                Review and approve student activities • {userData?.department} Department
              </p>
            </div>
            <div className="ml-4">
              {/* Dark mode toggle moved to Navbar */}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold">{stats.totalPending}</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Today's Submissions</p>
                  <p className="text-3xl font-bold">{stats.todaySubmissions}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="h-10 w-10 text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Approval Rate</p>
                  <p className="text-3xl font-bold">{stats.approvalRate}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/approvals"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <CheckSquare className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Review Activities</h3>
                  <p className="text-gray-600">Approve or reject student submissions</p>
                  {stats.totalPending > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                      {stats.totalPending} pending
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <Link
              to="/reports"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
                  <p className="text-gray-600">Department insights and analytics</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Pending Activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Submissions
              </h2>
              <Link 
                to="/approvals" 
                className="btn-primary text-sm btn-ensure-contrast"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Review All
              </Link>
            </div>

            {pendingActivities.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">
                  No pending activities to review at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingActivities.slice(0, 5).map((activity) => {
                  const ActivityIcon = getActivityTypeIcon(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ActivityIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {activity.type.replace('_', ' ')} • {activity.organization}
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted {activity.createdAt ? new Date(activity.createdAt.toDate()).toLocaleDateString() : 'recently'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="badge-warning flex items-center">
                          <Clock className="h-4 w-4" />
                          <span className="ml-1">Pending</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {pendingActivities.length > 5 && (
                  <div className="text-center pt-4">
                    <Link 
                      to="/approvals" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all pending activities →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Department Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Activity Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Certifications</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Internships</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Competitions</span>
                  <span className="font-semibold">67</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Workshops</span>
                  <span className="font-semibold">145</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Trends</h3>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Analytics dashboard coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;
