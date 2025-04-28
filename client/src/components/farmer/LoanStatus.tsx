import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createApiClient, ENDPOINTS } from '../../config/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import FarmerLayout from '../layouts/FarmerLayout';

interface LoanDetails {
  id: string;
  amount: number;
  purpose: string;
  term: string;
  collateral: string;
  cropType: string;
  landSize?: number;
  farmDetails?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const LoanStatus = () => {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<LoanDetails | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiClient = createApiClient(token);
        const response = await apiClient.get(ENDPOINTS.GET_LOAN_BY_ID(id!));
        setLoan(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch loan details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <FarmerLayout title="Loan Details" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <p>Loading loan details...</p>
        </div>
      </FarmerLayout>
    );
  }

  if (error) {
    return (
      <FarmerLayout title="Error" subtitle="Failed to load loan details">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </FarmerLayout>
    );
  }

  if (!loan) {
    return (
      <FarmerLayout title="Not Found" subtitle="Loan details not found">
        <div className="text-center">
          <p>No loan details found for the given ID.</p>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout title="Loan Details" subtitle={`Loan ID: ${loan.id}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Loan Application Details</CardTitle>
            <Badge className={getStatusColor(loan.status)}>
              {loan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-500">Amount</h3>
              <p className="text-lg">₹{loan.amount.toLocaleString()}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500">Purpose</h3>
              <p className="text-lg">{loan.purpose}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500">Term</h3>
              <p className="text-lg">{loan.term}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500">Collateral</h3>
              <p className="text-lg">{loan.collateral}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500">Crop Type</h3>
              <p className="text-lg">{loan.cropType}</p>
            </div>
            
            {loan.landSize && (
              <div>
                <h3 className="font-medium text-gray-500">Land Size</h3>
                <p className="text-lg">{loan.landSize} acres</p>
              </div>
            )}
            
            {loan.farmDetails && (
              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-500">Farm Details</h3>
                <p className="text-lg">{loan.farmDetails}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-gray-500">Applied On</h3>
              <p className="text-lg">
                {new Date(loan.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500">Last Updated</h3>
              <p className="text-lg">
                {new Date(loan.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </FarmerLayout>
  );
};

export default LoanStatus;