import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleMobileDeviceFrame, toggleTheme, addToast } from '../store/slices/uiSlice';
import { switchRole } from '../store/slices/authSlice';
import { Smartphone, ShieldCheck, UserCheck, Sun, Moon, ChefHat, Building2, Utensils } from 'lucide-react';

export const AppSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { theme, mobileDeviceFrame } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);

  const isVendorRoute = location.pathname.startsWith('/vendor');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCustomerRoute = !isVendorRoute && !isAdminRoute;

  const handleSwitchToCustomer = () => {
    dispatch(switchRole('customer'));
    navigate('/');
    dispatch(
      addToast({
        type: 'success',
        title: 'Switched to Customer Web App 🍱',
        message: 'Browse meals, customize sabjis, and subscribe to tiffin plans.'
      })
    );
  };

  const handleSwitchToVendor = () => {
    dispatch(switchRole('vendor'));
    navigate('/vendor/kitchen-hub');
    dispatch(
      addToast({
        type: 'info',
        title: 'Switched to Vendor / Kitchen App 👨‍🍳',
        message: 'Packing station, 1 vs 2 sabji live list, and daily paisa collection.'
      })
    );
  };

  const handleSwitchToAdmin = () => {
    dispatch(switchRole('admin'));
    navigate('/admin/dashboard');
    dispatch(
      addToast({
        type: 'info',
        title: 'Switched to Master Super Admin CRM 🛡️',
        message: 'Manage all kitchen vendors, customers, platform revenue & dispatch.'
      })
    );
  };

  return (
    <div className="bg-slate-950 text-white text-xs py-2 px-3 sm:px-4 shadow-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand & Active Mode Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-orange-600 to-amber-500 text-white p-1.5 rounded-lg flex items-center justify-center font-bold shadow-xs">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black tracking-tight text-sm bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              Homly Food Tiffin
            </span>
            <span className="hidden sm:inline-block ml-2 bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-700">
              {isVendorRoute ? 'Vendor Kitchen App' : isAdminRoute ? 'Super Admin Portal' : 'Customer Food App'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* 3-Way Portal Switcher */}
          <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800 gap-1">
            <button
              onClick={handleSwitchToCustomer}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                isCustomerRoute
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              onClick={handleSwitchToVendor}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                isVendorRoute
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Vendor / Kitchen</span>
            </button>

            <button
              onClick={handleSwitchToAdmin}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                isAdminRoute
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>

          {/* Mobile phone frame toggle (for testing PWA view of any role) */}
          <button
            onClick={() => dispatch(toggleMobileDeviceFrame())}
            title="Toggle Mobile Phone View"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
              mobileDeviceFrame
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Phone View {mobileDeviceFrame ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Toggle (for Admin / Vendor) */}
          {(isAdminRoute || isVendorRoute) && (
            <button
              onClick={() => dispatch(toggleTheme())}
              title="Toggle Dark/Light Mode"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
