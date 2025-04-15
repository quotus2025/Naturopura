export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  unit: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}