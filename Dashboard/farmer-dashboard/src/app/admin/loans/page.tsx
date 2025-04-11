'use client';

import AdminLayout from '@/components/layout/AdminLayout';
import LoanManagement from '@/components/admin/LoanManagement';

export default function AdminLoansPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <LoanManagement />
      </div>
    </AdminLayout>
  );
}