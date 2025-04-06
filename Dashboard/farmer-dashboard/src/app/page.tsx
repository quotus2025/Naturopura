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
} from 'lucide-react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your farm operations and track your progress.
          </p>
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
