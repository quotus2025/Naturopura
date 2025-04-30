import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { Web3Provider } from "./context/Web3Context"; // Add this import
import "./index.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import FarmerDashboard from "./components/Dashboard/FarmerDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import AdminProfile from "./components/admin/AdminProfile";
import FarmerProfile from "./components/farmer/FarmerProfile";
import LoanApplication from "./components/farmer/LoanApplication";
import LoanHistory from "./components/farmer/LoanHistory";
import PrivateRoute from "./components/auth/PrivateRoute";
import { Toaster } from "./components/ui/toaster";
import CropHealthDetection from "./components/farmer/CropHealthDetection";
import Home from "./pages/Home";
import MarketplacePage from './pages/MarketPlace';
import AdminMarketplace from './pages/admin/AdminMarketplace';
import AdminLoans from './pages/admin/AdminLoans';
import EkycForm from './components/ekyc/EkycForm';
import EkycStatusCard from './components/farmer/EkycStatusCard';
import FarmerPayments from './components/farmer/FarmerPayments';
import FarmerList from './components/admin/FarmerList';

// Placeholder components for new routes
const FinancialServices = () => <div>Financial Services</div>;
const Insurance = () => <div>Insurance</div>;
const Subsidies = () => <div>Subsidies</div>;
const DigitalPayments = () => <div>Digital Payments</div>;

const OrderManagement = () => <div>Order Management</div>;
const PricingInfo = () => <div>Pricing Info</div>;
const Logistics = () => <div>Logistics</div>;
const WeatherUpdates = () => <div>Weather Updates</div>;
const SoilHealth = () => <div>Soil Health</div>;
const PestAlerts = () => <div>Pest Alerts</div>;
const AIInsights = () => <div>AI Insights</div>;
const IoTSensors = () => <div>IoT Sensors</div>;
const SmartFence = () => <div>Smart Fence</div>;
const AnimalAlerts = () => <div>Animal Alerts</div>;
const Support = () => <div>Support</div>;
const Profile = () => <div>Profile</div>;

function App() {
  const { user } = useAuth();

  const ProtectedHome = () => {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/farmer/dashboard"}
        replace
      />
    );
  };

  return (
    <>
      <AuthProvider>
        <Web3Provider> {/* Add Web3Provider here */}
          <Router>
            <SidebarProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<ProtectedHome/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/marketplace"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminMarketplace />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/loans"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminLoans />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/farmers"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <FarmerList />
                    </PrivateRoute>
                  }
                />

                {/* Farmer Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <FarmerDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/profile"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <FarmerProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/loans/apply"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <LoanApplication />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/loans/history"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <LoanHistory />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/financial-services"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <FinancialServices />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/insurance"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <Insurance />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/subsidies"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <Subsidies />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/payments"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <FarmerPayments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/marketplace/orders"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <MarketplacePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/orders"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <OrderManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/pricing"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <PricingInfo />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/logistics"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <Logistics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/weather"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <WeatherUpdates />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/soil"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <SoilHealth />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/pests"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <PestAlerts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/ai-insights"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <AIInsights />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/iot"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <IoTSensors />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/smart-fence"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <SmartFence />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/animal-alerts"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <AnimalAlerts />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/support"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <Support />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/profile"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/monitoring/pests"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <CropHealthDetection />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/ekyc"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <EkycForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/farmer/ekyc/status"
                  element={
                    <PrivateRoute allowedRoles={["farmer"]}>
                      <EkycStatusCard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </SidebarProvider>
          </Router>
        </Web3Provider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
