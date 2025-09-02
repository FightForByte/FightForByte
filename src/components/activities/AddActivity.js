import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  Calendar, 
  Building, 
  FileText, 
  Award,
  ArrowLeft,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addActivity, uploadFile } from '../../firebase/firestore';
import Navbar from '../common/Navbar';

const AddActivity = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    organization: '',
    date: '',
    duration: '',
    certificateNumber: '',
    skills: '',
    proofUrl: ''
  });

  const activityTypes = [
    { value: 'certification', label: 'Certification', description: 'Online courses, professional certifications' },
    { value: 'internship', label: 'Internship', description: 'Summer internships, industrial training' },
    { value: 'competition', label: 'Competition', description: 'Hackathons, coding contests, technical competitions' },
    { value: 'conference', label: 'Conference/Workshop', description: 'Technical conferences, workshops, seminars' },
    { value: 'volunteering', label: 'Volunteering', description: 'Community service, social work' },
    { value: 'leadership', label: 'Leadership', description: 'Club positions, team leadership roles' },
    { value: 'project', label: 'Project', description: 'Personal projects, research work' },
    { value: 'publication', label: 'Publication', description: 'Research papers, articles' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only PDF, JPEG, or PNG files');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    setUploadingFile(true);
    try {
      const fileName = `activities/${currentUser.uid}/${Date.now()}_${selectedFile.name}`;
      const result = await uploadFile(selectedFile, fileName);
      
      if (result.success) {
        toast.success('File uploaded successfully!');
        return result.url;
      } else {
        toast.error('Failed to upload file');
        return null;
      }
    } catch (error) {
      toast.error('File upload failed');
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.organization || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Upload file if selected
      let proofUrl = '';
      if (selectedFile) {
        proofUrl = await handleFileUpload();
        if (!proofUrl) {
          setLoading(false);
          return;
        }
      }

      // Submit activity
      const activityData = {
        ...formData,
        proofUrl,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      const result = await addActivity(currentUser.uid, activityData);
      
      if (result.success) {
        toast.success('Activity added successfully! 🎉');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to add activity');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Activity</h1>
            <p className="mt-2 text-gray-600">
              Log your achievements and build your digital portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Activity Type Selection */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Type *</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activityTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                      formData.type === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{type.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{type.description}</p>
                    </div>
                    {formData.type === type.value && (
                      <div className="absolute top-2 right-2">
                        <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Information */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="e.g., AWS Cloud Practitioner Certification"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization/Institution *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 3 months, 40 hours"
                  />
                </div>

                <div>
                  <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate/ID Number
                  </label>
                  <input
                    id="certificateNumber"
                    name="certificateNumber"
                    type="text"
                    value={formData.certificateNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., AWS-CP-12345"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe what you learned or accomplished..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                    Skills/Technologies
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Cloud Computing, AWS, Docker (comma separated)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter skills separated by commas
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Proof</h2>
              <p className="text-sm text-gray-600 mb-4">
                Upload certificate, screenshot, or any document as proof of your activity
              </p>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    <label htmlFor="file-upload" className="text-primary-600 font-medium cursor-pointer hover:text-primary-700">
                      Click to upload
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 5MB
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {previewUrl && (
                        <button
                          type="button"
                          onClick={() => window.open(previewUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {previewUrl && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingFile}
                className="btn-primary flex items-center"
              >
                {loading || uploadingFile ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {uploadingFile ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Add Activity
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddActivity;
