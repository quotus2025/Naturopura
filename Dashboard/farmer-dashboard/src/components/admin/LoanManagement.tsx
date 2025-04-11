'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, XCircle, 
  TrendingUp, IndianRupee, Calendar,
  RefreshCcw, Filter
} from 'lucide-react';

interface Loan {
  _id: string;
  farmerId: {
    name: string;
    email: string;
    farmName: string;
  };
  amount: number;
  purpose: string;
  tenure: number;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  interestRate: number;
}

const LoanManagement = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Calculate statistics
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const pendingLoans = loans.filter(loan => loan.status === 'pending');
  const approvedLoans = loans.filter(loan => loan.status === 'approved');
  const rejectedLoans = loans.filter(loan => loan.status === 'rejected');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/admin/loans');
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      const data = await response.json();
      setLoans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (loanId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/loans/${loanId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan status');
      }

      fetchLoans();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
    }
  };

  const filteredLoans = loans.filter(loan => 
    statusFilter === 'all' ? true : loan.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Loan Management</h1>
            <p className="mt-2 text-blue-100">Overview of all loan applications and their status</p>
          </div>
          <button 
            onClick={fetchLoans}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <IndianRupee className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pendingLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold">{approvedLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold">{rejectedLoans.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredLoans.length} of {loans.length} applications
        </p>
      </div>

      {/* Loan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.map((loan) => (
          <div
            key={loan._id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{loan.farmerId.name}</h3>
                <p className="text-sm text-gray-500">{loan.farmerId.farmName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  loan.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : loan.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">₹{loan.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Tenure</span>
                <span className="font-semibold">{loan.tenure} months</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Interest Rate</span>
                <span className="font-semibold">{loan.interestRate}%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Applied</span>
                <span className="text-sm text-gray-600">
                  {new Date(loan.applicationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {loan.status === 'pending' && (
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => handleStatusUpdate(loan._id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(loan._id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredLoans.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No loan applications found</p>
            <p className="text-gray-500 text-sm mt-1">
              {statusFilter === 'all' 
                ? 'There are no loan applications yet'
                : `No ${statusFilter} applications available`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanManagement;