import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import {
  Home,
  Wallet,
  ShoppingCart,
  LineChart,
  Shield,
  Headphones,
  Bell,
  LogOut,
  Leaf,
  Cloud,
  Bug,
  Brain,
  Truck,
  BadgeDollarSign,
  ScrollText,
  Zap,
  ChevronDown,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FarmerSidebarProps {
  children?: ReactNode;
}

const FarmerSidebar = ({ children }: FarmerSidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isExpanded } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExpand = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/farmer/dashboard',
      icon: Home
    },
    {
      title: 'Financial Services',
      href: '/farmer/financial',
      icon: Wallet,
      subItems: [
        { title: 'Apply for Loans', href: '/farmer/loans/apply', icon: BadgeDollarSign },
        { title: 'eKYC Verification', href: '/farmer/ekyc', icon: FileCheck },
        { title: 'Insurance', href: '/farmer/insurance', icon: Shield },
        { title: 'Subsidies', href: '/farmer/subsidies', icon: Leaf },
        { title: 'Digital Payments', href: '/farmer/payments', icon: Zap }
      ]
    },
    {
      title: 'Marketplace',
      href: '/farmer/marketplace',
      icon: ShoppingCart,
      subItems: [
        { title: 'Buy & Sell', href: '/farmer/marketplace/trade', icon: ShoppingCart },
        { title: 'Order Management', href: '/farmer/marketplace/orders', icon: ScrollText },
        { title: 'Pricing Info', href: '/farmer/marketplace/prices', icon: LineChart },
        { title: 'Logistics', href: '/farmer/marketplace/logistics', icon: Truck }
      ]
    },
    {
      title: 'Monitoring & Advisory',
      href: '/farmer/monitoring',
      icon: LineChart,
      subItems: [
        { title: 'Weather Updates', href: '/farmer/monitoring/weather', icon: Cloud },
        { title: 'Soil Health', href: '/farmer/monitoring/soil', icon: Leaf },
        { title: 'Pest Alerts', href: '/farmer/monitoring/pests', icon: Bug },
        { title: 'AI Insights', href: '/farmer/monitoring/insights', icon: Brain }
      ]
    },
    {
      title: 'Animal Attack Prevention',
      href: '/farmer/protection',
      icon: Shield,
      subItems: [
        { title: 'IoT Sensors', href: '/farmer/protection/sensors', icon: Zap },
        { title: 'Smart Fence', href: '/farmer/protection/fence', icon: Shield },
        { title: 'Alerts', href: '/farmer/protection/alerts', icon: Bell }
      ]
    },
    {
      title: 'Support',
      href: '/farmer/support',
      icon: Headphones
    }
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isExpanded ? '16rem' : '4rem'
      }}
      className={cn(
        "border-r border-gray-200/80 bg-gradient-to-b from-white to-gray-50 h-screen flex flex-col fixed inset-y-0 left-0 shadow-sm z-40 transition-all duration-300",
        !isExpanded && "items-center"
      )}
    >
      {/* Logo and Brand */}
      <div className={cn(
        "px-4 py-6 border-b border-gray-100 bg-white transition-all duration-300",
        !isExpanded && "w-full flex justify-center"
      )}>
        <Link 
          to="/farmer/dashboard" 
          className="flex items-center gap-3 group"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
          >
            <Leaf className="h-6 w-6 text-white" />
          </motion.div>
          {isExpanded && (
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Naturopura
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 overflow-y-auto py-4 px-3 space-y-1",
        !isExpanded && "w-full"
      )}>
        {navItems.map((item) => (
          <div key={item.href} className="mb-1">
            <motion.div
              whileHover={{ x: 2 }}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all cursor-pointer",
                (location.pathname === item.href || location.pathname.startsWith(item.href + '/'))
                  ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100"
                  : "text-gray-700 hover:bg-gray-100/80"
              )}
              onClick={() => item.subItems && isExpanded && toggleExpand(item.href)}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  location.pathname === item.href
                    ? "text-emerald-600"
                    : "text-gray-500 group-hover:text-gray-700"
                )} />
                {isExpanded && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </div>
              {item.subItems && isExpanded && (
                <motion.div
                  animate={{ rotate: expandedItems.includes(item.href) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </motion.div>
              )}
            </motion.div>
            
            <AnimatePresence>
              {item.subItems && isExpanded && expandedItems.includes(item.href) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="ml-4 mt-1 space-y-1 overflow-hidden"
                >
                  {item.subItems.map((subItem) => (
                    <motion.div
                      key={subItem.href}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                          location.pathname === subItem.href
                            ? "text-emerald-600 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Profile and Logout */}
      <motion.div 
        className={cn(
          "border-t border-gray-100 bg-white/50",
          !isExpanded && "w-full"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Profile Section */}
        {isExpanded ? (
          <Link 
            to="/farmer/profile"
            className={cn(
              "flex items-center gap-3 p-4 transition-colors hover:bg-gray-50/80",
              location.pathname === '/farmer/profile'
                ? "bg-emerald-50/80 shadow-sm ring-1 ring-emerald-100"
                : "hover:bg-gray-50/80"
            )}
          >
            <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-sm">
              <AvatarFallback className="bg-emerald-50 text-emerald-600 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        ) : (
          <Avatar className="h-10 w-10 border-2 border-emerald-100 shadow-sm my-4 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all"
            onClick={() => navigate('/farmer/profile')}
          >
            <AvatarFallback className="bg-emerald-50 text-emerald-600 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Logout Button */}
        <div className={cn(
          "px-4 pb-4",
          !isExpanded && "flex justify-center"
        )}>
          <Button
            variant="ghost"
            className={cn(
              "text-gray-600 hover:text-red-600 hover:bg-red-50/80 transition-colors",
              isExpanded ? "w-full justify-start gap-2" : "w-10 h-10 p-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {isExpanded && <span>Logout</span>}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FarmerSidebar;
