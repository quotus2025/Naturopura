import DashboardLayout from '@/components/layout/DashboardLayout';
import CropHealthDetection from '@/components/layout/CropHealthDetection';

export default function CropHealthPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <CropHealthDetection />
      </div>
    </DashboardLayout>
  );
}