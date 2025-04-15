'use client';

import { FC } from 'react';
import MarketplaceLayout from '@/components/layout/MarketplaceLayout';
import OrdersList from '@/components/marketplace/OrdersList';

const OrdersPage: FC = () => {
  return (
    <MarketplaceLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <OrdersList />
      </div>
    </MarketplaceLayout>
  );
};

export default OrdersPage;