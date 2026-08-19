import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { Home, UtensilsCrossed, CalendarClock, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  isFrame?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isFrame = false }) => {
  const activeOrders = useAppSelector((state) => 
    state.orders.userOrders.filter(o => o.status === 'placed' || o.status === 'preparing' || o.status === 'out_for_delivery')
  );
  const activeSubscription = useAppSelector((state) => state.subscriptions.activeSubscription);

  return (
    <nav
      className={`${
        isFrame ? 'sticky bottom-0' : 'fixed bottom-0 left-0 right-0'
      } z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl py-2 px-3`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl relative ${
              isActive
                ? 'text-orange-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : ''}`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">Home</span>
            </>
          )}
        </NavLink>

        {/* Menu */}
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl relative ${
              isActive
                ? 'text-orange-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : ''}`}>
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">Menu</span>
            </>
          )}
        </NavLink>

        {/* Plans / Subscription */}
        <NavLink
          to="/plans"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl relative ${
              isActive
                ? 'text-orange-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : ''}`}>
                <CalendarClock className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">Plans</span>
              {activeSubscription && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              )}
            </>
          )}
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/my-orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl relative ${
              isActive
                ? 'text-orange-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : ''}`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">Orders</span>
              {activeOrders.length > 0 && (
                <span className="absolute -top-0.5 right-1.5 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {activeOrders.length}
                </span>
              )}
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-all py-1 px-3 rounded-2xl relative ${
              isActive
                ? 'text-orange-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : ''}`}>
                <User className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
