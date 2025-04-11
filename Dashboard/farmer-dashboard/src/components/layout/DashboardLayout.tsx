'use client';

import { FC, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import FarmerProfileSidebar from '../FarmerProfileSidebar';
import { AuthProvider, useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardContent: FC<DashboardLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'farmer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'farmer') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onProfileOpen={() => setIsProfileOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <FarmerProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
     
    </div>
  );
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
};

export default DashboardLayout;
