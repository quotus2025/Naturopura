'use client';

import { FC, useState, ReactElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Wallet,
  ShoppingCart,
  Cloud,
  Shield,
  ChevronDown,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: ReactElement;
  href?: string;
  subItems?: {
    title: string;
    href: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/',
  },
  {
    title: 'Financial Services',
    icon: <Wallet className="h-5 w-5" />,
    subItems: [
      { title: 'Apply Loans', href: '/financial/loans' },
      { title: 'Insurance', href: '/financial/insurance' },
      { title: 'Payment History', href: '/financial/payments' },
    ],
  },
  {
    title: 'Marketplace',
    icon: <ShoppingCart className="h-5 w-5" />,
    subItems: [
      { title: 'Buy Products', href: '/marketplace/buy' },
      { title: 'Sell Products', href: '/marketplace/sell' },
      { title: 'My Orders', href: '/marketplace/orders' },
    ],
  },
  {
    title: 'Monitoring & Advisory',
    icon: <Cloud className="h-5 w-5" />,
    subItems: [
      { title: 'Weather Updates', href: '/monitoring/weather' },
      { title: 'Crop Health', href: '/monitoring/crops' },
      { title: 'Expert Advice', href: '/monitoring/advice' },
    ],
  },
  {
    title: 'Animal Attack Prevention',
    icon: <Shield className="h-5 w-5" />,
    subItems: [
      { title: 'Alert System', href: '/prevention/alerts' },
      { title: 'Safety Tips', href: '/prevention/tips' },
      { title: 'Emergency Contacts', href: '/prevention/contacts' },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubItems = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className={`flex h-screen flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <Image
                src="https://quotus.com/wp-content/uploads/2023/10/QUOTUS_Logo-RGB_Blue.png"
                alt="Quotus Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900">NaturoPura</h1>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <X className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => toggleSubItems(item.title)}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    expandedItems.includes(item.title)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>
              )}

              {!isCollapsed && item.subItems && expandedItems.includes(item.title) && (
                <div className="mt-1 space-y-1 pl-11">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        pathname === subItem.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Link>
          <Link
            href="/help"
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Help & Support</span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
