import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { 
  Search, 
  Bell, 
  Menu as MenuIcon, 
  Sun, 
  Moon, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  ShoppingBag,
  Plus
} from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.orders);
  const inventory = useAppSelector((state) => state.inventory.items);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'placed' || o.status === 'preparing').length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-9 z-20 transition-colors">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers, orders, transactions (e.g. HF-2026)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Quick actions, notifications, theme, profile */}
      <div className="flex items-center gap-3">
        {/* Quick Order Button */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="hidden md:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Order</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {(lowStockCount > 0 || pendingOrdersCount > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                  Kitchen Notifications
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Live Feed
                </span>
              </div>

              <div className="space-y-2 mt-2">
                {pendingOrdersCount > 0 && (
                  <div
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate('/admin/orders');
                    }}
                    className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 flex items-start gap-2.5 cursor-pointer hover:bg-orange-100/50 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-orange-900 dark:text-orange-200 block">
                        {pendingOrdersCount} Orders in Kitchen Queue
                      </span>
                      <p className="text-[11px] text-orange-700 dark:text-orange-300">
                        Orders require chef confirmation and rider dispatch.
                      </p>
                    </div>
                  </div>
                )}

                {lowStockCount > 0 && (
                  <div
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate('/admin/inventory');
                    }}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 cursor-pointer hover:bg-rose-100/50 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-rose-900 dark:text-rose-200 block">
                        {lowStockCount} Items Low on Stock
                      </span>
                      <p className="text-[11px] text-rose-700 dark:text-rose-300">
                        Paneer, Meal Boxes, or LPG Cylinders below threshold.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Admin"
            className="w-8 h-8 rounded-xl object-cover border border-emerald-500"
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
              Kitchen Admin
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Head Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
};
