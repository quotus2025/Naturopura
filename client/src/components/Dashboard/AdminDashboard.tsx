import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, BadgeCheck, IndianRupee, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { createApiClient, ENDPOINTS } from '../../config/api';
import AdminLayout from '../layouts/AdminLayout';

interface DashboardStats {
  totalFarmers: number;
  totalLoans: number;
  totalLoanAmount: number;
  totalProducts: number;
  pendingLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFarmers: 0,
    totalLoans: 0,
    totalLoanAmount: 0,
    totalProducts: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const apiClient = createApiClient(token);
      const response = await apiClient.get(ENDPOINTS.GET_DASHBOARD_STATS);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin">
      <div className="space-y-8 p-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-100">
          <h2 className="text-2xl font-bold mb-2 text-emerald-800">Dashboard</h2>
          <p className="text-emerald-600">Welcome back, Debanjali Lenka</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow duration-200 border-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Total Farmers</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-full">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.totalFarmers}</div>
              <div className="flex items-center mt-1 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Active platform users</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Products Listed</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-full">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.totalProducts}</div>
              <div className="flex items-center mt-1 text-xs text-emerald-600">
                <Activity className="h-3 w-3 mr-1" />
                <span>In marketplace</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Total Loan Value</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-full">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">
                {formatCurrency(stats.totalLoanAmount)}
              </div>
              <div className="flex items-center mt-1 text-xs text-emerald-600">
                <span>{stats.totalLoans} loans processed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200 border-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">Pending Approvals</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-full">
                <BadgeCheck className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.pendingLoans}</div>
              <div className="flex items-center mt-1 text-xs text-emerald-600">
                <span>Awaiting review</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Status Overview */}
        <Card className="hover:shadow-md transition-shadow duration-200 border-emerald-50">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-800">Loan Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Approved Loans */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-emerald-800">Approved</span>
                    <span className="ml-2 text-xs text-emerald-600">
                      ({Math.round((stats.approvedLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{stats.approvedLoans}</span>
                </div>
                <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(stats.approvedLoans / stats.totalLoans * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>

              {/* Pending Loans */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-emerald-800">Pending</span>
                    <span className="ml-2 text-xs text-emerald-600">
                      ({Math.round((stats.pendingLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{stats.pendingLoans}</span>
                </div>
                <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(stats.pendingLoans / stats.totalLoans * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>

              {/* Rejected Loans */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-emerald-800">Rejected</span>
                    <span className="ml-2 text-xs text-emerald-600">
                      ({Math.round((stats.rejectedLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{stats.rejectedLoans}</span>
                </div>
                <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(stats.rejectedLoans / stats.totalLoans * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;