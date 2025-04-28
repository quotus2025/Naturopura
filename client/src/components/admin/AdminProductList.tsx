import { useEffect, useState } from 'react';
import axios from '../../lib/axios';
import { Loader2, ImageOff } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import ProductDetailsDialog from './ProductDetailsDialog';

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
  };
}

const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">{error}</div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listed Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Farmer</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Stock</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
                        onClick={() => setSelectedProduct(product)}
                      >
                        {product.images?.[0] ? (
                          <img 
                            src={`http://localhost:5000${product.images[0]}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageOff className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="font-medium">{product.farmerId.name}</div>
                    <div className="text-gray-500 text-xs">{product.farmerId.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">₹{product.price}</div>
                    <div className="text-xs text-gray-500">per {product.unit}</div>
                  </td>
                  <td className="py-3 px-4 text-sm capitalize">{product.category}</td>
                  <td className="py-3 px-4 text-sm">{product.quantity} {product.unit}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <ProductDetailsDialog 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Card>
  );
};

export default AdminProductList;