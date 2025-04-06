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
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
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
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
                <span className="text-xs text-gray-500">System Administrator</span>
              </div>
            </Button>
          </div>
        </div>
      </header>

      <AdminProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user || { name: 'Admin', email: 'admin@naturopura.com', role: 'Administrator' }}
      />
    </>
  );
};

export default AdminHeader;