import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { createApiClient, ENDPOINTS } from '../../config/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import FarmerLayout from '../layouts/FarmerLayout';
import { format } from 'date-fns';

interface EkycStatus {
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  documents?: {
    aadhar?: string;
    pan?: string;
    selfie?: string;
  };
}

const EkycStatusCard = () => {
  const [status, setStatus] = useState<EkycStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const apiClient = createApiClient(token);
        const response = await apiClient.get(ENDPOINTS.GET_EKYC_STATUS);
        setStatus(response.data.data);
        setError('');
      } catch (error: any) {
        console.error('Error fetching eKYC status:', error);
        setError(error.message || 'Failed to fetch status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'verified':
        return <CheckCircle className="h-8 w-8 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'verified':
        return 'text-emerald-700 bg-emerald-50';
      case 'rejected':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-yellow-700 bg-yellow-50';
    }
  };

  return (
    <FarmerLayout title="eKYC Status" subtitle="Check your verification status">
      <div className="max-w-3xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>eKYC Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Clock className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : (
              <div className="space-y-6">
                {/* Status Overview */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  {getStatusIcon()}
                  <div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium capitalize ${getStatusColor()}`}>
                      {status?.status || 'pending'}
                    </div>
                    {status?.verifiedAt && (
                      <p className="mt-1 text-sm text-gray-500">
                        Verified on: {format(new Date(status.verifiedAt), 'PPP')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Documents Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Submitted Documents</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${status?.documents?.aadhar ? 'bg-emerald-100' : 'bg-gray-100'} mb-3`}>
                            {status?.documents?.aadhar ? (
                              <CheckCircle className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <h4 className="font-medium">Aadhar Card</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {status?.documents?.aadhar ? 'Submitted' : 'Pending'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${status?.documents?.pan ? 'bg-emerald-100' : 'bg-gray-100'} mb-3`}>
                            {status?.documents?.pan ? (
                              <CheckCircle className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <h4 className="font-medium">PAN Card</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {status?.documents?.pan ? 'Submitted' : 'Pending'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${status?.documents?.selfie ? 'bg-emerald-100' : 'bg-gray-100'} mb-3`}>
                            {status?.documents?.selfie ? (
                              <CheckCircle className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <h4 className="font-medium">Selfie</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {status?.documents?.selfie ? 'Submitted' : 'Pending'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default EkycStatusCard;