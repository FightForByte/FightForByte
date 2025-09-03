import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Download, 
  Share2, 
  Eye, 
  Award,
  TrendingUp,
  Calendar,
  User,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserActivities } from '../../firebase/firestore';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const Portfolio = () => {
  const { userData } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    const fetchActivities = async () => {
      if (userData?.uid) {
        const result = await getUserActivities(userData.uid);
        if (result.success) {
          // Only show approved activities in portfolio
          const approvedActivities = result.activities.filter(activity => activity.status === 'approved');
          setActivities(approvedActivities);
        }
      }
      setLoading(false);
    };

    fetchActivities();
  }, [userData]);

  const getActivityTypeIcon = (type) => {
    const iconMap = {
      'certification': Award,
      'internship': TrendingUp,
      'competition': Award,
      'conference': Calendar,
      'volunteering': User,
      'leadership': User,
      'project': FileText,
      'publication': FileText
    };
    return iconMap[type] || FileText;
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    try {
      // Mock PDF generation - in real implementation, use jsPDF or similar
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Portfolio PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSharePortfolio = () => {
    const url = `${window.location.origin}/portfolio/${userData?.uid}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Portfolio link copied to clipboard!');
    });
  };

  const groupActivitiesByType = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      if (!grouped[activity.type]) {
        grouped[activity.type] = [];
      }
      grouped[activity.type].push(activity);
    });
    return grouped;
  };

  const getTypeDisplayName = (type) => {
    const names = {
      'certification': 'Certifications',
      'internship': 'Internships',
      'competition': 'Competitions',
      'conference': 'Conferences & Workshops',
      'volunteering': 'Volunteering',
      'leadership': 'Leadership',
      'project': 'Projects',
      'publication': 'Publications'
    };
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return <LoadingSpinner text="Loading your portfolio..." />;
  }

  const groupedActivities = groupActivitiesByType(activities);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Portfolio 📋
                </h1>
                <p className="mt-2 text-gray-600">
                  Your verified digital portfolio • {activities.length} approved activities
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSharePortfolio}
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="btn-primary flex items-center"
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Preview
            </button>
            
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'public'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ExternalLink className="h-4 w-4 mr-2 inline" />
              Public View
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="card text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approved activities yet</h3>
              <p className="text-gray-600 mb-4">
                Your approved activities will appear here to build your portfolio
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Student Profile Card */}
              <div className="card">
                <div className="flex items-start space-x-6">
                  <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {(userData?.name || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{userData?.name}</h2>
                    <p className="text-lg text-gray-600">{userData?.department} Department</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {userData?.email}
                      </div>
                      
                      {userData?.rollNumber && (
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-2" />
                          Roll: {userData.rollNumber}
                        </div>
                      )}
                      
                      {userData?.phoneNumber && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {userData.phoneNumber}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-600">{activities.length}</p>
                          <p className="text-gray-600">Activities</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{userData?.credits || 0}</p>
                          <p className="text-gray-600">Credits</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {Object.keys(groupedActivities).length}
                          </p>
                          <p className="text-gray-600">Categories</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities by Category */}
              {Object.entries(groupedActivities).map(([type, typeActivities]) => {
                const TypeIcon = getActivityTypeIcon(type);
                
                return (
                  <div key={type} className="card">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-primary-100 rounded-lg mr-4">
                        <TypeIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {getTypeDisplayName(type)}
                        </h3>
                        <p className="text-gray-600">{typeActivities.length} activities</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {typeActivities.map((activity) => (
                        <div 
                          key={activity.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 flex-1 pr-2">
                              {activity.title}
                            </h4>
                            <span className="badge-success text-xs">
                              Verified
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Organization:</span> {activity.organization}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Date:</span> {new Date(activity.date).toLocaleDateString()}
                          </p>
                          
                          {activity.duration && (
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Duration:</span> {activity.duration}
                            </p>
                          )}
                          
                          {activity.certificateNumber && (
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Certificate ID:</span> {activity.certificateNumber}
                            </p>
                          )}
                          
                          {activity.description && (
                            <p className="text-sm text-gray-700 mb-3">
                              {activity.description}
                            </p>
                          )}
                          
                          {activity.skills && activity.skills.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {activity.skills.slice(0, 3).map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {activity.skills.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{activity.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {activity.proofUrl && (
                            <a
                              href={activity.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View Certificate
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Portfolio Footer */}
              <div className="card text-center bg-gray-50">
                <p className="text-sm text-gray-600">
                  This portfolio was generated by Smart Student Hub and contains verified activities.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
