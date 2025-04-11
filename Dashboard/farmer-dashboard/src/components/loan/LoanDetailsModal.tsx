'use client';

import { FC } from 'react';
import { X, Calendar, IndianRupee, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Loan {
  _id: string;
  amount: number;
  purpose: string;
  tenure: number;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  documents?: string[];
}

interface LoanDetailsModalProps {
  loan: Loan | null;
  onClose: () => void;
}

const LoanDetailsModal: FC<LoanDetailsModalProps> = ({ loan, onClose }) => {
  if (!loan) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="h-6 w-6 text-yellow-600" />
        };
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <XCircle className="h-6 w-6 text-red-600" />
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null
        };
    }
  };

  const statusStyle = getStatusColor(loan.status);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 top-[50%] translate-y-[-50%] w-full max-w-2xl mx-auto p-6 z-50">
        <div className="bg-white rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Loan Application Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${statusStyle.bg}`}>
                {statusStyle.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
              </span>
            </div>

            {/* Loan Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Loan Amount</p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                  <p className="text-xl font-semibold text-gray-900">
                    {loan.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Application Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Tenure</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">{loan.tenure} months</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Monthly EMI (Estimated)</p>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-900">
                    {Math.round(loan.amount / loan.tenure).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Purpose Section */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Purpose</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <p className="text-gray-700">{loan.purpose}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Application Timeline</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(loan.applicationDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {loan.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${loan.status === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                      {loan.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Application {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {/* You can add the status update date here if available */}
                        Status updated
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            {loan.documents && loan.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Uploaded Documents</p>
                <div className="grid grid-cols-2 gap-4">
                  {loan.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700 truncate">
                        Document {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanDetailsModal;