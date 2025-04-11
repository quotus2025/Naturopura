"use client";

import { FC, useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import LoanDetailsModal from "@/components/loan/LoanDetailsModal";
import { Farmer } from "@/models/Farmer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Users,
  IndianRupee,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface FarmerWithLoans extends Farmer {
  loans?: {
    id: string;
    amount: number;
    status: "pending" | "approved" | "rejected";
    applicationDate: string;
  }[];
}

const AdminDashboard: FC = () => {
  const [farmers, setFarmers] = useState<FarmerWithLoans[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  // Calculate statistics
  const totalLoans = farmers.reduce(
    (acc, farmer) => acc + (farmer.loans?.length || 0),
    0
  );

  const approvedLoansAmount = farmers.reduce(
    (acc, farmer) =>
      acc +
      (farmer.loans
        ?.filter((l) => l.status === "approved")
        .reduce((sum, loan) => sum + loan.amount, 0) || 0),
    0
  );

  const pendingLoans = farmers.reduce(
    (acc, farmer) =>
      acc + (farmer.loans?.filter((l) => l.status === "pending").length || 0),
    0
  );

  // Filter farmers based on search
  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await fetch("/api/admin/farmers");
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async (farmerId: string, loanId: string) => {
    try {
      await fetch(`/api/admin/loans/${loanId}/approve`, {
        method: "POST",
      });
      fetchFarmers(); // Refresh the list
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  const handleRejectLoan = async (farmerId: string, loanId: string) => {
    try {
      await fetch(`/api/admin/loans/${loanId}/reject`, {
        method: "POST",
      });
      fetchFarmers(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting loan:", error);
    }
  };

  const handleDeleteFarmer = async (farmerId: string) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      try {
        await fetch(`/api/admin/farmers/${farmerId}`, {
          method: "DELETE",
        });
        fetchFarmers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting farmer:", error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading farmers data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        {/* Enhanced Dashboard Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl p-8 shadow-xl overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>

          <div className="relative flex justify-between items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Farmer Management
                  <span className="block text-xl font-medium text-blue-200 mt-1">
                    Administrative Dashboard
                  </span>
                </h1>
              </div>
              <p className="text-blue-100 max-w-xl">
                Monitor farmer activities, manage loan applications, and track agricultural progress across regions.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-blue-200 text-sm">Last Updated</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                onClick={fetchFarmers}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Farmers Card */}
          <div className="group hover:shadow-lg transition-all duration-200 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Farmers</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {farmers.length}
                </p>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">Active members</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Loan Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{approvedLoansAmount.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Approved loans
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingLoans}
                </p>
                <p className="text-xs text-yellow-600">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(farmers.map((f) => f.location)).size}
                </p>
                <p className="text-xs text-purple-600">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Unique regions
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search farmers by name, email or farm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 pr-4 rounded-lg border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all placeholder-gray-400 text-gray-900 text-sm
                    bg-white shadow-sm hover:border-gray-300"
                  style={{
                    '::placeholder': {
                      color: 'rgb(156 163 175)',
                      opacity: 1
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Total: {farmers.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">
                    Showing: {filteredFarmers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-white">
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Farm Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">Loans</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFarmers.map((farmer) => (
                <TableRow
                  key={farmer._id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <TableCell className="font-medium text-black">
                    {farmer.name}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {farmer.email}
                  </TableCell>
                  <TableCell className="font-medium text-black">
                    {farmer.farmName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-100 text-gray-800">
                      {farmer.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {farmer.loans?.map((loan) => (
                        <div
                          key={loan.id}
                          onClick={() => setSelectedLoan(loan)}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 
                            hover:bg-gray-100 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium whitespace-nowrap">
                              ₹{loan.amount.toLocaleString()}
                            </span>
                            <Badge
                              className={`
                                px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${loan.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                ${loan.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                ${loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              `}
                            >
                              {loan.status.charAt(0).toUpperCase() +
                                loan.status.slice(1)}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-gray-700">
                            {new Date(loan.applicationDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {!farmer.loans?.length && (
                        <span className="text-sm text-gray-500">No loans</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-blue-50"
                        onClick={() =>
                          (window.location.href = `/admin/farmers/${farmer._id}`)
                        }
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-red-50"
                        onClick={() => handleDeleteFarmer(farmer._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* No Results State */}
        {filteredFarmers.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              No farmers found
            </h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms or clear the filter to see all farmers
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      <LoanDetailsModal 
        loan={selectedLoan} 
        onClose={() => setSelectedLoan(null)} 
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
