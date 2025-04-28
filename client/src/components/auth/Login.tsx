import React, { useState } from 'react';
import {
  LucideEye,
  LucideEyeOff,
  LucideMail,
  LucideLock,
  LucideLoader2,
  LucideSprout,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });

      // Create API client without token for login
      const apiClient = createApiClient();
      const response = await apiClient.post(ENDPOINTS.LOGIN, {
        email,
        password
      });

      console.log('Login response:', response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      // Debug log before context update
      console.log('Logging in user:', user);

      // Login using context
      login(user, token);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Login error:', {
        message: errorMessage,
        error
      });

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Left side - Decorative */}
      <div className="hidden md:flex md:w-1/2 relative z-10 overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LucideSprout className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold mb-2 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 text-transparent bg-clip-text">
              Naturopura
            </span>
          </motion.h1>
          <motion.p
            className="text-white/90 max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Secure, elegant, and powerful. Manage your farm operations efficiently with our platform.
          </motion.p>
          <motion.div
            className="mt-12 space-y-4 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-white/80">Advanced farm monitoring</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-white/80">Crop management tools</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-white/80">24/7 expert support</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div
          className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 text-transparent bg-clip-text">
                Welcome back
              </span>
            </h2>
            <p className="text-sm text-white/70">
              Please sign in to your account
            </p>
          </div>

          {error && (
            <div className="border border-red-500/30 text-red-400 bg-red-900/20 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-white/90 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                    <LucideMail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-white/90 text-sm font-medium">
                    Password
                  </label>
                  <a
                    href="#forgot-password"
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                    <LucideLock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <LucideEyeOff className="h-4 w-4" />
                    ) : (
                      <LucideEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 rounded-lg transition-all duration-300 font-medium flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-white/50">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/register"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
              >
                Create an account
              </a>
            </div>
          </form>

          <div className="pt-4 text-center text-xs text-white/50">
            By signing in, you agree to our{' '}
            <a href="#terms" className="text-emerald-400 hover:text-emerald-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#privacy" className="text-emerald-400 hover:text-emerald-300">
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
