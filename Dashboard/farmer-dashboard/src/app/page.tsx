'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AuthProvider } from '@/context/AuthContext';
import {
  Wallet,
  ShoppingCart,
  Cloud,
  Shield,
  TrendingUp,
  Calendar,
  AlertCircle,
  Users,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoanDetailsModal from '@/components/loan/LoanDetailsModal';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  tenure: number;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, href, color }) => (
  <Link
    href={href}
    className="group block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
  >
    <div className={`inline-flex p-3 rounded-lg ${color} mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">
      {description}
    </p>
  </Link>
);

const FarmerDashboardContent = () => {
  const { user, loading } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch('/api/farmer/loans');
        if (!response.ok) throw new Error('Failed to fetch loans');
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoadingLoans(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'farmer') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>

          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-blue-100">Welcome back,</p>
                  <h1 className="text-3xl font-bold text-white">
                    {user.name}
                    {user.farmName && (
                      <span className="block text-lg text-blue-200 mt-1">
                        {user.farmName}
                      </span>
                    )}
                  </h1>
                </div>
                <p className="text-blue-100 max-w-xl">
                  Manage your farm operations, track progress, and access key insights all in one place.
                </p>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-blue-100">Current Time</p>
                  <p className="text-xl font-semibold text-white">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
                {user.location && (
                  <div className="text-right">
                    <p className="text-blue-100">Location</p>
                    <p className="text-xl font-semibold text-white flex items-center justify-end">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {user.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20">
                <Calendar className="h-5 w-5 mr-2" />
                View Schedule
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Report
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20">
                <Cloud className="h-5 w-5 mr-2" />
                Weather Forecast
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-900">₹25,000</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weather Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">2</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loan Applications Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Loan Applications</h2>
                <p className="text-sm text-gray-600 mt-1">Track your loan applications and their status</p>
              </div>
              <Link
                href="/financial/loans"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Apply for Loan
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {loans.filter(loan => loan.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {loans.filter(loan => loan.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {loans.filter(loan => loan.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoadingLoans ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : loans.length > 0 ? (
              <div className="space-y-4">
                {loans.slice(0, 3).map((loan) => (
                  <div
                    key={loan._id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedLoan(loan)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full
                          ${loan.status === 'pending' ? 'bg-yellow-100' : ''}
                          ${loan.status === 'approved' ? 'bg-green-100' : ''}
                          ${loan.status === 'rejected' ? 'bg-red-100' : ''}
                        `}>
                          {loan.status === 'pending' && <Clock className="h-6 w-6 text-yellow-600" />}
                          {loan.status === 'approved' && <CheckCircle className="h-6 w-6 text-green-600" />}
                          {loan.status === 'rejected' && <XCircle className="h-6 w-6 text-red-600" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900">₹{loan.amount.toLocaleString()}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${loan.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                              ${loan.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{loan.purpose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(loan.applicationDate).toLocaleDateString()}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {loan.tenure} months tenure
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loans.length > 3 && (
                  <Link
                    href="/financial/loans"
                    className="block text-center py-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all {loans.length} applications
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Loan Applications</h3>
                <p className="text-gray-500 mb-4">Get started with your first loan application</p>
                <Link
                  href="/financial/loans"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Apply Now
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Loan Status Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Loan Applications</h2>
            <Link
              href="/financial/loans"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>

          {isLoadingLoans ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : loans.length > 0 ? (
            <div className="space-y-4">
              {loans.slice(0, 3).map((loan) => (
                <div
                  key={loan._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg 
                      ${loan.status === 'pending' ? 'bg-yellow-100' : ''}
                      ${loan.status === 'approved' ? 'bg-green-100' : ''}
                      ${loan.status === 'rejected' ? 'bg-red-100' : ''}
                    `}>
                      {loan.status === 'pending' && <Clock className="h-5 w-5 text-yellow-600" />}
                      {loan.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {loan.status === 'rejected' && <XCircle className="h-5 w-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">₹{loan.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{loan.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${loan.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${loan.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(loan.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No loan applications yet</p>
              <Link
                href="/financial/loans"
                className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Apply for a loan
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Financial Management"
            description="Track your farm's finances, manage expenses, and view revenue reports."
            icon={<Wallet className="h-6 w-6" />}
            href="/dashboard/finance"
            color="bg-green-100 text-green-600"
          />
          <FeatureCard
            title="Marketplace"
            description="Buy and sell agricultural products in our marketplace."
            icon={<ShoppingCart className="h-6 w-6" />}
            href="/dashboard/marketplace"
            color="bg-blue-100 text-blue-600"
          />
          <FeatureCard
            title="Weather Monitoring"
            description="Get real-time weather updates and alerts for your farm."
            icon={<Cloud className="h-6 w-6" />}
            href="/dashboard/weather"
            color="bg-yellow-100 text-yellow-600"
          />
          <FeatureCard
            title="Crop Protection"
            description="Monitor and protect your crops from pests and diseases."
            icon={<Shield className="h-6 w-6" />}
            href="/dashboard/protection"
            color="bg-red-100 text-red-600"
          />
          <FeatureCard
            title="Growth Analytics"
            description="Track your farm's growth and performance metrics."
            icon={<TrendingUp className="h-6 w-6" />}
            href="/dashboard/analytics"
            color="bg-purple-100 text-purple-600"
          />
          <FeatureCard
            title="Calendar"
            description="Plan and manage your farming activities and schedules."
            icon={<Calendar className="h-6 w-6" />}
            href="/dashboard/calendar"
            color="bg-indigo-100 text-indigo-600"
          />
        </div>
      </div>
      <LoanDetailsModal 
        loan={selectedLoan} 
        onClose={() => setSelectedLoan(null)} 
      />
    </DashboardLayout>
  );
};

export default function FarmerDashboard() {
  return (
    <AuthProvider>
      <FarmerDashboardContent />
    </AuthProvider>
  );
}
