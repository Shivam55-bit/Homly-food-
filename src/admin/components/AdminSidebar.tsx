import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  CalendarClock, 
  UtensilsCrossed, 
  Truck, 
  CreditCard, 
  Receipt, 
  PackageCheck, 
  BarChart3, 
  Settings as SettingsIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChefHat, 
  Sun, 
  Moon, 
  Smartphone,
  LogOut,
  Building2,
  Utensils
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, theme } = useAppSelector((state) => state.ui);

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/kitchen-hub', label: 'Kitchen Hub', icon: Utensils },
    { to: '/admin/vendors', label: 'Kitchen Vendors', icon: Building2 },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/subscriptions', label: 'Subscriptions', icon: CalendarClock },
    { to: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { to: '/admin/deliveries', label: 'Deliveries & Fleet', icon: Truck },
    { to: '/admin/payments', label: 'Payments & Billing', icon: CreditCard },
    { to: '/admin/expenses', label: 'Expenses', icon: Receipt },
    { to: '/admin/inventory', label: 'Inventory Stock', icon: PackageCheck },
    { to: '/admin/reports', label: 'Reports & P&L', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`fixed top-10 sm:top-9 bottom-0 left-0 z-30 bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-lg shadow-emerald-500/20">
              <ChefHat className="w-6 h-6" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <span className="font-black text-base text-white tracking-tight block leading-tight">
                  Homly<span className="text-emerald-400">Admin</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Kitchen Enterprise CRM
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User & Theme Toggle */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 flex-shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-blue-300 flex-shrink-0" />
          )}
          {!sidebarCollapsed && (
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          )}
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-orange-400 hover:bg-orange-500/10 transition-colors"
        >
          <Smartphone className="w-4 h-4 flex-shrink-0" />
          {!sidebarCollapsed && <span>View Customer App</span>}
        </button>
      </div>
    </aside>
  );
};
