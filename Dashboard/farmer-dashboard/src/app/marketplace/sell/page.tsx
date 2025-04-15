'use client';

import { FC } from 'react';
import MarketplaceLayout from '@/components/layout/MarketplaceLayout';
import ProductForm from '@/components/marketplace/ProductForm';

const SellProductsPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">List Your Product</h1>
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default SellProductsPage;