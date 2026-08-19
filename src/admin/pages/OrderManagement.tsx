import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  setFilterStatus, 
  setFilterSlot 
} from '../../store/slices/orderSlice';
import { fetchRiders } from '../../store/slices/deliverySlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { Order, OrderStatus, DeliverySlot } from '../../types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  Clock, 
  CheckCircle2, 
  X, 
  Phone, 
  MapPin, 
  Eye, 
  ChefHat,
  FileText
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, filterStatus, filterSlot } = useAppSelector((state) => state.orders);
  const riders = useAppSelector((state) => state.delivery.riders);

  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchRiders());
  }, [dispatch]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order #${orderId} marked as ${newStatus.replace(/_/g, ' ')}.`
      })
    );
  };

  const handleAssignRider = (orderId: string, riderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 'out_for_delivery', riderId }));
    dispatch(
      addToast({
        type: 'success',
        title: 'Rider Assigned',
        message: 'Order dispatched with delivery rider.'
      })
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search);

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSlot = filterSlot === 'all' || order.deliverySlot === filterSlot;

    return matchesSearch && matchesStatus && matchesSlot;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Order Management & Dispatch Control</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time kitchen orders, assign delivery fleet, and update statuses.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order # or Customer..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => dispatch(setFilterStatus(st as any))}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === st
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Slot Filter */}
          <select
            value={filterSlot}
            onChange={(e) => dispatch(setFilterSlot(e.target.value as any))}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">All Slots</option>
            <option value="morning">Morning (Breakfast)</option>
            <option value="afternoon">Afternoon (Lunch)</option>
            <option value="evening">Evening (Dinner)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Meal Items</th>
                <th className="p-3.5">Delivery Slot</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Assigned Fleet Rider</th>
                <th className="p-3.5">Status & Action</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {order.orderNumber}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {order.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400">{order.customerPhone}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1 max-w-[200px]">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-slate-800 dark:text-slate-200 font-bold">
                          <span className="text-xs">{it.quantity}x {it.name}</span>
                          {it.sabjis && it.sabjis.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              <span className="bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-orange-200">
                                {it.sabjiCount || it.sabjis.length} Sabji: {it.sabjis.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="capitalize font-bold text-slate-800 dark:text-slate-200 block">
                      {order.deliverySlot}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[130px] block">
                      {order.deliveryAddress.area}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={order.deliveryBoyId || ''}
                      onChange={(e) => handleAssignRider(order.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none"
                    >
                      <option value="">-- Assign Rider --</option>
                      {riders.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.assignedArea.split('/')[0]})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold uppercase border outline-none cursor-pointer ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.status === 'out_for_delivery'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : order.status === 'preparing'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-800 border-slate-300'
                      }`}
                    >
                      <option value="placed">Placed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span>{selectedOrder.customerName}</span>
                <span>{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.area}, {selectedOrder.deliveryAddress.pincode}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Meal Items</span>
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-bold">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {selectedOrder.specialInstructions && (
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                <span className="font-bold block">Special Instructions:</span>
                <p className="text-[11px] mt-0.5">{selectedOrder.specialInstructions}</p>
              </div>
            )}

            <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Total Amount:</span>
              <span className="text-emerald-600">₹{selectedOrder.totalAmount}</span>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
