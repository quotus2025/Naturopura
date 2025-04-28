import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketPrices = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-gray-800">Market Prices</CardTitle>
        <CardDescription>Current market prices for your crops</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-medium bg-gray-50/50 p-4">
            <div>Crop</div>
            <div>Current Price</div>
            <div>Trend</div>
          </div>
          <div className="divide-y">
            {[
              { crop: "Wheat", price: "₹2,200/q", trend: "+5.2%", up: true },
              { crop: "Rice", price: "₹3,400/q", trend: "+2.1%", up: true },
              { crop: "Corn", price: "₹1,850/q", trend: "-1.3%", up: false },
              { crop: "Soybeans", price: "₹4,100/q", trend: "+3.7%", up: true },
            ].map((item, i) => (
              <div key={i} className="grid grid-cols-3 p-4 text-sm hover:bg-gray-50 transition-colors">
                <div className="font-medium">{item.crop}</div>
                <div>{item.price}</div>
                <div className={`flex items-center gap-1 ${item.up ? "text-green-600" : "text-red-600"}`}>
                  {item.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPrices;