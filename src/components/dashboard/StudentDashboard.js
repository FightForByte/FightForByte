import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Award,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserActivities } from '../../firebase/firestore';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentDashboard = () => {
  const { userData } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchActivities = async () => {
      if (userData?.uid) {
        const result = await getUserActivities(userData.uid);
        if (result.success) {
          setActivities(result.activities);
          calculateStats(result.activities);
        }
      }
      setLoading(false);
    };

    fetchActivities();
  }, [userData]);

  const calculateStats = (activitiesList) => {
    const stats = {
      total: activitiesList.length,
      approved: activitiesList.filter(a => a.status === 'approved').length,
      pending: activitiesList.filter(a => a.status === 'pending').length,
      rejected: activitiesList.filter(a => a.status === 'rejected').length
    };
    setStats(stats);
  };

  const getActivityTypeIcon = (type) => {
    const iconMap = {
      'certification': Award,
      'internship': TrendingUp,
      'competition': Trophy,
      'conference': Calendar,
      'volunteering': User,
      'leadership': User
    };
    return iconMap[type] || FileText;
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      'approved': 'badge-success',
      'pending': 'badge-warning',
      'rejected': 'badge-danger'
    };
    return badgeClasses[status] || 'badge-warning';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'approved': CheckCircle,
      'pending': Clock,
      'rejected': XCircle
    };
    const Icon = iconMap[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData?.name}! 👋
            </h1>
            <p className="mt-2 text-gray-600">
              Track your achievements and build your digital portfolio
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Activities</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Trophy className="h-10 w-10 text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Credits</p>
                  <p className="text-3xl font-bold">{userData?.credits || 0}</p>
                </div>
                <Award className="h-10 w-10 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/activities/add"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Plus className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Activity</h3>
                  <p className="text-gray-600">Log your latest achievements and activities</p>
                </div>
              </div>
            </Link>

            <Link
              to="/portfolio"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">View Portfolio</h3>
                  <p className="text-gray-600">Generate and share your digital portfolio</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <Link 
                to="/activities/add" 
                className="btn-primary text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Link>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your portfolio by adding your first activity
                </p>
                <Link to="/activities/add" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Activity
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => {
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
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`${getStatusBadge(activity.status)} flex items-center`}>
                          {getStatusIcon(activity.status)}
                          <span className="ml-1 capitalize">{activity.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {activities.length > 5 && (
                  <div className="text-center pt-4">
                    <Link 
                      to="/activities" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all activities →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
