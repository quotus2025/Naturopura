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
  
      setLoading(true);
  
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
  
      await tx.wait();
  
      toast({
        title: 'Payment Successful',
        description: `Payment of ₹${amount} processed!`,
      });
  
      if (!token) {
        throw new Error('Unauthorized: No token found. Please login again.');
      }
  
      const apiClient = createApiClient(token);
  
      await apiClient.post(
        ENDPOINTS.TEST_PAYMENT,
        {
          amount,
          productId, // Now productId will be defined
          txnHash: tx.hash,
        }
      );
  
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: handleApiError(error),
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
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          isConnected ? `Pay ₹${amount} with MetaMask` : 'Connect Wallet'
        )}
      </Button>
    </div>
  );
};

export default TestPaymentForm;
