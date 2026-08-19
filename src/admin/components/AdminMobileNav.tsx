import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { 
  Utensils, 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  LayoutDashboard
} from 'lucide-react';

interface AdminMobileNavProps {
  isFrame?: boolean;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({ isFrame = false }) => {
  const orders = useAppSelector((state) => state.orders.orders);
  const pendingPaymentsCount = orders.filter((o) => o.paymentStatus === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'placed' || o.status === 'preparing').length;

  return (
    <nav
      className={`${
        isFrame ? 'sticky bottom-0' : 'fixed bottom-0 left-0 right-0 md:hidden'
      } z-50 bg-slate-900/98 backdrop-blur-xl border-t border-slate-700/80 text-slate-300 py-2 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]`}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Live Kitchen Tiffins & Sabji Packing Hub (MAIN FEATURE) */}
        <NavLink
          to="/admin/kitchen-hub"
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
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-orange-500/25 text-orange-400 ring-1 ring-orange-400/40' : 'bg-slate-800/80'}`}>
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                Kitchen Hub
              </span>
              {preparingCount > 0 && (
                <span className="absolute -top-1 right-0 bg-orange-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {preparingCount}
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 2. Paisa & Udhar Collections (MAIN FEATURE) */}
        <NavLink
          to="/admin/payments"
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
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-emerald-500/25 text-emerald-400 ring-1 ring-emerald-400/40' : 'bg-slate-800/80'}`}>
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                Paisa / Udhar
              </span>
              {pendingPaymentsCount > 0 && (
                <span className="absolute -top-1 right-0 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {pendingPaymentsCount}
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* 3. Orders Queue (MAIN FEATURE) */}
        <NavLink
          to="/admin/orders"
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
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-500/25 text-blue-400 ring-1 ring-blue-400/40' : 'bg-slate-800/80'}`}>
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                Orders
              </span>
            </>
          )}
        </NavLink>

        {/* 4. Customer Directory */}
        <NavLink
          to="/admin/customers"
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
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-amber-500/25 text-amber-400 ring-1 ring-amber-400/40' : 'bg-slate-800/80'}`}>
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                Customers
              </span>
            </>
          )}
        </NavLink>

        {/* 5. Dashboard Overview */}
        <NavLink
          to="/admin/dashboard"
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
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-purple-500/25 text-purple-400 ring-1 ring-purple-400/40' : 'bg-slate-800/80'}`}>
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-extrabold whitespace-nowrap">
                Overview
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
