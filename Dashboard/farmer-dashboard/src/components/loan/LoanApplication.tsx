'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  IndianRupee, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Upload,
  Info,
  ChevronDown
} from 'lucide-react';

const LoanApplication = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    tenure: '12',
    documents: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('amount', formData.amount);
      data.append('purpose', formData.purpose);
      data.append('tenure', formData.tenure);
      if (formData.documents) {
        data.append('documents', formData.documents);
      }

      const response = await fetch('/api/farmer/loans', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to submit loan application');
      }

      setSuccess(true);
      setFormData({
        amount: '',
        purpose: '',
        tenure: '12',
        documents: null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Loan Application</h2>
        <p className="text-blue-100">Fill out the form below to apply for agricultural financing</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        {/* Loan Information Card */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Important Information</h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Loans range from ₹10,000 to ₹10,00,000</li>
                <li>• Competitive interest rates starting at 8% p.a.</li>
                <li>• Quick processing within 48-72 hours</li>
                <li>• Flexible repayment options</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Loan Amount (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                required
                min="10000"
                max="1000000"
                placeholder="Enter loan amount (₹10,000 - ₹10,00,000)"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum: ₹10,000 | Maximum: ₹10,00,000</p>
          </div>

          {/* Purpose Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Purpose of Loan
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                required
                rows={3}
                placeholder="E.g., Purchase of agricultural equipment, Crop cultivation, Farm expansion..."
              />
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Loan Tenure
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                value={formData.tenure}
                onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                required
              >
                <option value="" disabled>Select loan duration</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Supporting Documents
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 
              ${formData.documents 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
            >
              <input
                type="file"
                onChange={(e) => setFormData(prev => ({ ...prev, documents: e.target.files?.[0] || null }))}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {formData.documents ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-green-700">{formData.documents.name}</p>
                    <p className="text-xs text-green-600 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID Proof, Income Statement, or Land Documents (PDF, JPG, PNG up to 5MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle className="h-5 w-5" />
              <p>Loan application submitted successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanApplication;