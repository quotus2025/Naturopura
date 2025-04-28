import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, ShoppingCart, AlertCircle, FileBarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickAccess = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-gray-800">Quick Access</CardTitle>
        <CardDescription>Frequently used services</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 pt-6">
        <Link to="/farmer/loans">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 w-full items-center justify-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
          >
            <CreditCard className="h-6 w-6" />
            <span className="text-sm">Apply for Loan</span>
          </Button>
        </Link>
        <Link to="/farmer/buy-sell">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 w-full items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-sm">Marketplace</span>
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
        >
          <AlertCircle className="h-6 w-6" />
          <span className="text-sm">Report Issue</span>
        </Button>
        <Link to="/farmer/farm-analytics">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 w-full items-center justify-center gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
          >
            <FileBarChart className="h-6 w-6" />
            <span className="text-sm">Farm Analytics</span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;