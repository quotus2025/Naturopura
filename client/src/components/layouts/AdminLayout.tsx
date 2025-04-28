import { ReactNode } from 'react';
import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader title={title} subtitle={subtitle} />
      <main 
        className="transition-all duration-300 p-6"
        style={{ marginLeft: "var(--sidebar-width, 16rem)" }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
