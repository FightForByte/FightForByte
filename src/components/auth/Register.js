import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Lock, Mail, UserPlus, Building, Phone, Hash } from 'lucide-react';
import DarkModeToggle from '../common/DarkModeToggle';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../common/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    rollNumber: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  // Phone verification (client-side simulation only)
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Electrical',
    'Other'
  ];

  // Simple validation
  const validate = (field, value) => {
    let error = '';
    if (field === 'email') {
      if (!value) error = 'Email is required';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) error = 'Invalid email address';
    }
    if (field === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    if (field === 'confirmPassword') {
      if (!value) error = 'Please confirm your password';
      else if (value !== formData.password) error = 'Passwords do not match';
    }
    if (field === 'name') {
      if (!value) error = 'Name is required';
    }
    if (field === 'department') {
      if (!value) error = 'Department is required';
    }
    if (field === 'rollNumber' && formData.role === 'student') {
      if (!value) error = 'Roll number is required';
    }
    if (field === 'phoneNumber') {
      if (!value) error = 'Phone number is required';
      else if (!/^\d{10}$/.test(value)) error = 'Enter a valid 10-digit phone number';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
  };

  function getPasswordStrength(pw) {
    if (!pw) return '';
    if (pw.length < 6) return 'Weak';
    if (/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pw)) return 'Strong';
    if (/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(pw)) return 'Medium';
    return 'Weak';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Client-side flow (no backend)
    // require phone verification if phone number provided
    if (formData.phoneNumber && !codeVerified) {
      toast.error('Please verify your phone number before creating account');
      return;
    }

    setLoading(true);
    // simulate network delay
    setTimeout(() => {
      setLoading(false);
      toast.success('Account created successfully! 🎉 (simulated)');
      navigate('/dashboard');
    }, 900);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 auth-bg">
      <div className="auth-card w-full space-y-8">
        {/* Header */}
        <div className="text-center relative">
          <div className="absolute top-0 right-0">
            <DarkModeToggle className="-mt-2 -mr-2" />
          </div>
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">
            Join Smart Student Hub today
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <FormInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                icon={<User className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.name}
                ariaLabel="Full Name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <FormInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                icon={<Mail className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.email}
                autoComplete="email"
                ariaLabel="Email address"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 shadow-sm px-4 py-2">
                <Building className="h-6 w-6 text-gray-400 flex-shrink-0" />
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field block w-full bg-transparent outline-none placeholder-gray-400 text-gray-900 py-2"
                  aria-label="Department"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roll Number (for students) */}
            {formData.role === 'student' && (
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Roll Number
                </label>
                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 shadow-sm px-4 py-2">
                  <Hash className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <input
                    id="rollNumber"
                    name="rollNumber"
                    type="text"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="input-field block w-full bg-transparent outline-none placeholder-gray-400 text-gray-900 py-2"
                    placeholder="Enter your roll number"
                    aria-label="Roll Number"
                  />
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="space-y-2">
                <FormInput
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  icon={<Phone className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                  error={errors.phoneNumber}
                  ariaLabel="Phone Number"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded disabled:opacity-60"
                    disabled={!/^\d{10}$/.test(formData.phoneNumber) || codeSent}
                    onClick={() => {
                      // simulate sending code
                      const code = Math.floor(100000 + Math.random() * 900000).toString();
                      setVerificationCode(code);
                      setCodeSent(true);
                      setCodeError('');
                      toast.success(`Verification code sent: ${code} (simulated)`);
                    }}
                  >
                    {codeSent ? 'Code Sent' : 'Send Code'}
                  </button>

                  {codeSent && !codeVerified && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={enteredCode}
                        onChange={e => setEnteredCode(e.target.value)}
                        placeholder="Enter code"
                        className="px-2 py-1 border rounded"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                        onClick={() => {
                          if (enteredCode === verificationCode) {
                            setCodeVerified(true);
                            setCodeError('');
                            toast.success('Phone verified (simulated)');
                          } else {
                            setCodeError('Invalid code');
                          }
                        }}
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {codeVerified && <span className="text-green-600 text-sm">Verified</span>}
                </div>
                {codeError && <div className="text-red-500 text-xs">{codeError}</div>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <FormInput
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                icon={<Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.password}
                ariaLabel="Password"
                showPasswordToggle
              />
              {formData.password && (
                <div className={`mt-1 text-xs font-medium ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-500'}`}>Password strength: {passwordStrength}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                icon={<Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.confirmPassword}
                ariaLabel="Confirm Password"
                showPasswordToggle
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <UserPlus className="h-5 w-5 mr-1" />
              )}
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
