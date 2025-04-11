import DashboardLayout from '@/components/layout/DashboardLayout';
import LoanApplication from '@/components/loan/LoanApplication';

export default function LoansPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <LoanApplication />
      </div>
    </DashboardLayout>
  );
}