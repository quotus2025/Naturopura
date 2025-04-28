import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { ImageOff } from "lucide-react";
import { format } from "date-fns";

interface ProductDetailsProps {
  product: {
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
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsDialog = ({ product, isOpen, onClose }: ProductDetailsProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={`http://localhost:5000${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images?.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">₹{product.price} per {product.unit}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Stock</span>
                <span className="font-medium">{product.quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Category</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {product.status}
                </span>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Farmer Details</h4>
                <div className="text-sm space-y-1">
                  <p className="text-gray-900">{product.farmerId.name}</p>
                  <p className="text-gray-600">{product.farmerId.email}</p>
                </div>
              </CardContent>
            </Card>

            <div className="text-xs text-gray-500">
              <p>Listed on: {format(new Date(product.createdAt), 'PPP')}</p>
              <p>Last updated: {format(new Date(product.updatedAt), 'PPP')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;