import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  TrendingUp,
  Calendar,
  User,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingActivities, updateActivity } from '../../firebase/firestore';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

const ApprovalPanel = () => {
  const { userData } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    const result = await getPendingActivities();
    if (result.success) {
      setActivities(result.activities);
    } else {
      toast.error('Failed to load activities');
    }
    setLoading(false);
  };

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

  const handleApproval = async (activityId, status, remarks = '') => {
    setActionLoading(prev => ({ ...prev, [activityId]: true }));
    
    try {
      const result = await updateActivity(activityId, {
        status,
        remarks,
        reviewedBy: userData.uid,
        reviewedAt: new Date().toISOString()
      });

      if (result.success) {
        toast.success(`Activity ${status} successfully!`);
        // Remove from pending list
        setActivities(prev => prev.filter(activity => activity.id !== activityId));
        setShowModal(false);
        setRemarks('');
        setSelectedActivity(null);
      } else {
        toast.error(`Failed to ${status} activity`);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(prev => ({ ...prev, [activityId]: false }));
    }
  };

  const openReviewModal = (activity, action) => {
    setSelectedActivity({ ...activity, action });
    setShowModal(true);
    setRemarks('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
    setRemarks('');
  };

  if (loading) {
    return <LoadingSpinner text="Loading approval panel..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Activity Approvals 📋
            </h1>
            <p className="mt-2 text-gray-600">
              Review and approve student activity submissions • {activities.length} pending
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold">{activities.length}</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Today's Submissions</p>
                  <p className="text-3xl font-bold">
                    {activities.filter(activity => {
                      const today = new Date().toDateString();
                      const submissionDate = activity.createdAt ? new Date(activity.createdAt.toDate()).toDateString() : '';
                      return submissionDate === today;
                    }).length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Quick Approve</p>
                  <p className="text-lg font-bold">Review & Approve</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-200" />
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="card">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">
                  No pending activities to review at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activities.map((activity) => {
                  const ActivityIcon = getActivityTypeIcon(activity.type);
                  const isLoading = actionLoading[activity.id];
                  
                  return (
                    <div 
                      key={activity.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="p-3 bg-gray-100 rounded-lg">
                            <ActivityIcon className="h-6 w-6 text-gray-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {activity.title}
                              </h3>
                              <span className="badge-warning">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Type:</span> {activity.type.replace('_', ' ').toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Organization:</span> {activity.organization}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Date:</span> {new Date(activity.date).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Student:</span> Student Name
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Submitted:</span>{' '}
                                  {activity.createdAt ? new Date(activity.createdAt.toDate()).toLocaleDateString() : 'Recently'}
                                </p>
                                {activity.duration && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Duration:</span> {activity.duration}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {activity.description && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Description:</span> {activity.description}
                                </p>
                              </div>
                            )}
                            
                            {activity.skills && activity.skills.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-600 font-medium mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {activity.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {activity.proofUrl && (
                              <div className="mb-4">
                                <a
                                  href={activity.proofUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Proof Document
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => openReviewModal(activity, 'rejected')}
                          disabled={isLoading}
                          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </button>
                        
                        <button
                          onClick={() => openReviewModal(activity, 'approved')}
                          disabled={isLoading}
                          className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedActivity.action === 'approved' ? 'Approve' : 'Reject'} Activity
            </h3>
            
            <p className="text-gray-600 mb-4">
              Activity: <span className="font-medium">{selectedActivity.title}</span>
            </p>
            
            <div className="mb-4">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks {selectedActivity.action === 'rejected' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="remarks"
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="input-field"
                placeholder={
                  selectedActivity.action === 'approved' 
                    ? "Optional feedback for the student..."
                    : "Please provide reason for rejection..."
                }
              />
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={closeModal}
                className="btn-secondary"
                disabled={actionLoading[selectedActivity.id]}
              >
                Cancel
              </button>
              
              <button
                onClick={() => {
                  if (selectedActivity.action === 'rejected' && !remarks.trim()) {
                    toast.error('Please provide a reason for rejection');
                    return;
                  }
                  handleApproval(selectedActivity.id, selectedActivity.action, remarks);
                }}
                disabled={actionLoading[selectedActivity.id]}
                className={`btn-primary ${
                  selectedActivity.action === 'rejected' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionLoading[selectedActivity.id] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedActivity.action === 'approved' ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirm {selectedActivity.action === 'approved' ? 'Approval' : 'Rejection'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPanel;
