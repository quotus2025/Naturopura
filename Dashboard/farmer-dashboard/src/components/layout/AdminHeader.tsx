'use client';

import { FC, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AdminProfileSidebar from '@/components/AdminProfileSidebar';
import { useAuth } from '@/context/AuthContext';

const AdminHeader: FC = () => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
        </div>
      </header>
    );
  }

  if (!user) {
    router.push('/admin/login');
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </Button>

            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.name?.[0] || 'T'}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">
                  System Administrator
                </span>
              </div>
            </Button>
          </div>
        </div>
      </header>

      <AdminProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </>
  );
};

export default AdminHeader;