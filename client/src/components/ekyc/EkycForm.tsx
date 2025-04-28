import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Upload, Check, AlertCircle } from 'lucide-react';
import { toast } from "../ui/use-toast";
import FarmerLayout from "../layouts/FarmerLayout";
import { useAuth } from "../../context/AuthContext";
import { createApiClient, ENDPOINTS } from "../../config/api";

const EkycForm = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState({
    aadhar: null as File | null,
    pan: null as File | null,
    selfie: null as File | null
  });

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: keyof typeof documents) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      setDocuments(prev => ({ ...prev, [type]: file }));
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = async () => {
    try {
      if (!documents.aadhar || !documents.pan || !documents.selfie) {
        throw new Error('All documents are required');
      }

      const formData = new FormData();
      formData.append('aadhar', documents.aadhar);
      formData.append('pan', documents.pan);
      formData.append('selfie', documents.selfie);

      const apiClient = createApiClient(token);
      
      const response = await apiClient.post(ENDPOINTS.VERIFY_EKYC, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "eKYC verification completed successfully",
        });
        navigate('/farmer/ekyc/status');
      } else {
        throw new Error(response.data.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete verification",
        variant: "destructive",
      });
    }
  };

  return (
    <FarmerLayout title="eKYC Verification" subtitle="Complete your identity verification">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your eKYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="aadhar">Upload Aadhar Card</Label>
                <div className="mt-2">
                  <Input
                    id="aadhar"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'aadhar')}
                    disabled={isUploading}
                  />
                </div>
                {documents.aadhar && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <Check className="h-4 w-4" />
                    <span>Aadhar uploaded successfully</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="pan">Upload PAN Card</Label>
                <div className="mt-2">
                  <Input
                    id="pan"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'pan')}
                    disabled={isUploading}
                  />
                </div>
                {documents.pan && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <Check className="h-4 w-4" />
                    <span>PAN uploaded successfully</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!documents.aadhar || !documents.pan}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Take a Selfie</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileUpload(e, 'selfie')}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!documents.selfie}
                  className="w-full"
                >
                  Complete Verification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </FarmerLayout>
  );
};

export default EkycForm;