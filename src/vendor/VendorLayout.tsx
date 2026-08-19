import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { toggleTheme } from '../store/slices/uiSlice';
import { 
  Utensils, 
  ShoppingBag, 
  IndianRupee, 
  ChefHat, 
  Wallet, 
  Sun, 
  Moon, 
  Menu, 
  Bell,
  Sparkles,
  Phone
} from 'lucide-react';

export const VendorLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, mobileDeviceFrame } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.orders);

  const pendingPackCount = orders.filter((o) => o.status === 'placed' || o.status === 'preparing').length;
  const pendingPaymentCount = orders.filter((o) => o.paymentStatus === 'pending').length;

  const content = (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Vendor App Header */}
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-orange-500/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-sm text-white tracking-tight leading-none truncate max-w-[180px] sm:max-w-xs">
                {currentUser?.kitchenName || 'Sharma Ji Shuddh Desi Rasoi'}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Vendor Kitchen Partner App
            </span>
          </div>
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 bg-slate-800/90 py-1 px-2.5 rounded-xl border border-slate-700/80">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80'}
              alt="Vendor"
              className="w-6 h-6 rounded-lg object-cover border border-orange-500"
            />
            <span className="text-[11px] font-bold text-slate-200 hidden sm:inline">
              {currentUser?.name?.split(' ')[0] || 'Rajesh'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Vendor Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      {/* Vendor Mobile Bottom Navigation Bar */}
      <nav
        className={`${
          mobileDeviceFrame ? 'sticky bottom-0' : 'fixed bottom-0 left-0 right-0'
        } z-50 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 text-slate-300 py-2 px-1 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]`}
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {/* 1. Tiffins & Sabji Packing Station */}
          <NavLink
            to="/vendor/kitchen-hub"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-all py-1 px-2 rounded-xl relative ${
                isActive
                  ? 'text-orange-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-orange-500/25 text-orange-400 ring-1 ring-orange-400/40' : 'bg-slate-900'}`}>
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                  Tiffin Packing
                </span>
                {pendingPackCount > 0 && (
                  <span className="absolute -top-1 right-0 bg-orange-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                    {pendingPackCount}
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* 2. Paisa & Udhar Collections */}
          <NavLink
            to="/vendor/payments"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-all py-1 px-2 rounded-xl relative ${
                isActive
                  ? 'text-emerald-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-emerald-500/25 text-emerald-400 ring-1 ring-emerald-400/40' : 'bg-slate-900'}`}>
                  <IndianRupee className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                  Paisa / Udhar
                </span>
                {pendingPaymentCount > 0 && (
                  <span className="absolute -top-1 right-0 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                    {pendingPaymentCount}
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* 3. Orders Queue */}
          <NavLink
            to="/vendor/orders"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-all py-1 px-2 rounded-xl relative ${
                isActive
                  ? 'text-blue-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-500/25 text-blue-400 ring-1 ring-blue-400/40' : 'bg-slate-900'}`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                  Orders
                </span>
              </>
            )}
          </NavLink>

          {/* 4. Kitchen Menu & Sabjis */}
          <NavLink
            to="/vendor/menu"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-all py-1 px-2 rounded-xl relative ${
                isActive
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-amber-500/25 text-amber-400 ring-1 ring-amber-400/40' : 'bg-slate-900'}`}>
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                  My Menu
                </span>
              </>
            )}
          </NavLink>

          {/* 5. Earnings & Wallet */}
          <NavLink
            to="/vendor/earnings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 transition-all py-1 px-2 rounded-xl relative ${
                isActive
                  ? 'text-purple-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-purple-500/25 text-purple-400 ring-1 ring-purple-400/40' : 'bg-slate-900'}`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                  Earnings
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );

  if (mobileDeviceFrame) {
    return (
      <div className="min-h-screen bg-slate-950 py-4 px-2 sm:px-4 flex items-center justify-center">
        <div className="mobile-viewport-container bg-slate-900 text-slate-100 relative flex flex-col w-full border-8 border-slate-800 shadow-2xl rounded-[36px] overflow-hidden max-h-[92vh]">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
