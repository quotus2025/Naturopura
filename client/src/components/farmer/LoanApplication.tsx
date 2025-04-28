import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import FarmerLayout from '../layouts/FarmerLayout';

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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    purpose: '',
    term: '',
    collateral: '',
    cropType: '',
    landSize: '',
    farmDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Loan amount is required';
      isValid = false;
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
        isValid = false;
      }
    }

    // Purpose validation
    if (!formData.purpose) {
      newErrors.purpose = 'Please select a loan purpose';
      isValid = false;
    } else if (!LOAN_PURPOSES.some(p => p.value === formData.purpose)) {
      newErrors.purpose = 'Invalid purpose value';
      isValid = false;
    }

    // Term validation
    if (!formData.term) {
      newErrors.term = 'Please select a loan term';
      isValid = false;
    } else if (!LOAN_TERMS.some(t => t.value === formData.term)) {
      newErrors.term = 'Invalid term value';
      isValid = false;
    }

    // Collateral validation
    if (!formData.collateral.trim()) {
      newErrors.collateral = 'Collateral information is required';
      isValid = false;
    }

    // Crop Type validation
    if (!formData.cropType) {
      newErrors.cropType = 'Please select a crop type';
      isValid = false;
    } else if (!CROP_TYPES.some(c => c.value === formData.cropType)) {
      newErrors.cropType = 'Invalid crop type';
      isValid = false;
    }

    // Land Size validation (optional but must be valid if provided)
    if (formData.landSize) {
      const landSize = parseFloat(formData.landSize);
      if (isNaN(landSize) || landSize < 0) {
        newErrors.landSize = 'Land size must be a positive number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const apiClient = createApiClient(token);
      
      const loanData = {
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        term: formData.term,
        collateral: formData.collateral.trim(),
        cropType: formData.cropType,
        landSize: formData.landSize ? parseFloat(formData.landSize) : null,
        farmDetails: formData.farmDetails.trim() || null
      };

      await apiClient.post(ENDPOINTS.CREATE_LOAN, loanData);
      setIsSuccess(true);
      setTimeout(() => navigate('/farmer/loans/history'), 2000);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setErrors({ submit: errorMessage });

      // If token is invalid, redirect to login
      if (err.response?.status === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
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