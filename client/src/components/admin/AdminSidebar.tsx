import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard,
  BarChart3,
  Leaf,
  Settings,
  LogOut,
  Tractor,
  Sprout,
  Store,
  FileText,
  HelpCircle,
  ChevronLeft,
  User,
  Bell,
  Lock,
  Globe,
  Database,
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

const menuItems = [
  {
    title: 'Overview',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: '/admin/dashboard',
    description: 'Dashboard overview'
  },
  {
    title: 'Farmers',
    icon: <Users className="h-5 w-5" />,
    path: '/admin/farmers',
    description: 'Manage farmers'
  },
  {
    title: 'Loans',
    icon: <CreditCard className="h-5 w-5" />,
    path: '/admin/loans',
    description: 'Loan applications'
  },
  {
    title: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/admin/analytics',
    description: 'Reports & insights'
  },
  {
    title: 'Crops',
    icon: <Sprout className="h-5 w-5" />,
    path: '/admin/crops',
    description: 'Crop management'
  },
  {
    title: 'Equipment',
    icon: <Tractor className="h-5 w-5" />,
    path: '/admin/equipment',
    description: 'Farm equipment'
  },
  {
    title: 'Marketplace',
    icon: <Store className="h-5 w-5" />,
    path: '/admin/marketplace',
    description: 'Market operations'
  },
  {
    title: 'Documents',
    icon: <FileText className="h-5 w-5" />,
    path: '/admin/documents',
    description: 'Manage documents'
  },
  {
    title: 'Support',
    icon: <HelpCircle className="h-5 w-5" />,
    path: '/admin/support',
    description: 'Help & support'
  },
  {
    title: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    path: '/admin/settings',
    description: 'System settings',
    submenu: [
      {
        title: 'General',
        icon: <Globe className="h-4 w-4" />,
        path: '/admin/settings/general',
        description: 'Basic settings'
      },
      {
        title: 'Security',
        icon: <Lock className="h-4 w-4" />,
        path: '/admin/settings/security',
        description: 'Security controls'
      },
      {
        title: 'Notifications',
        icon: <Bell className="h-4 w-4" />,
        path: '/admin/settings/notifications',
        description: 'Alert preferences'
      },
      {
        title: 'Database',
        icon: <Database className="h-4 w-4" />,
        path: '/admin/settings/database',
        description: 'Data management'
      },
      {
        title: 'Email',
        icon: <Mail className="h-4 w-4" />,
        path: '/admin/settings/email',
        description: 'Email configuration'
      }
    ]
  }
];

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setExpandedSubmenu(expandedSubmenu === title ? null : title);
  };

  const isSubmenuActive = (item: any) => {
    if (!item.submenu) return false;
    return item.submenu.some((subItem: any) => location.pathname === subItem.path);
  };

  return (
    <motion.div 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300",
        isExpanded ? "w-64" : "w-20"
      )}
      initial={false}
      animate={{ width: isExpanded ? 256 : 80 }}
    >
      {/* Logo and collapse button */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-emerald-600 rounded-lg h-10 w-10">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-bold text-emerald-700"
              >
                Naturopura
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-1 p-3 mt-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || isSubmenuActive(item);
          return (
            <div key={item.path}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                      isActive 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md",
                      isActive ? "bg-emerald-100" : "bg-transparent"
                    )}>
                      {item.icon}
                    </div>
                    {isExpanded && (
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          {isActive && (
                            <span className="text-xs text-emerald-600">{item.description}</span>
                          )}
                        </div>
                        {expandedSubmenu === item.title ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && expandedSubmenu === item.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1"
                      >
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                              location.pathname === subItem.path
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {subItem.icon}
                            <span className="text-sm">{subItem.title}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    isActive ? "bg-emerald-100" : "bg-transparent"
                  )}>
                    {item.icon}
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col min-w-0"
                      >
                        <span className="font-medium truncate">{item.title}</span>
                        {isActive && (
                          <span className="text-xs text-emerald-600 truncate">{item.description}</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className={cn(
          "flex items-center gap-3",
          isExpanded ? "justify-between" : "justify-center"
        )}>
          <Link to="/admin/profile" className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-emerald-100">
              <AvatarFallback className="bg-emerald-50 text-emerald-600">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-w-0"
                >
                  <span className="font-medium text-gray-900 truncate">{user?.name}</span>
                  <span className="text-xs text-emerald-600 truncate">Administrator</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="hover:bg-red-50 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
