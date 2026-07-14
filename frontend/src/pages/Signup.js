import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Blur Spheres */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-brand/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant text-center space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
              <span className="material-symbols-outlined text-emerald-brand text-[36px] group-hover:scale-110 transition-transform">pets</span>
              <span className="font-display-xl text-[24px] font-bold text-primary tracking-tight">PetStore</span>
            </Link>
            
            <div className="w-16 h-16 bg-[#E6F4EA] rounded-full flex items-center justify-center mx-auto text-[#137333]">
              <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
            </div>
            
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Verify Your Email</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                A verification link has been sent to <strong className="text-primary font-bold">{email}</strong>. Please check your inbox and verify your email to activate your account.
              </p>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <Link 
                to="/login"
                className="w-full py-3.5 bg-emerald-brand text-on-tertiary rounded-xl font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-brand/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant text-left">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
              <span className="material-symbols-outlined text-emerald-brand text-[36px] group-hover:scale-110 transition-transform">pets</span>
              <span className="font-display-xl text-[24px] font-bold text-primary tracking-tight">PetStore</span>
            </Link>
            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">Create Account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Join us to purchase vet-approved supplies and diets.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 bg-error-container text-error rounded-lg border border-error/20 flex items-start gap-2 text-sm">
                <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                <p>{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="doctor@provet.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="p-3 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md focus:ring-2 focus:ring-emerald-brand/20 focus:border-emerald-brand outline-none transition-all disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-emerald-brand text-on-tertiary rounded-xl font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-outline-variant text-center space-y-4">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-[#179d53] font-bold hover:underline">
                Sign in here
              </Link>
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary font-bold uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;
