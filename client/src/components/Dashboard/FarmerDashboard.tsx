
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import FarmerLayout from '../layouts/FarmerLayout';
import { IndianRupee, Calendar, Activity, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const FarmerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Loans',
      value: '3',
      icon: CreditCard,
      description: 'All time loans',
      color: 'from-blue-600 to-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      title: 'Active Loans',
      value: '1',
      icon: Activity,
      description: 'Currently active',
      color: 'from-emerald-600 to-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      title: 'Total Amount',
      value: '₹75,000',
      icon: IndianRupee,
      description: 'Total borrowed',
      color: 'from-purple-600 to-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    {
      title: 'Next Payment',
      value: '₹5,000',
      icon: Calendar,
      description: 'Due in 7 days',
      color: 'from-amber-600 to-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-700 dark:text-amber-300'
    }
  ];

  return (
    <FarmerLayout 
      title="Dashboard" 
      subtitle={`Welcome back, ${user?.name || 'Farmer'}`}
    >
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800/30 mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
            Farmer Dashboard
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Track all your agricultural financing in one place
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <p className="text-green-700 dark:text-green-300 max-w-md">
            You have <span className="font-bold">1 active loan</span> and your next payment is due in 7 days.
          </p>
          <Button variant="outline" className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30">
            View Payment Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <HoverCard key={stat.title} openDelay={200}>
            <HoverCardTrigger asChild>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 animate-fade-in" 
                style={{ borderTopColor: `rgb(var(--${stat.color.split('-')[1]}-500))` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={cn("text-sm font-medium", stat.textColor)}>
                    {stat.title}
                  </CardTitle>
                  <div className={cn("rounded-full p-2", stat.iconBg)}>
                    <stat.icon className={cn("h-4 w-4", stat.textColor)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(to right, rgb(var(--${stat.color.split('-')[1]}-600)), rgb(var(--${stat.color.split('-')[1]}-400)))` }}>
                    {stat.value}
                  </div>
                  <div className="flex items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div>
                  <h4 className="text-sm font-semibold">{stat.title} Details</h4>
                  <p className="text-sm text-muted-foreground">
                    View detailed information about your {stat.title.toLowerCase()}.
                  </p>
                </div>
                <stat.icon className={cn("h-5 w-5", stat.textColor)} />
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800/30">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardTitle className="text-lg bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-4">
            <Link
              to="/farmer/loans/apply"
              className="flex items-center gap-3 rounded-lg border border-green-100 dark:border-green-800/30 p-3.5 
                        hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700
                        transition-all group"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">Apply for Loan</div>
                <div className="text-sm text-green-600/80 dark:text-green-400/80">Submit a new loan application</div>
              </div>
              <ArrowRight className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/farmer/loans/history"
              className="flex items-center gap-3 rounded-lg border border-green-100 dark:border-green-800/30 p-3.5 
                        hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700
                        transition-all group"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-800 dark:text-green-300 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">View Loan History</div>
                <div className="text-sm text-green-600/80 dark:text-green-400/80">Check your loan applications</div>
              </div>
              <ArrowRight className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="md:col-span-2 hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800/30">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardTitle className="text-lg bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">Recent Activity</CardTitle>
            <CardDescription>Your latest loan activities</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-green-100 dark:border-green-800/30 p-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2.5">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800 dark:text-green-300">Loan Application Approved</div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">Your loan application for ₹25,000 was approved</div>
                </div>
                <div className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">2 days ago</div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-green-100 dark:border-green-800/30 p-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2.5">
                  <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800 dark:text-green-300">Payment Made</div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">You made a payment of ₹5,000</div>
                </div>
                <div className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">5 days ago</div>
              </div>
              
              <div className="flex items-center gap-4 rounded-lg border border-dashed border-green-200 dark:border-green-700/30 p-4 bg-green-50/50 dark:bg-green-900/10">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2.5">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800 dark:text-green-300">Upcoming Payment</div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">Your next payment of ₹5,000 is due on May 7, 2025</div>
                </div>
                <Button size="sm" variant="outline" className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/30">
                  Pay Now
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1">
                View All Activities
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </FarmerLayout>
  );
};

export default FarmerDashboard;