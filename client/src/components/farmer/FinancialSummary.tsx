import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { IndianRupee, TrendingUp } from 'lucide-react';

const FinancialSummary = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-gray-800">Financial Summary</CardTitle>
        <CardDescription>Your active loans and subsidies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Active Loan</div>
            <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full ring-1 ring-amber-600/20">
              8.5% Interest
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-6 w-6 text-gray-700" />
            <div className="text-3xl font-bold text-gray-900">80,000</div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹48,000 paid</span>
            <span>₹32,000 remaining</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">Monthly Growth</div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5%
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          View All Financial Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;