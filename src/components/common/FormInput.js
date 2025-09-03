import React, { useState } from 'react';

/**
 * Reusable input with icon, validation, accessibility, and show/hide password support.
 * Props:
 * - id, name, type, value, onChange, placeholder, required, icon: ReactNode, error: string, autoComplete, ariaLabel
 * - showPasswordToggle: boolean (for password fields)
 */
const FormInput = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  error = '',
  autoComplete,
  ariaLabel,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 shadow-sm px-4 py-2 input-wrapper">
        {icon}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel || name}
          className="input-field block w-full bg-transparent outline-none placeholder-gray-400 text-gray-900 py-2"
        />
        {showPasswordToggle && (
          <button
            type="button"
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.354" /></svg>
            )}
          </button>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default FormInput;
