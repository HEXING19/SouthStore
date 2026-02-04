'use client';

import { useState, useTransition, useEffect } from 'react';
import { X, User, Chrome } from 'lucide-react';
import { signIn, useSession } from '@/lib/auth/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { data: session } = useSession();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isPending, startTransition] = useTransition();

  // 如果已登录，自动关闭模态框
  useEffect(() => {
    if (session && isOpen) {
      onClose();
    }
  }, [session, isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      const response = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (response.error) {
        console.error("Google sign in error:", response.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gray-600/75 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {authMode === 'signin' ? 'Sign in to SouthStore' : 'Create an Account'}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {authMode === 'signin' ? 'Welcome back! Please enter your details.' : 'Join us to start shopping.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Chrome className="h-5 w-5" />
          <span>Continue with Google</span>
          {isPending && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600" />
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={authMode === 'signin' ? "current-password" : "new-password"}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="•••••••••"
              />
            </div>
          </div>

          <button className="w-full flex justify-center py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
            {authMode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>

          <div className="flex flex-col space-y-2 text-center text-xs text-gray-500 mt-4">
            {authMode === 'signin' ? (
              <>
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                <p className="text-gray-500 mt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <p className="text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
