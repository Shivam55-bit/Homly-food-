import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserOrders, addItemToCart } from '../../store/slices/orderSlice';
import { addToast } from '../../store/slices/uiSlice';
import { InvoiceDownloadModal } from '../components/InvoiceDownloadModal';
import { Order, OrderStatus } from '../../types';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw, 
  FileText, 
  Utensils,
  ChefHat
} from 'lucide-react';

export const MyOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const userOrders = useAppSelector((state) => state.orders.userOrders);

  const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserOrders(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const ongoingOrders = userOrders.filter(
    (o) => o.status === 'placed' || o.status === 'preparing' || o.status === 'out_for_delivery'
  );
  const pastOrders = userOrders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  const displayedOrders = activeTab === 'ongoing' ? ongoingOrders : pastOrders;

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      dispatch(addItemToCart(item));
    });
    dispatch(
      addToast({
        type: 'success',
        title: 'Items Added to Cart',
        message: 'Reordered items added to your box. Proceeding to checkout.'
      })
    );
  };

  const renderTimeline = (status: OrderStatus) => {
    const steps = [
      { key: 'placed', label: 'Order Placed' },
      { key: 'preparing', label: 'Kitchen Cooking' },
      { key: 'out_for_delivery', label: 'Rider Dispatched' },
      { key: 'delivered', label: 'Delivered' }
    ];

    const currentIdx = steps.findIndex((s) => s.key === status);

    return (
      <div className="py-4 border-t border-b border-slate-100 my-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200 -z-0"></div>
          <div
            className="absolute top-3 left-3 h-0.5 bg-emerald-500 -z-0 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%`
            }}
          ></div>

          {steps.map((step, idx) => {
            const isPassed = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                    isPassed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}
                >
                  {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 text-center max-w-[65px] leading-tight ${
                    isCurrent ? 'text-emerald-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-600" />
          <span>My Orders & Tiffin Deliveries</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live real-time delivery tracker and meal dispatch logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 max-w-sm">
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'ongoing'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Live / Ongoing</span>
          {ongoingOrders.length > 0 && (
            <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {ongoingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Past Orders</span>
          <span className="text-slate-400 text-[10px]">({pastOrders.length})</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              {activeTab === 'ongoing' ? 'No Live Ongoing Orders' : 'No Order History Yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {activeTab === 'ongoing'
                ? 'All your scheduled meals for today have been delivered or none are pending.'
                : 'Your completed tiffin orders will appear here.'}
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-orange-700 transition-colors"
            >
              <span>Order Tiffin Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {order.planType.toUpperCase()} Plan
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900">₹{order.totalAmount}</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px]">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Live Progress Timeline for Active Orders */}
              {activeTab === 'ongoing' && renderTimeline(order.status)}

              {/* Rider info if dispatched */}
              {order.deliveryBoyName && order.status === 'out_for_delivery' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 block">
                        Rider: {order.deliveryBoyName}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        {order.deliveryBoyPhone} • Arriving soon
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.deliveryBoyPhone}`}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Rider</span>
                  </a>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>View Tax Invoice</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reorder</span>
                  </button>
                  <Link
                    to="/feedback"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition-colors"
                  >
                    Rate Meal
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceDownloadModal
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
};
