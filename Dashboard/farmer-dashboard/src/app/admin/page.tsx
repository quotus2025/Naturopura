'use client';

import { FC, useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Farmer } from '@/models/Farmer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface FarmerWithLoans extends Farmer {
  loans?: {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
  }[];
}

const AdminDashboard: FC = () => {
  const [farmers, setFarmers] = useState<FarmerWithLoans[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await fetch('/api/admin/farmers');
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLoan = async (farmerId: string, loanId: string) => {
    try {
      await fetch(`/api/admin/loans/${loanId}/approve`, {
        method: 'POST',
      });
      fetchFarmers(); // Refresh the list
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handleRejectLoan = async (farmerId: string, loanId: string) => {
    try {
      await fetch(`/api/admin/loans/${loanId}/reject`, {
        method: 'POST',
      });
      fetchFarmers(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting loan:', error);
    }
  };

  const handleDeleteFarmer = async (farmerId: string) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await fetch(`/api/admin/farmers/${farmerId}`, {
          method: 'DELETE',
        });
        fetchFarmers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting farmer:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Farmer Management</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={fetchFarmers}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Farm Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Loans</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmers.map((farmer) => (
                <TableRow key={farmer._id}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.email}</TableCell>
                  <TableCell>{farmer.farmName}</TableCell>
                  <TableCell>{farmer.location}</TableCell>
                  <TableCell>
                    {farmer.loans?.map((loan) => (
                      <div key={loan.id} className="flex items-center space-x-2">
                        <span>₹{loan.amount}</span>
                        <Badge
                          variant={
                            loan.status === 'approved'
                              ? 'success'
                              : loan.status === 'rejected'
                              ? 'destructive'
                              : 'default'
                          }
                        >
                          {loan.status}
                        </Badge>
                        {loan.status === 'pending' && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveLoan(farmer._id, loan.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectLoan(farmer._id, loan.id)}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.location.href = `/admin/farmers/${farmer._id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 