
import { useState, useEffect } from 'react';
import { createApiClient, ENDPOINTS } from '../../config/api';
import AdminLayout from '../layouts/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from '../ui/badge';
import { Loader2, Search, Users, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '../ui/input';

interface Farmer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  farmSize: string;
  cropTypes: string[];
  kyc: {
    status: 'pending' | 'verified' | 'rejected';
    documents: string[];
  };
  createdAt: string;
}

const FarmerList = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Farmer>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchFarmers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const apiClient = createApiClient(token);
      const response = await apiClient.get(ENDPOINTS.GET_FARMERS);
      setFarmers(response.data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const sortFarmers = (a: Farmer, b: Farmer) => {
    if (sortField === 'name' || sortField === 'email') {
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    if (sortField === 'createdAt') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  };

  const handleSort = (field: keyof Farmer) => {
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredFarmers = farmers
    .filter(farmer =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortFarmers);

  return (
    <AdminLayout title="Farmers" subtitle="Manage registered farmers">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-100">Total Farmers</p>
                <p className="text-3xl font-bold">{farmers.length}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-100">Verified Farmers</p>
                <p className="text-3xl font-bold">
                  {farmers.filter(f => f.kyc.status === 'verified').length}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">Pending Verification</p>
                <p className="text-3xl font-bold">
                  {farmers.filter(f => f.kyc.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <span className="text-2xl">⌛</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{filteredFarmers.length} farmers found</span>
            <div className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Farmers Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
              <p className="text-gray-500 animate-pulse">Loading farmers data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {sortField === 'name' && (
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center space-x-1">
                      <span>Contact</span>
                      {sortField === 'email' && (
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Farm Details</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center space-x-1">
                      <span>Joined Date</span>
                      {sortField === 'createdAt' && (
                        <ArrowUpDown className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-8 w-8 text-gray-300" />
                        <div className="space-y-1">
                          <p className="text-gray-500 font-medium">No farmers found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search term.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <TableRow 
                      key={farmer._id}
                      className="group hover:bg-emerald-50/50 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-medium">
                            {farmer.name.charAt(0)}
                          </div>
                          <span className="group-hover:text-emerald-700 transition-colors">
                            {farmer.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{farmer.email}</div>
                          <div className="text-sm text-gray-500">{farmer.phoneNumber}</div>
                          <div className="text-xs text-gray-400 hidden group-hover:block transition-all">
                            {farmer.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{farmer.farmSize} acres</span>
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                            <span className="text-xs text-gray-500">{farmer.cropTypes.length} crops</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {farmer.cropTypes.map((crop, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                              >
                                {crop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-2.5 py-1 ${
                            farmer.kyc.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-100/50'
                              : farmer.kyc.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-200 shadow-sm shadow-red-100/50'
                              : 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm shadow-amber-100/50'
                          } transition-all duration-300 transform hover:scale-105`}
                        >
                          <div className="flex items-center space-x-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              farmer.kyc.status === 'verified'
                                ? 'bg-emerald-500'
                                : farmer.kyc.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}></span>
                            <span className="capitalize">{farmer.kyc.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(farmer.createdAt)}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(farmer.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FarmerList;