'use client';

import { FC, ReactElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: ReactElement;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/admin',
  },
  {
    title: 'Farmers',
    icon: <Users className="h-5 w-5" />,
    href: '/admin/farmers',
  },
  {
    title: 'Loan Management',
    icon: <CreditCard className="h-5 w-5" />,
    href: '/admin/loans',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/admin/settings',
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();

  return (
    <div className={`flex h-screen flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600">Admin Panel</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;