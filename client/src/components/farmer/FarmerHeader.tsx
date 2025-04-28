import { useState, useEffect } from 'react';
import { Menu, LogOut, ChevronRight, Bell, User, Settings, Mail, Key, Shield, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Link } from 'react-router-dom';

interface FarmerHeaderProps {
  title: string;
  subtitle: string;
}

const FarmerHeader: React.FC<FarmerHeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [showProfile, setShowProfile] = useState(false);

  // Force re-render when user changes
  useEffect(() => {
    console.log('Current KYC Status:', user?.kyc?.status);
  }, [user?.kyc?.status]);

  const kycStatus = user?.kyc?.status || 'pending';
  const isKycVerified = kycStatus === 'verified';

  const getKycStatusDisplay = () => {
    return (
      <div 
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isKycVerified 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {isKycVerified ? (
          <>
            <Shield className="h-3.5 w-3.5" />
            <span>KYC Verified</span>
          </>
        ) : (
          <>
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>KYC {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}</span>
          </>
        )}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-gradient-to-r from-green-50 via-green-100 to-blue-50 px-6 shadow-md transition-all duration-300"
      style={{ 
        paddingLeft: isExpanded ? '17rem' : '5rem'
      }}
    >
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-green-100/80 active:scale-95 transition-all -ml-2"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-col items-start">
          <motion.h2 
            className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h2>
          <motion.span 
            className="text-xs text-green-600 font-medium -mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {subtitle}
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {getKycStatusDisplay()}
            </TooltipTrigger>
            <TooltipContent>
              {isKycVerified 
                ? 'Your KYC is verified'
                : 'Complete your KYC verification'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100/80 active:scale-95 transition-all relative"
              >
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative">
          <Button 
            onClick={() => setShowProfile(!showProfile)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none px-4 shadow-md transition-all duration-300 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-blue-400 text-white text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user?.name || 'User'}</span>
            </span>
            <span className="absolute inset-0 flex justify-end items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ChevronRight className="h-4 w-4" />
            </span>
          </Button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 py-1 bg-white rounded-lg shadow-lg ring-1 ring-black/5 divide-y divide-gray-100"
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{user?.name}</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Key className="h-3 w-3" />
                        ID: {user?.id}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-3.5 w-3.5" />
                      <span className="capitalize">Role: {user?.role || 'Farmer'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mt-2">
                      <Shield className="h-3.5 w-3.5" />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${isKycVerified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {isKycVerified ? 'KYC Verified' : 'KYC Pending'}
                      </span>
                      {!isKycVerified && (
                        <Link 
                          to="/farmer/ekyc" 
                          className="text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => setShowProfile(false)}
                        >
                          Complete Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-1 py-1">
                  <Link 
                    to="/farmer/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                    onClick={() => setShowProfile(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                  <Link 
                    to="/farmer/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                    onClick={() => setShowProfile(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>

                <div className="px-1 py-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default FarmerHeader;
