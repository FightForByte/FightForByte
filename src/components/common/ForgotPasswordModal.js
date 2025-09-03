import React, { useEffect, useState } from 'react';

/**
 * ForgotPasswordModal
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSend?: (email) => Promise|void  (optional handler; if not provided, modal simulates send)
 */
const ForgotPasswordModal = ({ open, onClose, onSend }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setEmail('');
      setSent(false);
      setError('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Invalid email address');
      return;
    }
    if (onSend) {
      try {
        await onSend(email);
        setSent(true);
      } catch (err) {
        setError(err?.message || 'Failed to send reset link');
      }
    } else {
      // UI-only simulation
      setSent(true);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in" aria-describedby="forgot-desc">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
          onClick={() => onClose()}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <h3 id="forgot-title" className="text-lg font-semibold mb-2 text-gray-900">Reset your password</h3>
        {sent ? (
          <div id="forgot-desc" className="text-green-600 text-sm mb-2">If this email exists, a reset link has been sent.</div>
        ) : (
          <>
            <label htmlFor="fpEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              id="fpEmail"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded transition"
              type="submit"
            >
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordModal;
