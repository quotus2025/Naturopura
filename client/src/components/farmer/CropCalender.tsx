import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Leaf, Sprout, CheckCircle2 } from 'lucide-react';

const CropCalendar = () => {
  return (
    <Card className="md:col-span-2 shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <CardTitle className="text-gray-800">Crop Calendar</CardTitle>
        <CardDescription>Your current and upcoming crop schedule</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md overflow-hidden">
          <div className="grid grid-cols-3 text-sm font-medium bg-gray-50/50 p-4">
            <div>Crop</div>
            <div>Status</div>
            <div>Harvest Date</div>
          </div>
          <div className="divide-y">
            {[
              { crop: "Wheat", status: "Growing", harvestDate: "Jun 15, 2025", icon: <Leaf className="h-4 w-4" /> },
              { crop: "Rice", status: "Seedling", harvestDate: "Aug 10, 2025", icon: <Sprout className="h-4 w-4" /> },
              { crop: "Corn", status: "Harvested", harvestDate: "Mar 20, 2025", icon: <CheckCircle2 className="h-4 w-4" /> },
              { crop: "Soybeans", status: "Growing", harvestDate: "Sep 05, 2025", icon: <Leaf className="h-4 w-4" /> },
            ].map((crop, i) => (
              <div key={i} className="grid grid-cols-3 p-4 text-sm hover:bg-gray-50 transition-colors">
                <div className="font-medium flex items-center gap-2">
                  {crop.icon}
                  {crop.crop}
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    crop.status === "Growing" 
                      ? "bg-green-50 text-green-700 ring-1 ring-green-600/20" 
                      : crop.status === "Seedling" 
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20" 
                        : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
                  }`}>
                    {crop.status}
                  </span>
                </div>
                <div className="text-gray-500">{crop.harvestDate}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCalendar;