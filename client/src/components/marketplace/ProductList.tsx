import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/use-toast';
import { createApiClient, ENDPOINTS, handleApiError } from '../../config/api';
// ⬆️ Added handleApiError to imports

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  farmerId: {
    name: string;
    email: string;
  } | string; // Add string type since farmerId can be just the ID
}

const ProductList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Update fetchProducts to use token if available
  const fetchProducts = async () => {
    try {
      const apiClient = createApiClient(user?.token);
      const response = await apiClient.get(ENDPOINTS.GET_PRODUCTS);
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (productId: string) => {
    if (!user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to edit products",
        variant: "destructive"
      });
      return;
    }

    // Check if user owns the product
    const product = products.find(p => p._id === productId);
    const farmerId = typeof product?.farmerId === 'object' 
      ? product.farmerId._id 
      : product?.farmerId;

    if (farmerId !== user.id) {
      toast({
        title: "Error",
        description: "You can only edit your own products",
        variant: "destructive"
      });
      return;
    }

    navigate(`/products/edit/${productId}`);
  };

  const handleDelete = async (productId: string) => {
    try {
      if (!user?.token) {
        toast({
          title: "Error",
          description: "You must be logged in to delete products",
          variant: "destructive"
        });
        return;
      }

      // Check if user owns the product
      const product = products.find(p => p._id === productId);
      const farmerId = typeof product?.farmerId === 'object' 
        ? product.farmerId._id 
        : product?.farmerId;

      if (farmerId !== user.id) {
        toast({
          title: "Error",
          description: "You can only delete your own products",
          variant: "destructive"
        });
        return;
      }

      const apiClient = createApiClient(user.token);
      await apiClient.delete(ENDPOINTS.DELETE_PRODUCT(productId));
      
      // Update local state after successful delete
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error('Error deleting product:', error);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show empty state
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          currentUserId={user?.id || ''}
        />
      ))}
    </div>
  );
};

export default ProductList;