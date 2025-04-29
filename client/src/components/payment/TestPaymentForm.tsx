import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext'; // 
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api'; // 

interface TestPaymentFormProps {
  amount: number;
  productId: string;
  onSuccess: () => void;
}

const TestPaymentForm = ({ amount, productId, onSuccess }: TestPaymentFormProps) => {
  const { account, connectWallet, isConnected } = useWeb3();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCryptoPayment = async () => {
    try {
      if (!isConnected) {
        await connectWallet();
      }

      if (!token) {
        throw new Error('Please login to make purchases');
      }

      setLoading(true);

      // Log for debugging
      console.log('Starting payment:', {
        amount,
        productId,
        token: token ? 'present' : 'missing'
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const recipientAddress = '0x89d7Cd457eeF2cd28Aa07183a63B63828333207c';
      const ethPerInrRate = 0.000004;
      const ethAmount = amount * ethPerInrRate;
      const weiAmount = ethers.parseEther(ethAmount.toFixed(6));

      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: weiAmount,
      });

      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      const apiClient = createApiClient(token);
      const response = await apiClient.post(ENDPOINTS.PURCHASE, {
        productId,
        amount,
        txHash: tx.hash,
        paymentMethod: 'crypto'
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Purchase failed');
      }

      toast({
        title: 'Purchase Successful',
        description: `Payment of ₹${amount} processed!`,
      });

      onSuccess();
    } catch (error: any) {
      console.error('Purchase error:', {
        error: error.message,
        response: error.response?.data
      });
      
      toast({
        title: 'Purchase Failed',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleCryptoPayment}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing Purchase...
          </span>
        ) : (
          isConnected ? `Pay ₹${amount} with MetaMask` : 'Connect Wallet'
        )}
      </Button>
    </div>
  );
};

export default TestPaymentForm;
