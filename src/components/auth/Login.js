import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, Lock, Mail, LogIn } from 'lucide-react';
import DarkModeToggle from '../common/DarkModeToggle';
import FormInput from '../common/FormInput';
import ForgotPasswordModal from '../common/ForgotPasswordModal';
import { loginUser } from '../../firebase/auth';
import LoadingSpinner from '../common/LoadingSpinner';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  

  // Simple email and password validation
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
    // Validate all fields before submit
    const newErrors = {
      email: validate('email', formData.email),
      password: validate('password', formData.password),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setLoading(true);
    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
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
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your Smart Student Hub account
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                icon={<Mail aria-hidden="true" className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.email}
                autoComplete="email"
                ariaLabel="Email address"
              />
            </div>

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
                placeholder="Enter your password"
                required
                icon={<Lock aria-hidden="true" className="h-6 w-6 text-gray-400 flex-shrink-0" />}
                error={errors.password}
                autoComplete="current-password"
                ariaLabel="Password"
                showPasswordToggle
              />
              {/* keep passwordStrength referenced for accessibility and to avoid lint warnings; visible only to screen readers */}
              <span className="sr-only">Password strength: {passwordStrength || 'not set'}</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              aria-label="Sign in"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <LogIn className="h-5 w-5 mr-1" />
              )}
              Sign In
            </button>
            <div className="text-right mt-2">
              <button
                type="button"
                className="text-primary-600 hover:underline text-sm font-medium focus:outline-none"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-900">🚀 Demo Mode Active</h3>
            <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
              No Firebase Required
            </span>
          </div>
          <div className="space-y-1 text-xs text-blue-800">
            <p><strong>Student:</strong> student@demo.com / demo123</p>
            <p><strong>Faculty:</strong> faculty@demo.com / demo123</p>
            <p><strong>Admin:</strong> admin@demo.com / demo123</p>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            💡 This demo works without Firebase setup for quick testing!
          </div>
        </div>
      </div>

  <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
    
    
    </div>
  );
};

export default Login;