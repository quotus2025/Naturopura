import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';

interface MarketplaceLayoutProps {
  children: ReactNode;
}

const MarketplaceLayout: FC<MarketplaceLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col space-y-4">
          <nav className="bg-white shadow-sm p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Marketplace</h2>
              <div className="flex space-x-4">
                <Link 
                  href="/marketplace/sell"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List New Product
                </Link>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </nav>
          <main className="bg-white shadow-sm rounded-lg">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceLayout;