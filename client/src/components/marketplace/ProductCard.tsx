import { 
  useEffect, 
  useState 
} from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageOff, ShoppingCart, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useToast } from '../ui/use-toast';

interface ProductProps {
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
      _id: string;
      name: string;
      email: string;
    } | string;
  };
  onUpdate: (productId: string) => void;
  onDelete: (productId: string) => Promise<void>;
  currentUserId: string;
}

const ProductCard = ({ product, onUpdate, onDelete, currentUserId }: ProductProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      // Debug log the image path
      console.log('Raw image path:', product.images[0]);
      
      // Handle both absolute and relative paths
      const imageUrl = product.images[0].startsWith('http') 
        ? product.images[0]
        : `http://localhost:5000${product.images[0]}`;
      
      console.log('Constructed image URL:', imageUrl);
      setImageSrc(imageUrl);
    }
  }, [product.images]);

  const isProductOwner = typeof product.farmerId === 'object' 
    ? product.farmerId._id === currentUserId
    : product.farmerId === currentUserId;

  const handleDelete = async () => {
    try {
      setShowDeleteAlert(false); // Close the dialog first
      await onDelete(product._id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = () => {
    onUpdate(product._id);
  };

  return (
    <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        {!imageError && imageSrc ? (
          <img 
            src={imageSrc}
            alt={product.name}
            className={`object-cover w-full h-full transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={(e) => {
              console.error('Image load error:', {
                src: imageSrc,
                product: product._id,
                timestamp: new Date().toISOString()
              });
              setImageError(true);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', {
                src: imageSrc,
                product: product._id
              });
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <ImageOff className="h-12 w-12 text-gray-400 animate-pulse" />
            <span className="text-sm text-gray-500 mt-2">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className="bg-green-500/90 hover:bg-green-600 transition-colors">
            {product.category}
          </Badge>
          {product.status === 'available' && (
            <Badge variant="secondary" className="bg-blue-500/90 text-white">
              In Stock
            </Badge>
          )}
          {isProductOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleUpdate}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1 group-hover:text-primary">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}
            </span>
            <span className="text-sm text-gray-500 block">
              per {product.unit}
            </span>
          </div>
          <Button 
            size="sm" 
            className="bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        {product.quantity <= 5 && product.quantity > 0 && (
          <div className="text-sm text-orange-500 mt-2">
            Only {product.quantity} left in stock!
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ProductCard;