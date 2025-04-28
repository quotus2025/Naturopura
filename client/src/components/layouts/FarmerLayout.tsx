import { ReactNode } from 'react';
import FarmerHeader from '../farmer/FarmerHeader';
import FarmerSidebar from '../farmer/FarmerSidebar';

interface FarmerLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const FarmerLayout = ({ children, title, subtitle }: FarmerLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <FarmerSidebar />
      <FarmerHeader title={title} subtitle={subtitle} />
      <main 
        className="transition-all duration-300 p-6"
        style={{ marginLeft: "var(--sidebar-width, 16rem)" }}
      >
        {children}
      </main>
    </div>
  );
};

export default FarmerLayout;