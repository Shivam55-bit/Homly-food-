import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAllOrders, updateOrderStatus, updateOrderPaymentStatus } from '../../store/slices/orderSlice';
import { updateTransactionStatus } from '../../store/slices/paymentSlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { Order, OrderStatus, DeliverySlot } from '../../types';
import { 
  Utensils, 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Truck, 
  Search, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  Flame, 
  Check, 
  Package, 
  Send,
  UserCheck
} from 'lucide-react';

export const KitchenLiveHub: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const riders = useAppSelector((state) => state.delivery.riders);

  const [selectedMealSlot, setSelectedMealSlot] = useState<DeliverySlot | 'all'>('all');
  const [selectedSabjiFilter, setSelectedSabjiFilter] = useState<'all' | '1_sabji' | '2_sabji'>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Financial Calculations
  const totalAmountToday = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalReceivedAmount = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPendingAmount = orders
    .filter((o) => o.paymentStatus === 'pending')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search) ||
      order.deliveryAddress.area.toLowerCase().includes(search.toLowerCase()) ||
      (order.tiffinDetails?.sabjiNames.some((s) => s.toLowerCase().includes(search.toLowerCase())));

    const matchesSlot = selectedMealSlot === 'all' || order.deliverySlot === selectedMealSlot;

    const sabjiCount = order.tiffinDetails?.sabjiCount || (order.items[0]?.sabjiCount || 1);
    const matchesSabji =
      selectedSabjiFilter === 'all' ||
      (selectedSabjiFilter === '1_sabji' && sabjiCount === 1) ||
      (selectedSabjiFilter === '2_sabji' && sabjiCount >= 2);

    const matchesPayment =
      selectedPaymentFilter === 'all' || order.paymentStatus === selectedPaymentFilter;

    return matchesSearch && matchesSlot && matchesSabji && matchesPayment;
  });

  const handleMarkPaymentReceived = (order: Order) => {
    dispatch(updateOrderPaymentStatus({ orderId: order.id, paymentStatus: 'paid' }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Paisa Received! 💰',
        message: `₹${order.totalAmount} marked as paid from ${order.customerName}. Live collection updated!`
      })
    );
  };

  const handleTogglePacked = (order: Order) => {
    const nextStatus: OrderStatus = order.status === 'preparing' || order.status === 'placed' ? 'out_for_delivery' : 'delivered';
    dispatch(updateOrderStatus({ orderId: order.id, status: nextStatus }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Tiffin Status Updated',
        message: `Order #${order.orderNumber} marked as ${nextStatus.replace(/_/g, ' ')}.`
      })
    );
  };

  const handleSendWhatsAppReminder = (order: Order) => {
    const text = `Namaste ${order.customerName}, Homly Food Tiffin delivery #${order.orderNumber} bill amount is Rs.${order.totalAmount}. Please pay via UPI. Dhanyawad!`;
    const url = `https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/\D/g, '')}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 pb-28 max-w-5xl mx-auto">
      {/* 1. Top Financial Summary Card (Live Paisa Counter) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-slate-700 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base text-white tracking-tight">
                Live Kitchen & Paisa Counter
              </h2>
              <span className="text-[10px] text-slate-400">Total Today's Tiffins & Collections</span>
            </div>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30 animate-pulse">
            ● Live Sync
          </span>
        </div>

        {/* 3 Metric Pills: Total Paisa, Received (Aagya), Pending (Baki) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Paisa</span>
            <div className="text-base sm:text-2xl font-black text-white mt-0.5">
              ₹{totalAmountToday.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] text-slate-400 block">{orders.length} Tiffins</span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/60 text-center">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase block">Paisa Aagya</span>
            <div className="text-base sm:text-2xl font-black text-emerald-400 mt-0.5">
              ₹{totalReceivedAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] text-emerald-300 block">
              {orders.filter((o) => o.paymentStatus === 'paid').length} Paid
            </span>
          </div>

          <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-800/60 text-center">
            <span className="text-[10px] font-extrabold text-rose-400 uppercase block">Baki / Pending</span>
            <div className="text-base sm:text-2xl font-black text-rose-400 mt-0.5">
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] text-rose-300 block">
              {orders.filter((o) => o.paymentStatus === 'pending').length} Udhar/COD
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fast Filter Buttons for Mobile Kitchen Admin */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, sabji (Paneer, Dal, Bhindi), or area..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500 shadow-xs"
          />
        </div>

        {/* Filter Badges Carousel (Sabji Count & Payment Status) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {/* Sabji Filters */}
          <button
            onClick={() => setSelectedSabjiFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedSabjiFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Tiffins ({orders.length})
          </button>

          <button
            onClick={() => setSelectedSabjiFilter('2_sabji')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              selectedSabjiFilter === '2_sabji'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>🥘 2 Sabji Tiffins</span>
          </button>

          <button
            onClick={() => setSelectedSabjiFilter('1_sabji')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              selectedSabjiFilter === '1_sabji'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>🥘 1 Sabji Tiffins</span>
          </button>

          {/* Payment Filters */}
          <button
            onClick={() => setSelectedPaymentFilter(selectedPaymentFilter === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              selectedPaymentFilter === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <span>🔴 Baki / Pending</span>
          </button>

          <button
            onClick={() => setSelectedPaymentFilter(selectedPaymentFilter === 'paid' ? 'all' : 'paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
              selectedPaymentFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <span>🟢 Paisa Aagya (Paid)</span>
          </button>
        </div>

        {/* Meal Slot Tabs */}
        <div className="flex items-center gap-1.5">
          {['all', 'afternoon', 'evening', 'morning'].map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedMealSlot(slot as any)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                selectedMealSlot === slot
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {slot === 'afternoon' ? 'Lunch Batch' : slot === 'evening' ? 'Dinner Batch' : slot === 'morning' ? 'Breakfast' : 'All Slots'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tiffin Cards Stream (Mobile App Card Format) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
          <span>Showing {filteredOrders.length} Tiffins to pack & deliver</span>
          <span className="text-emerald-600">Kitchen Live</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <Utensils className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">No tiffins match this filter</h4>
            <p className="text-xs text-slate-400">Try changing the sabji count or payment filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const sabjiCount = order.tiffinDetails?.sabjiCount || (order.items[0]?.sabjiCount || 1);
            const sabjiNames = order.tiffinDetails?.sabjiNames || order.items[0]?.sabjis || ['Special Homestyle Dal & Sabji'];
            const rotiCount = order.tiffinDetails?.rotiCount || order.items[0]?.rotiCount || 3;
            const hasRice = order.tiffinDetails?.hasRice ?? true;
            const hasSweet = order.tiffinDetails?.hasSweet ?? false;
            const hasSalad = order.tiffinDetails?.hasSalad ?? true;

            const isPaid = order.paymentStatus === 'paid';

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                {/* Top Accent Stripe based on Sabji Count */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    sabjiCount >= 2 ? 'bg-gradient-to-r from-orange-500 to-amber-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                  }`}
                ></div>

                {/* Header: Customer Name, Order #, Total Paisa, Payment Badge */}
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {order.customerName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{order.orderNumber.replace('HF-2026-', '')}
                      </span>
                    </div>

                    {/* Address / Kaha Ka Hai */}
                    <div className="flex items-start gap-1 text-xs text-slate-600 dark:text-slate-300 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium truncate max-w-[220px] sm:max-w-md">
                        {order.deliveryAddress.street}, {order.deliveryAddress.area}
                      </span>
                    </div>
                  </div>

                  {/* Paisa / Amount & Payment Status */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      ₹{order.totalAmount}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse'
                      }`}
                    >
                      {isPaid ? 'PAID' : 'BAKI / PENDING'}
                    </span>
                  </div>
                </div>

                {/* 4. Exact Tiffin Sabji & Item Details Card (HIGHLIGHTED FEATURE) */}
                <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg uppercase flex items-center gap-1 ${
                        sabjiCount >= 2
                          ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300'
                          : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300'
                      }`}
                    >
                      <Utensils className="w-3 h-3" />
                      <span>{sabjiCount} Sabji Tiffin Box</span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-500 capitalize">
                      {order.deliverySlot} Delivery
                    </span>
                  </div>

                  {/* Sabji Names Breakdown */}
                  <div className="space-y-1 pt-1">
                    <div className="text-xs text-slate-800 dark:text-slate-100 font-extrabold flex items-start gap-1.5">
                      <span className="text-orange-600 flex-shrink-0">🥘 Sabjis:</span>
                      <div className="flex flex-wrap gap-1">
                        {sabjiNames.map((sName, idx) => (
                          <span
                            key={idx}
                            className="bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200 px-2 py-0.5 rounded-md font-bold text-xs shadow-2xs"
                          >
                            {idx + 1}. {sName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bread / Rice / Accompaniments */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-1">
                      <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        🫓 {rotiCount} Soft Phulkas
                      </span>
                      {hasRice && (
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md">
                          🍚 Steamed Rice
                        </span>
                      )}
                      {hasSweet && (
                        <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                          🍨 Sweet Dish
                        </span>
                      )}
                      {hasSalad && (
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                          🥗 Fresh Salad
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Customer special instructions if any */}
                  {order.specialInstructions && (
                    <div className="text-[11px] bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-xl font-medium border border-amber-300/60">
                      <strong>Chef Note:</strong> {order.specialInstructions}
                    </div>
                  )}
                </div>

                {/* 5. Mobile Quick Action Buttons (Call, WhatsApp, Mark Paid, Pack/Dispatch) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {/* Left: Contact Customer Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
                      title="Call Customer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Call</span>
                    </a>

                    <button
                      onClick={() => handleSendWhatsAppReminder(order)}
                      className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>

                  {/* Right: Payment Action & Packing Toggle */}
                  <div className="flex items-center gap-2">
                    {!isPaid && (
                      <button
                        onClick={() => handleMarkPaymentReceived(order)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Paisa Aagya</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleTogglePacked(order)}
                      className={`font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                        order.status === 'out_for_delivery'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : order.status === 'delivered'
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20'
                      }`}
                    >
                      {order.status === 'out_for_delivery' ? (
                        <>
                          <Truck className="w-3.5 h-3.5" />
                          <span>On Delivery</span>
                        </>
                      ) : order.status === 'delivered' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Delivered</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-3.5 h-3.5" />
                          <span>Pack & Dispatch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
