import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { createApiClient, ENDPOINTS } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

interface PricePrediction {
  title: string;
  price: string;
  source: string;
}

const AddProductDialog = ({ open, onClose }: AddProductDialogProps) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    unit: '',
    images: [] as File[]
  });
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add products',
          variant: 'destructive'
        });
        return;
      }

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          if (value.length === 0) {
            throw new Error('At least one image is required');
          }
          value.forEach((file: File) => {
            form.append('images', file);
          });
        } else {
          if (!value) {
            throw new Error(`${key} is required`);
          }
          form.append(key, value.toString());
        }
      });

      const apiClient = createApiClient(token);
      const response = await apiClient.post(ENDPOINTS.CREATE_PRODUCT, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      toast({
        title: 'Success',
        description: 'Product added successfully'
      });
      onClose();

    } catch (error: any) {
      console.error('Add product error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPricePredictions = useCallback(async (productName: string) => {
    if (!productName) return;
    
    setIsPredicting(true);
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.get(ENDPOINTS.PREDICT_PRICE, {
        params: {
          q: `${productName} ${formData.unit}`,
          category: formData.category
        }
      });

      setPredictions(response.data.predictions);

      // Set average price as suggestion
      if (response.data.predictions.length > 0) {
        const prices = response.data.predictions.map((p: PricePrediction) => 
          parseFloat(p.price.replace(/[^0-9.]/g, ''))
        );
        const avgPrice = (prices.reduce((a: number, b: number) => a + b, 0) / prices.length).toFixed(2);
        
        setFormData(prev => ({
          ...prev,
          price: avgPrice
        }));

        toast({
          title: 'Price Suggestion',
          description: `Average market price: ₹${avgPrice}`,
        });
      }
    } catch (error) {
      console.error('Price prediction error:', error);
      toast({
        title: 'Price Prediction Failed',
        description: 'Could not fetch price suggestions',
        variant: 'destructive'
      });
    } finally {
      setIsPredicting(false);
    }
  }, [token, formData.unit, formData.category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.name.length >= 3) {
        getPricePredictions(formData.name);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.name, getPricePredictions]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              {isPredicting && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Getting price suggestions...
                </div>
              )}
            </div>
            <Input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <Select
            value={formData.unit}
            onValueChange={(value) => setFormData({ ...formData, unit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">Kilograms</SelectItem>
              <SelectItem value="g">Grams</SelectItem>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="dozen">Dozen</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData({ ...formData, images: files });
            }}
          />
          {predictions.length > 0 && (
            <div className="mt-4 space-y-2 bg-white border rounded-lg shadow-sm">
              <div className="p-3 border-b bg-gray-50">
                <p className="text-sm font-medium flex items-center justify-between">
                  <span>Market Prices</span>
                  <span className="text-xs text-gray-500">
                    ({predictions.length} results)
                  </span>
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y">
                {predictions.map((pred, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        price: pred.price.replace(/[^0-9.]/g, '')
                      }));
                      toast({
                        description: `Price set to ${pred.price}`
                      });
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <span className="text-sm truncate mr-4" title={pred.title}>
                      {pred.title}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap text-green-600">
                      {pred.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
