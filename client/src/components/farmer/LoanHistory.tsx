import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../ui/badge";
import { createApiClient, ENDPOINTS } from '../../config/api';
import FarmerLayout from '../layouts/FarmerLayout';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  term: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appliedDate: string;
  cropType: string;
  collateral: string;
  landSize?: number;
  farmDetails?: string;
}

const LoanHistory = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const apiClient = createApiClient(token);
        const response = await apiClient.get(ENDPOINTS.GET_FARMER_LOANS);
        const loansData = response.data.data || [];
        setLoans(loansData);
      } catch (err: any) {
        console.error('Error fetching loans:', err);
        setError(err.response?.data?.message || 'Failed to fetch loan history');
        if (err.response?.status === 401) {
          setTimeout(() => navigate('/login'), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <FarmerLayout title="Loan History" subtitle="View your loan applications">
      <Card>
        <CardHeader>
          <CardTitle>Your Loan Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading loan history...</div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No loan applications found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell>
                      {new Date(loan.appliedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₹{loan.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{loan.purpose}</TableCell>
                    <TableCell className="capitalize">{loan.term}</TableCell>
                    <TableCell className="capitalize">{loan.cropType}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {loan.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </FarmerLayout>
  );
};

export default LoanHistory;