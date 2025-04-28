import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { motion } from 'framer-motion';
import FarmerLayout from '../layouts/FarmerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import TestPaymentForm from '../payment/TestPaymentForm';
import { IndianRupee, CreditCard, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const FarmerPayments = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePaymentSuccess = () => {
    setShowConfetti(true);
    
    // Show success animation
    setTimeout(() => {
      setShowConfetti(false);
      setSelectedAmount(1000); // Reset amount
    }, 3000);
  };

  return (
    <FarmerLayout
      title="Digital Payments"
      subtitle="Make and manage your payments"
    >
      {showConfetti && <ReactConfetti 
        width={window.innerWidth}
        height={window.innerHeight}
        colors={["#4ade80", "#22c55e", "#16a34a"]}
        recycle={false}
        numberOfPieces={200}
      />}
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Make Payment
            </CardTitle>
            <CardDescription>
              Select amount and complete payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quick" className="space-y-4">
              <TabsList>
                <TabsTrigger value="quick">Quick Amount</TabsTrigger>
                <TabsTrigger value="custom">Custom Amount</TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {[1000, 2000, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        selectedAmount === amount
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg font-medium">₹{amount}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">₹</span>
                  <input
                    type="number"
                    value={selectedAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 100) { // Minimum amount check
                        setSelectedAmount(value);
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    min="100"
                    step="100"
                    placeholder="Enter amount (min ₹100)"
                  />
                </div>
              </TabsContent>

              <TestPaymentForm 
                amount={selectedAmount}  // Changed from amount to selectedAmount
                productId="test-payment-product"
                onSuccess={handlePaymentSuccess}
              />
            </Tabs>
          </CardContent>
        </Card>

        {/* Payment History Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              Recent Payments
            </CardTitle>
            <CardDescription>
              Your recent payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { amount: 5000, status: 'success', date: '2024-04-20' },
                { amount: 2000, status: 'success', date: '2024-04-15' },
                { amount: 1000, status: 'failed', date: '2024-04-10' }
              ].map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${
                      payment.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <IndianRupee className={`h-4 w-4 ${
                        payment.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">₹{payment.amount}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm capitalize ${
                    payment.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showConfetti && (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <div className="bg-emerald-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-emerald-700 font-medium text-lg">
        Payment Successful!
      </h3>
      <p className="text-emerald-600">
        ₹{selectedAmount} paid successfully
      </p>
    </div>
  </motion.div>
)}

    </FarmerLayout>
  );
};

export default FarmerPayments;