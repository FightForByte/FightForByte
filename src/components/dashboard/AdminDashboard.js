import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Award, 
  BarChart3,
  CheckSquare,
  Clock,
  Building,
  FileText,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingActivities } from '../../firebase/firestore';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalActivities: 3456,
    totalFaculty: 85,
    pendingApprovals: 0,
    thisMonthActivities: 234,
    approvalRate: 94
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await getPendingActivities();
      if (result.success) {
        setPendingActivities(result.activities);
        setStats(prev => ({
          ...prev,
          pendingApprovals: result.activities.length
        }));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const departmentStats = [
    { name: 'Computer Science', students: 320, activities: 856 },
    { name: 'Information Technology', students: 285, activities: 742 },
    { name: 'Electronics', students: 245, activities: 623 },
    { name: 'Mechanical', students: 200, activities: 534 },
    { name: 'Civil', students: 120, activities: 324 },
    { name: 'Other', students: 80, activities: 377 }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard 📊
            </h1>
            <p className="mt-2 text-gray-600">
              Institution-wide analytics and management overview
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">Total Students</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-green-200" />
                <p className="text-2xl font-bold">{stats.totalActivities.toLocaleString()}</p>
                <p className="text-green-100 text-sm">Total Activities</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="text-center">
                <Building className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                <p className="text-2xl font-bold">{stats.totalFaculty}</p>
                <p className="text-purple-100 text-sm">Faculty Members</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-200" />
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
                <p className="text-orange-100 text-sm">Pending Approvals</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-teal-200" />
                <p className="text-2xl font-bold">{stats.thisMonthActivities}</p>
                <p className="text-teal-100 text-sm">This Month</p>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <div className="text-center">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                <p className="text-2xl font-bold">{stats.approvalRate}%</p>
                <p className="text-indigo-100 text-sm">Approval Rate</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-gray-600 text-sm">Manage pending approvals</p>
                  {stats.pendingApprovals > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                      {stats.pendingApprovals} pending
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <button 
              className="card hover:shadow-md transition-shadow cursor-pointer group text-left"
              onClick={() => alert('NAAC Report generation feature coming soon!')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Generate NAAC Report</h3>
                  <p className="text-gray-600 text-sm">Download compliance report</p>
                </div>
              </div>
            </button>

            <button 
              className="card hover:shadow-md transition-shadow cursor-pointer group text-left"
              onClick={() => alert('Advanced analytics feature coming soon!')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
                  <p className="text-gray-600 text-sm">Detailed insights & trends</p>
                </div>
              </div>
            </button>
          </div>

          {/* Department Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Department Overview</h2>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {departmentStats.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">{dept.students} students</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">{dept.activities}</p>
                      <p className="text-xs text-gray-500">activities</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent System Activity</h2>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      15 new activity submissions today
                    </p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Faculty approved 23 activities
                    </p>
                    <p className="text-xs text-gray-600">4 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New faculty member registered
                    </p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Type Distribution */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Activity Type Distribution</h2>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { type: 'Certifications', count: 145, color: 'bg-blue-500', icon: Award },
                { type: 'Internships', count: 89, color: 'bg-green-500', icon: TrendingUp },
                { type: 'Competitions', count: 67, color: 'bg-purple-500', icon: Award },
                { type: 'Workshops', count: 123, color: 'bg-orange-500', icon: Building },
                { type: 'Volunteering', count: 78, color: 'bg-teal-500', icon: Users },
                { type: 'Leadership', count: 45, color: 'bg-indigo-500', icon: Users }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.type} className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className={`h-12 w-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">{item.count}</p>
                    <p className="text-xs text-gray-600">{item.type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
