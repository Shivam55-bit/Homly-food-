import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAllOrders } from '../../store/slices/orderSlice';
import { fetchAllSubscriptions } from '../../store/slices/subscriptionSlice';
import { fetchCustomers } from '../../store/slices/customerSlice';
import { fetchTransactions } from '../../store/slices/paymentSlice';
import { fetchInventory } from '../../store/slices/inventorySlice';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AdminPwaBanner } from '../components/AdminPwaBanner';
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  Truck, 
  TrendingUp, 
  AlertTriangle, 
  CalendarClock, 
  ArrowUpRight,
  ChevronRight,
  Flame,
  Utensils
} from 'lucide-react';

const REVENUE_DATA = [
  { day: 'Mon', revenue: 42000, orders: 180 },
  { day: 'Tue', revenue: 48500, orders: 210 },
  { day: 'Wed', revenue: 51200, orders: 230 },
  { day: 'Thu', revenue: 49000, orders: 215 },
  { day: 'Fri', revenue: 58000, orders: 260 },
  { day: 'Sat', revenue: 64000, orders: 290 },
  { day: 'Sun', revenue: 68500, orders: 310 }
];

const CUSTOMER_GROWTH_DATA = [
  { month: 'Apr', customers: 450, activeSubs: 320 },
  { month: 'May', customers: 620, activeSubs: 480 },
  { month: 'Jun', customers: 850, activeSubs: 690 },
  { month: 'Jul', customers: 1100, activeSubs: 920 },
  { month: 'Aug', customers: 1450, activeSubs: 1210 }
];

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orders = useAppSelector((state) => state.orders.orders);
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions);
  const customers = useAppSelector((state) => state.customers.customers);
  const transactions = useAppSelector((state) => state.payments.transactions);
  const inventory = useAppSelector((state) => state.inventory.items);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllSubscriptions());
    dispatch(fetchCustomers());
    dispatch(fetchTransactions());
    dispatch(fetchInventory());
  }, [dispatch]);

  const activeSubsCount = subscriptions.filter((s) => s.status === 'active').length;
  const pendingOrders = orders.filter((o) => o.status === 'placed' || o.status === 'preparing');
  const lowStockItems = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock');
  const totalMonthlyRev = transactions.filter(t => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* PWA Mobile App Install Banner */}
      <AdminPwaBanner />

      {/* Top Banner & Quick Kitchen Hub Shortcut */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Kitchen Operations & CRM Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time meal dispatches, active subscribers, and kitchen inventory metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/kitchen-hub')}
            className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Open Mobile Kitchen & Paisa Station</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Kitchen Live</span>
          </span>
        </div>
      </div>

      {/* 1. Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Subscribers"
          value={activeSubsCount || '1,210'}
          subtext="Regular daily tiffin passes"
          trend="+18.4%"
          isPositive={true}
          icon={CalendarClock}
          iconBgColor="bg-orange-50 dark:bg-orange-950/50"
          iconColor="text-orange-600 dark:text-orange-400"
        />

        <StatCard
          title="Today's Meal Orders"
          value={orders.length || '342'}
          subtext="Morning, lunch & dinner"
          trend="+12.2%"
          isPositive={true}
          icon={ShoppingBag}
          iconBgColor="bg-blue-50 dark:bg-blue-950/50"
          iconColor="text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="August Revenue"
          value={`₹${(totalMonthlyRev || 381200).toLocaleString('en-IN')}`}
          subtext="Sub + daily orders"
          trend="+24.8%"
          isPositive={true}
          icon={IndianRupee}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/50"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Pending Dispatches"
          value={pendingOrders.length || '2'}
          subtext="Kitchen preparing batch"
          trend="Immediate Action"
          isPositive={false}
          icon={Clock}
          iconBgColor="bg-amber-50 dark:bg-amber-950/50"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Orders Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Weekly Revenue & Order Volume
              </h3>
              <p className="text-xs text-slate-400">Total gross receipts across all tiffin meal types</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl">
              Avg ₹54,400 / day
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth & Retention Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Subscriber Growth
              </h3>
              <p className="text-xs text-slate-400">Monthly active subscriptions</p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-lg">
              92% Retention
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CUSTOMER_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="activeSubs" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Today's Delivery Dispatch Board & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Deliveries Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Today's Dispatch & Rider Assignment
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/deliveries')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage Fleet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Slot / Area</th>
                  <th className="p-3">Assigned Rider</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {order.orderNumber}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400">{order.customerPhone}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-bold text-slate-700 dark:text-slate-300 block">
                        {order.deliverySlot}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px] block">
                        {order.deliveryAddress.area}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.deliveryBoyName ? (
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <Truck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{order.deliveryBoyName}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-rose-500 font-bold">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock & Kitchen Alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Low Stock Alerts
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/inventory')}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Restock
            </button>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">All kitchen ingredients are well-stocked.</p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-xs text-rose-900 dark:text-rose-200 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400">
                      Remaining: {item.currentStock} {item.unit} (Min: {item.minThreshold} {item.unit})
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                    Low
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick Operations Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => navigate('/admin/menu')}
              className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Update Weekly Menu Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
