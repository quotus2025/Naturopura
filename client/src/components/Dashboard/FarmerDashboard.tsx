import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import FarmerLayout from '../layouts/FarmerLayout';
import { IndianRupee, Calendar, Activity, CreditCard } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Loans',
      value: '3',
      icon: CreditCard,
      description: 'All time loans'
    },
    {
      title: 'Active Loans',
      value: '1',
      icon: Activity,
      description: 'Currently active'
    },
    {
      title: 'Total Amount',
      value: '₹75,000',
      icon: IndianRupee,
      description: 'Total borrowed'
    },
    {
      title: 'Next Payment',
      value: '₹5,000',
      icon: Calendar,
      description: 'Due in 7 days'
    }
  ];

  return (
    <FarmerLayout 
      title="Dashboard" 
      subtitle={`Welcome back, ${user?.name || 'Farmer'}`}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              to="/farmer/loans/apply"
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-gray-50 transition-all"
            >
              <CreditCard className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">Apply for Loan</div>
                <div className="text-sm text-gray-500">Submit a new loan application</div>
              </div>
            </Link>
            <Link
              to="/farmer/loans/history"
              className="flex items-center gap-2 rounded-lg border p-3 hover:bg-gray-50 transition-all"
            >
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">View Loan History</div>
                <div className="text-sm text-gray-500">Check your loan applications</div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest loan activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-green-100 p-2">
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Loan Application Approved</div>
                  <div className="text-sm text-gray-500">Your loan application for ₹25,000 was approved</div>
                </div>
                <div className="text-sm text-gray-500">2 days ago</div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <IndianRupee className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Payment Made</div>
                  <div className="text-sm text-gray-500">You made a payment of ₹5,000</div>
                </div>
                <div className="text-sm text-gray-500">5 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;