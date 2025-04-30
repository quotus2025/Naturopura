import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users, BadgeCheck, IndianRupee, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { createApiClient, ENDPOINTS } from '../../config/api';
import AdminLayout from '../layouts/AdminLayout';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";

// Add fade/scale animation utility classes
const fadeAnim = "animate-fade-in";
const scaleAnim = "hover:scale-[1.04] transition-transform";

// Simple glass class for effect
const glass = "bg-white/30 backdrop-blur-lg shadow-xl border border-white/40";

// Gradient highlights for cards/icons
const iconBg = [
  "from-emerald-400 via-emerald-100 to-white",
  "from-blue-400 via-blue-100 to-white",
  "from-violet-400 via-violet-100 to-white",
  "from-amber-400 via-amber-100 to-white"
];

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

  // Simple loading shimmer
  if (isLoading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Overview">
        <div className="flex flex-col gap-8 items-center justify-center min-h-[60vh] text-lg text-gray-600 animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded-lg mb-2" />
          <div className="h-32 w-full max-w-6xl bg-emerald-100/90 rounded-2xl mb-2" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-emerald-200/80" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Overview">
      <div className="space-y-8 p-4 max-w-7xl mx-auto w-full">

        {/* Beautiful Welcome Section */}
        <div
          className={`rounded-2xl p-7 md:p-10 text-white shadow-2xl relative overflow-hidden ${fadeAnim}`}
          style={{
            background: 'linear-gradient(108deg, #22c55e 30%, #16a34a 100%)',
            position: 'relative'
          }}
        >
          <span className="absolute -top-12 -right-12 bg-green-400/30 blur-3xl w-72 h-72 rounded-full"></span>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg tracking-tight">Welcome back, Admin!</h2>
          <p className="opacity-90 text-lg">Here's what's happening with your platform today.</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Button variant="secondary" className="font-medium">
              View Reports
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Manage Farmers
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL FARMERS */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Card className={`${glass} ${fadeAnim} ${scaleAnim} hover:shadow-2xl`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-900/90">Total Farmers</CardTitle>
                  <div className={`p-2 bg-gradient-to-br ${iconBg[0]} rounded-full shadow`}>
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-emerald-900">{stats.totalFarmers}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-700/70 font-semibold">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Active platform users</span>
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Farmer Activity</h4>
                <p className="text-sm">
                  There are {stats.totalFarmers} farmers registered on the platform.
                  They can list products, apply for loans, and access resources.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* PRODUCTS LISTED */}
          <Card className={`${glass} ${fadeAnim} ${scaleAnim} hover:shadow-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/90">Products Listed</CardTitle>
              <div className={`p-2 bg-gradient-to-br ${iconBg[1]} rounded-full shadow`}>
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-900">{stats.totalProducts}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-700/70 font-semibold">
                <Activity className="h-4 w-4 text-green-500" />
                <span>In marketplace</span>
              </div>
            </CardContent>
          </Card>
          
          {/* TOTAL LOAN VALUE */}
          <Card className={`${glass} ${fadeAnim} ${scaleAnim} hover:shadow-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/90">Total Loan Value</CardTitle>
              <div className={`p-2 bg-gradient-to-br ${iconBg[2]} rounded-full shadow`}>
                <IndianRupee className="h-6 w-6 text-violet-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-900">{formatCurrency(stats.totalLoanAmount)}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-violet-700/70 font-semibold">
                <span>{stats.totalLoans} loans processed</span>
              </div>
            </CardContent>
          </Card>
          
          {/* PENDING APPROVALS */}
          <Card className={`${glass} ${fadeAnim} ${scaleAnim} hover:shadow-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-900/90">Pending Approvals</CardTitle>
              <div className={`p-2 bg-gradient-to-br ${iconBg[3]} rounded-full shadow`}>
                <BadgeCheck className="h-6 w-6 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-900">{stats.pendingLoans}</div>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700/70 font-semibold">
                <span>Awaiting review</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Status Overview with animated progress bars */}
        <Card className={`${glass} ${fadeAnim} hover:shadow-2xl`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-900/90">Loan Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Approved Loans */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-green-700">Approved</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({Math.round((stats.approvedLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-700">{stats.approvedLoans}</span>
                </div>
                <div className="h-3 bg-green-100 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 ease-out"
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
                    <span className="text-sm font-semibold text-yellow-700">Pending</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({Math.round((stats.pendingLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">{stats.pendingLoans}</span>
                </div>
                <div className="h-3 bg-yellow-100 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-700 ease-out"
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
                    <span className="text-sm font-semibold text-red-700">Rejected</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({Math.round((stats.rejectedLoans / stats.totalLoans * 100) || 0)}%)
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{stats.rejectedLoans}</span>
                </div>
                <div className="h-3 bg-red-100 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all duration-700 ease-out"
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