import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppSwitcher } from './components/AppSwitcher';
import { ToastContainer } from './components/ToastContainer';
import { initializeMockDatabase } from './services/api';

// Customer Layout & Pages
import { CustomerLayout } from './customer/CustomerLayout';
import { Home } from './customer/pages/Home';
import { Menu } from './customer/pages/Menu';
import { Plans } from './customer/pages/Plans';
import { OrderNow } from './customer/pages/OrderNow';
import { Profile } from './customer/pages/Profile';
import { MySubscription } from './customer/pages/MySubscription';
import { MyOrders } from './customer/pages/MyOrders';
import { PaymentHistory } from './customer/pages/PaymentHistory';
import { PauseDelivery } from './customer/pages/PauseDelivery';
import { Feedback } from './customer/pages/Feedback';
import { Login } from './customer/pages/Login';
import { Register } from './customer/pages/Register';
import { OTPVerification } from './customer/pages/OTPVerification';

// Vendor Layout & Pages (NEW ROLE)
import { VendorLayout } from './vendor/VendorLayout';
import { VendorKitchenHub } from './vendor/pages/VendorKitchenHub';
import { VendorEarnings } from './vendor/pages/VendorEarnings';

// Super Admin Layout & Pages
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/pages/Dashboard';
import { VendorManagement } from './admin/pages/VendorManagement';
import { CustomerManagement } from './admin/pages/CustomerManagement';
import { OrderManagement } from './admin/pages/OrderManagement';
import { SubscriptionManagement } from './admin/pages/SubscriptionManagement';
import { MenuManagement } from './admin/pages/MenuManagement';
import { DeliveryManagement } from './admin/pages/DeliveryManagement';
import { PaymentManagement } from './admin/pages/PaymentManagement';
import { ExpenseManagement } from './admin/pages/ExpenseManagement';
import { InventoryManagement } from './admin/pages/InventoryManagement';
import { Reports } from './admin/pages/Reports';
import { Settings } from './admin/pages/Settings';
import { KitchenLiveHub } from './admin/pages/KitchenLiveHub';

export default function App() {
  useEffect(() => {
    initializeMockDatabase();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 font-sans antialiased">
        {/* Global App Switcher Header (Customer vs Vendor vs Super Admin) */}
        <AppSwitcher />
        
        {/* Interactive Toast Notifications */}
        <ToastContainer />

        <div className="flex-1">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp-verify" element={<OTPVerification />} />

            {/* 1. Customer Web App Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/order" element={<OrderNow />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-subscription" element={<MySubscription />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/payment-history" element={<PaymentHistory />} />
              <Route path="/pause-delivery" element={<PauseDelivery />} />
              <Route path="/feedback" element={<Feedback />} />
            </Route>

            {/* 2. Vendor / Kitchen Partner App Routes (DEDICATED VENDOR PORTAL) */}
            <Route path="/vendor" element={<VendorLayout />}>
              <Route index element={<Navigate to="/vendor/kitchen-hub" replace />} />
              <Route path="kitchen-hub" element={<VendorKitchenHub />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="earnings" element={<VendorEarnings />} />
            </Route>

            {/* 3. Super Admin CRM Portal Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="kitchen-hub" element={<KitchenLiveHub />} />
              <Route path="vendors" element={<VendorManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="subscriptions" element={<SubscriptionManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="deliveries" element={<DeliveryManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="expenses" element={<ExpenseManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
