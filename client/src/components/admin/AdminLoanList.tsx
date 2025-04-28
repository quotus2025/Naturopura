import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { createApiClient, ENDPOINTS } from '../../config/api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

interface Loan {
  _id: string;
  farmer: {
    name: string;
    email: string;
  };
  amount: number;
  purpose: string;
  term: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  appliedDate: string;
  cropType: string;
  collateral: string;
  landSize?: number;
  farmDetails?: string;
  rejectionReason?: string;
}

const AdminLoanList = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const apiClient = createApiClient(token);
      const response = await apiClient.get(ENDPOINTS.GET_ALL_LOANS);
      
      // Handle different response structures
      const loansData = response.data?.data || response.data || [];
      
      // Ensure we have an array
      if (!Array.isArray(loansData)) {
        console.error('Invalid loans data format:', loansData);
        setError('Invalid data format received from server');
        setLoans([]);
        return;
      }

      setLoans(loansData);
      setError('');
    } catch (err: any) {
      console.error('Error fetching loans:', err);
      setError(err.response?.data?.message || 'Failed to fetch loans');
      setLoans([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (loanId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const apiClient = createApiClient(token);
      await apiClient.put(`${ENDPOINTS.UPDATE_LOAN_STATUS}/${loanId}`, {
        status: newStatus,
        rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined
      });

      // Update local state
      setLoans(loans.map(loan => 
        loan._id === loanId 
          ? { ...loan, status: newStatus, rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined }
          : loan
      ));

      toast({
        title: "Success",
        description: `Loan ${newStatus} successfully`,
      });

      // Reset state
      setIsDialogOpen(false);
      setSelectedLoan(null);
      setRejectionReason('');
    } catch (err: any) {
      console.error('Error updating loan status:', err);
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to update loan status',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">{error}</div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan._id}
              className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
            >
              <div className="space-y-1">
                <div className="font-medium">{loan.farmer.name}</div>
                <div className="text-sm text-gray-500">{loan.farmer.email}</div>
                <div className="text-sm">
                  Amount: ₹{loan.amount.toLocaleString()} • Term: {loan.term}
                </div>
                <div className="text-sm text-gray-600">
                  Purpose: {loan.purpose}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                  loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </span>
                
                {loan.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleStatusUpdate(loan._id, 'approved')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        setSelectedLoan(loan);
                        setIsDialogOpen(true);
                      }}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Loan Application</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedLoan(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedLoan && handleStatusUpdate(selectedLoan._id, 'rejected')}
                disabled={!rejectionReason.trim() || isUpdating}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminLoanList;