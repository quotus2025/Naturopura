'use client';

import { FC } from 'react';
import MarketplaceLayout from '@/components/layout/MarketplaceLayout';
import ProductGrid from '@/components/marketplace/ProductGrid';

const BuyProductsPage: FC = () => {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Buy Products</h1>
        <ProductGrid />
      </div>
    </MarketplaceLayout>
  );
};

export default BuyProductsPage;