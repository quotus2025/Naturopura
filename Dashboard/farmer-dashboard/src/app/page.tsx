'use client';

import { FC } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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

const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon, href, color }) => (
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

const DashboardPage: FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Farmer!</h1>
          <p className="text-blue-100 text-lg">
            Access all your farming tools and services in one place
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">₹45,000</h3>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">On Track</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-yellow-600">2 New</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
            <p className="text-sm text-gray-600">Pending Alerts</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-600">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">12</h3>
            <p className="text-sm text-gray-600">Connected Experts</p>
          </div>
        </div>

        {/* Feature Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="Financial Services"
              description="Access loans, insurance, and manage your payments efficiently"
              icon={<Wallet className="h-6 w-6 text-blue-600" />}
              href="/financial"
              color="bg-blue-50"
            />
            <FeatureCard
              title="Marketplace"
              description="Buy and sell agricultural products with ease"
              icon={<ShoppingCart className="h-6 w-6 text-green-600" />}
              href="/marketplace"
              color="bg-green-50"
            />
            <FeatureCard
              title="Monitoring & Advisory"
              description="Get weather updates and expert advice for your crops"
              icon={<Cloud className="h-6 w-6 text-purple-600" />}
              href="/monitoring"
              color="bg-purple-50"
            />
            <FeatureCard
              title="Animal Protection"
              description="Protect your livestock with smart monitoring systems"
              icon={<Shield className="h-6 w-6 text-red-600" />}
              href="/prevention"
              color="bg-red-50"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
