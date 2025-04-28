import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Plus, Filter } from 'lucide-react';
import ProductList from '../components/marketplace/ProductList';
import AddProductDialog from '../components/marketplace/AddProductDialog';
import FarmerLayout from '../components/layouts/FarmerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const MarketplacePage = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <FarmerLayout 
      title="Marketplace" 
      subtitle="Manage and sell your products"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Products</CardTitle>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              Filter
            </Button>
            <Button 
              onClick={() => setShowAddProduct(true)} 
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProductList />
        </CardContent>
      </Card>
      
      {showAddProduct && (
        <AddProductDialog 
          open={showAddProduct} 
          onClose={() => setShowAddProduct(false)} 
        />
      )}
    </FarmerLayout>
  );
};

export default MarketplacePage;