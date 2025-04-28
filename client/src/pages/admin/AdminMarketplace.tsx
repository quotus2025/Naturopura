import AdminLayout from '../../components/layouts/AdminLayout';
import AdminProductList from '../../components/admin/AdminProductList';

const AdminMarketplace = () => {
  return (
    <AdminLayout 
      title="Marketplace" 
      subtitle="Manage product listings"
    >
      <div className="space-y-4">
        <AdminProductList />
      </div>
    </AdminLayout>
  );
};

export default AdminMarketplace;