'use client';

import { FC, useState } from 'react';
import { 
  X, User, Settings, Bell, LogOut, 
  Shield, CreditCard, HelpCircle, 
  Calendar, Activity, Award, 
  ChevronRight, Check, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';

interface FarmerProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FarmerProfileSidebar: FC<FarmerProfileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order Received', message: 'You have a new order for 5kg of organic rice', time: '2m ago', read: false },
    { id: 2, title: 'Payment Received', message: 'Payment of ₹2,500 received for order #1234', time: '1h ago', read: true },
    { id: 3, title: 'Weather Alert', message: 'Heavy rain expected tomorrow. Plan your harvest accordingly.', time: '3h ago', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Overlay with enhanced blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar with enhanced animations */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-white to-blue-50 shadow-2xl transform transition-all duration-500 ease-in-out z-50 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Header with gradient background */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-xl font-semibold">Farmer Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with smooth scrolling */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-64px)] scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
          {/* Profile Section with enhanced styling */}
          <div className="text-center bg-white rounded-xl p-6 shadow-sm">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ring-4 ring-green-100">
                <span className="text-4xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : ''}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                <User className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{user.name || 'Unknown'}</h3>
            <p className="text-gray-500">{user.email || 'No email provided'}</p>
            {user.farmName && (
              <p className="text-gray-600 mt-2 font-medium">{user.farmName}</p>
            )}
            {user.location && (
              <p className="text-gray-500 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {user.location}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Orders</p>
                  <p className="text-xl font-semibold text-gray-800">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="text-xl font-semibold text-gray-800">₹45,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings with enhanced interactions */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
              Account Settings
            </h4>
            <div className="space-y-2">
              <button 
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all ${
                  activeSection === 'profile' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => setActiveSection('profile')}
              >
                <User className="w-5 h-5 mr-3" />
                Edit Profile
                <ChevronRight className="w-5 h-5 ml-auto" />
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all ${
                  activeSection === 'security' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => setActiveSection('security')}
              >
                <Shield className="w-5 h-5 mr-3" />
                Security Settings
                <ChevronRight className="w-5 h-5 ml-auto" />
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all ${
                  activeSection === 'notifications' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => setActiveSection('notifications')}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all ${
                  activeSection === 'payments' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => setActiveSection('payments')}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Payment Methods
                <ChevronRight className="w-5 h-5 ml-auto" />
              </button>
              <button 
                className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all ${
                  activeSection === 'help' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => setActiveSection('help')}
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                Help & Support
                <ChevronRight className="w-5 h-5 ml-auto" />
              </button>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Recent Notifications
            </h4>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg transition-colors ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      notification.read ? 'bg-gray-100' : 'bg-blue-100'
                    }`}>
                      <Bell className={`w-4 h-4 ${
                        notification.read ? 'text-gray-500' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <button className="p-1 hover:bg-blue-100 rounded-full transition-colors">
                        <Check className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button with enhanced styling */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default FarmerProfileSidebar;