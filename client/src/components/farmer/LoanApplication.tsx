import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import FarmerLayout from '../layouts/FarmerLayout';
import { useToast } from '../ui/use-toast';

interface FormData {
  amount: string;
  purpose: string;
  term: string;
  collateral: string;
  cropType: string;
  landSize: string;
  farmDetails: string;
}

interface FormErrors extends Partial<Record<keyof FormData, string>> {
  submit?: string;
}

const LOAN_PURPOSES = [
  { value: 'seeds', label: 'Seeds Purchase' },
  { value: 'equipment', label: 'Equipment Purchase' },
  { value: 'irrigation', label: 'Irrigation System' },
  { value: 'land', label: 'Land Development' },
  { value: 'other', label: 'Other' }
];

const LOAN_TERMS = [
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
  { value: '5years', label: '5 Years' }
];

const CROP_TYPES = [
  { value: 'rice', label: 'Rice' },
  { value: 'wheat', label: 'Wheat' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'sugarcane', label: 'Sugarcane' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'other', label: 'Other' }
];

const LoanApplication = () => {
  const { token, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add state variables
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    purpose: '',
    term: '',
    collateral: '',
    cropType: '',
    landSize: '',
    farmDetails: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Add form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.term) {
      newErrors.term = 'Term is required';
    }

    if (!formData.collateral) {
      newErrors.collateral = 'Collateral is required';
    }

    if (!formData.cropType) {
      newErrors.cropType = 'Crop type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add authentication check on component mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access loan applications",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/farmer/loans/apply' } });
    }
  }, [isAuthenticated, loading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Early return if not authenticated
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a loan application",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/farmer/loans/apply' } });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create API client with token
      const apiClient = createApiClient(token);
      
      // Log for debugging
      console.log('Submitting loan with token:', {
        hasToken: !!token,
        isAuthenticated
      });

      const response = await apiClient.post(ENDPOINTS.CREATE_LOAN, {
        ...formData,
        amount: parseFloat(formData.amount),
        landSize: formData.landSize ? parseFloat(formData.landSize) : undefined
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Loan application submitted successfully",
        });
        setTimeout(() => navigate('/farmer/loans/history'), 2000);
      }
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        navigate('/login', { state: { from: '/farmer/loans/apply' } });
        return;
      }

      setErrors({
        submit: handleApiError(error)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <FarmerLayout title="Loan Application" subtitle="Apply for a new loan">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout title="Loan Application" subtitle="Apply for a new loan">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                  {errors.submit}
                </div>
              )}

              {isSuccess && (
                <div className="bg-green-50 text-green-500 p-4 rounded-md mb-4">
                  Loan application submitted successfully! Redirecting...
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Loan Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={errors.amount ? 'border-red-500' : ''}
                  placeholder="Enter loan amount"
                  min="1"
                  step="0.01"
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => handleInputChange('purpose', value)}
                >
                  <SelectTrigger className={errors.purpose ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select loan purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_PURPOSES.map((purpose) => (
                      <SelectItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.purpose && <p className="text-sm text-red-500">{errors.purpose}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="term">Loan Term</Label>
                <Select
                  value={formData.term}
                  onValueChange={(value) => handleInputChange('term', value)}
                >
                  <SelectTrigger className={errors.term ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TERMS.map((term) => (
                      <SelectItem key={term.value} value={term.value}>
                        {term.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.term && <p className="text-sm text-red-500">{errors.term}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="collateral">Collateral</Label>
                <Input
                  id="collateral"
                  value={formData.collateral}
                  onChange={(e) => handleInputChange('collateral', e.target.value)}
                  className={errors.collateral ? 'border-red-500' : ''}
                  placeholder="Enter collateral details"
                />
                {errors.collateral && <p className="text-sm text-red-500">{errors.collateral}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Select
                  value={formData.cropType}
                  onValueChange={(value) => handleInputChange('cropType', value)}
                >
                  <SelectTrigger className={errors.cropType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_TYPES.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cropType && <p className="text-sm text-red-500">{errors.cropType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size (Acres)</Label>
                <Input
                  id="landSize"
                  type="number"
                  value={formData.landSize}
                  onChange={(e) => handleInputChange('landSize', e.target.value)}
                  className={errors.landSize ? 'border-red-500' : ''}
                  placeholder="Enter land size (optional)"
                  min="0"
                  step="0.01"
                />
                {errors.landSize && <p className="text-sm text-red-500">{errors.landSize}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmDetails">Additional Farm Details</Label>
                <Textarea
                  id="farmDetails"
                  value={formData.farmDetails}
                  onChange={(e) => handleInputChange('farmDetails', e.target.value)}
                  className={errors.farmDetails ? 'border-red-500' : ''}
                  placeholder="Enter additional farm details (optional)"
                />
                {errors.farmDetails && <p className="text-sm text-red-500">{errors.farmDetails}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default LoanApplication;