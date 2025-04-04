'use client';

import { FC } from 'react';
import { Bell, Search, User } from 'lucide-react';
import FarmerProfileSidebar from '../FarmerProfileSidebar';

interface User {
  name: string;
  email: string;
  farmName?: string;
  location?: string;
}

interface HeaderProps {
  user: User;
  onProfileOpen: (isOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({ user, onProfileOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder-gray-400"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="h-6 w-px bg-gray-200"></div>
          
          <button
            onClick={() => onProfileOpen(true)}
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500">Farmer</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
