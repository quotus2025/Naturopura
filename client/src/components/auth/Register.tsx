import React, { useState } from 'react';
import axios from 'axios';
import { LucideEye, LucideEyeOff, LucideMail, LucideLock, LucideLoader2, LucideSprout, LucideUser, LucidePhone, LucideMapPin, LucideRuler, LucideCrop } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'farmer',
    phoneNumber: '', 
    address: '', 
    farmSize: '',
    cropTypes: '', 
    latitude: '', 
    longitude: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const goToPreviousStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const payload = {
      ...formData,
      farmSize: formData.farmSize ? Number(formData.farmSize) : 0,
      cropTypes: formData.cropTypes ? formData.cropTypes.split(',').map(c => c.trim()) : [],
      location: {
        latitude: formData.latitude ? Number(formData.latitude) : 0,
        longitude: formData.longitude ? Number(formData.longitude) : 0
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', payload);
      setSuccess('Registration successful! You can now login.');
      setFormData({
        name: '', email: '', password: '', role: 'farmer',
        phoneNumber: '', address: '', farmSize: '',
        cropTypes: '', latitude: '', longitude: ''
      });
      console.log(res.data);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
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
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532")',
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
              Join Naturopura
            </span>
          </motion.h1>
          <motion.p 
            className="text-white/90 max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join our platform to revolutionize your farming operations with cutting-edge technology.
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

      {/* Right side - Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div 
          className="w-full max-w-2xl space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 text-transparent bg-clip-text">
                Create Your Account
              </span>
            </h2>
            <p className="text-sm text-white/70">
              {step === 1 ? 'Step 1: Basic Information' : 'Step 2: Farm Details'}
            </p>
          </div>

          {error && (
            <div className="border border-red-500/30 text-red-400 bg-red-900/20 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="border border-emerald-500/30 text-emerald-400 bg-emerald-900/20 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={step === 1 ? goToNextStep : handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideUser className="h-4 w-4" />
                      </div>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideMail className="h-4 w-4" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideLock className="h-4 w-4" />
                      </div>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="••••••••"
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

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucidePhone className="h-4 w-4" />
                      </div>
                      <input
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">User Role</label>
                    <select 
                      name="role" 
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-white/90 text-sm font-medium">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideMapPin className="h-4 w-4" />
                      </div>
                      <textarea 
                        name="address" 
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="Your farm address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 font-medium"
                  >
                    Next: Farm Details
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Farm Size (in acres)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideRuler className="h-4 w-4" />
                      </div>
                      <input
                        name="farmSize"
                        type="number"
                        value={formData.farmSize}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Latitude</label>
                    <input
                      name="latitude"
                      type="text"
                      value={formData.latitude}
                      onChange={handleChange}
                      className="w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                      placeholder="e.g., 41.8781"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/90 text-sm font-medium">Longitude</label>
                    <input
                      name="longitude"
                      type="text"
                      value={formData.longitude}
                      onChange={handleChange}
                      className="w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                      placeholder="e.g., -87.6298"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-white/90 text-sm font-medium">Crop Types</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <LucideCrop className="h-4 w-4" />
                      </div>
                      <input
                        name="cropTypes"
                        type="text"
                        value={formData.cropTypes}
                        onChange={handleChange}
                        className="pl-10 w-full bg-white/10 border-white/20 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-white/50"
                        placeholder="e.g., Wheat, Corn, Soybeans"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 font-medium flex items-center"
                  >
                    {loading ? (
                      <>
                        <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="text-center">
            <p className="text-white/70">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                Login here
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;