import { useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import AdminLoanList from '../../components/admin/AdminLoanList';

const AdminLoans = () => {
  return (
    <AdminLayout 
      title="Loan Management" 
      subtitle="View and manage loan applications"
    >
      <div className="space-y-4">
        <AdminLoanList />
      </div>
    </AdminLayout>
  );
};

export default AdminLoans;