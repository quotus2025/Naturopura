import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createApiClient } from '../config/api';

export const useKycStatus = () => {
  const { user, token } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshKycStatus = async () => {
    if (!token) return;
    
    setIsRefreshing(true);
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.get('/api/ekyc/status');
      if (response.data.success) {
        // Update the user context with new KYC status
        user.kyc = response.data.data;
      }
    } catch (error) {
      console.error('Failed to refresh KYC status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refreshKycStatus, isRefreshing };
};