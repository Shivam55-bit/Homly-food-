import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchAllOrders, 
  updateOrderStatus, 
  editOrder,
  deleteOrder,
  placeOrder,
  setFilterStatus, 
  setFilterSlot 
} from '../../store/slices/orderSlice';
import { fetchRiders } from '../../store/slices/deliverySlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { Order, OrderStatus, DeliverySlot, MealType, PaymentMethod, PaymentStatus } from '../../types';
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
  FileText,
  Plus,
  Edit3,
  Trash2,
  IndianRupee,
  Utensils,
  User,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Check
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, filterStatus, filterSlot, isLoading } = useAppSelector((state) => state.orders);
  const riders = useAppSelector((state) => state.delivery.riders);

  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    mealType: 'lunch' as MealType,
    quantity: 1,
    sabji1: 'Paneer Butter Masala',
    sabji2: 'Dal Makhani',
    deliverySlot: 'afternoon' as DeliverySlot,
    street: '',
    area: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
    totalAmount: 139,
    paymentMethod: 'upi' as PaymentMethod,
    paymentStatus: 'paid' as PaymentStatus,
    specialInstructions: ''
  });

  // Edit Order Form State
  const [editFormData, setEditFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliverySlot: 'afternoon' as DeliverySlot,
    status: 'placed' as OrderStatus,
    street: '',
    area: '',
    pincode: '',
    totalAmount: 0,
    paymentStatus: 'paid' as PaymentStatus,
    deliveryBoyId: '',
    specialInstructions: ''
  });

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
        message: `Order marked as ${newStatus.replace(/_/g, ' ')}.`
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

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setEditFormData({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliverySlot: order.deliverySlot,
      status: order.status,
      street: order.deliveryAddress?.street || '',
      area: order.deliveryAddress?.area || 'Indiranagar',
      pincode: order.deliveryAddress?.pincode || '560038',
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      deliveryBoyId: order.deliveryBoyId || '',
      specialInstructions: order.specialInstructions || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const updates: Partial<Order> = {
      customerName: editFormData.customerName,
      customerPhone: editFormData.customerPhone,
      deliverySlot: editFormData.deliverySlot,
      status: editFormData.status,
      totalAmount: Number(editFormData.totalAmount),
      paymentStatus: editFormData.paymentStatus,
      deliveryBoyId: editFormData.deliveryBoyId || undefined,
      specialInstructions: editFormData.specialInstructions,
      deliveryAddress: {
        ...editingOrder.deliveryAddress,
        street: editFormData.street,
        area: editFormData.area,
        pincode: editFormData.pincode
      }
    };

    await dispatch(editOrder({ id: editingOrder.id, updates }));
    setEditingOrder(null);
    dispatch(
      addToast({
        type: 'success',
        title: 'Order Updated',
        message: `Order #${editingOrder.orderNumber} successfully updated.`
      })
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    await dispatch(deleteOrder(deletingOrder.id));
    setDeletingOrder(null);
    dispatch(
      addToast({
        type: 'info',
        title: 'Order Deleted',
        message: `Order #${deletingOrder.orderNumber} has been removed.`
      })
    );
  };

  const handleCreateNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerName || !newOrderForm.customerPhone) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Fields',
          message: 'Please provide customer name and phone number.'
        })
      );
      return;
    }

    const orderPayload = {
      userId: `usr-${Date.now()}`,
      customerName: newOrderForm.customerName,
      customerPhone: newOrderForm.customerPhone.startsWith('+') ? newOrderForm.customerPhone : `+91 ${newOrderForm.customerPhone}`,
      items: [
        {
          menuItemId: `item-${newOrderForm.mealType}`,
          name: `${newOrderForm.mealType.toUpperCase()} Executive Thali Combo`,
          mealType: newOrderForm.mealType,
          dietaryType: 'veg' as const,
          quantity: Number(newOrderForm.quantity),
          price: Math.round(Number(newOrderForm.totalAmount) / Number(newOrderForm.quantity)),
          sabjiCount: 2,
          sabjis: [newOrderForm.sabji1, newOrderForm.sabji2].filter(Boolean)
        }
      ],
      planType: 'daily' as const,
      selectedMeals: [newOrderForm.mealType],
      scheduledDate: new Date().toISOString().split('T')[0],
      deliverySlot: newOrderForm.deliverySlot,
      deliveryAddress: {
        id: `addr-${Date.now()}`,
        label: 'Home' as const,
        street: newOrderForm.street || 'Main Road',
        area: newOrderForm.area || 'Indiranagar',
        city: newOrderForm.city || 'Bangalore',
        pincode: newOrderForm.pincode || '560038',
        isDefault: true
      },
      status: 'placed' as const,
      subtotal: Number(newOrderForm.totalAmount),
      deliveryFee: 0,
      discount: 0,
      tax: 0,
      totalAmount: Number(newOrderForm.totalAmount),
      paymentMethod: newOrderForm.paymentMethod,
      paymentStatus: newOrderForm.paymentStatus,
      specialInstructions: newOrderForm.specialInstructions
    };

    await dispatch(placeOrder(orderPayload));
    setShowAddModal(false);
    // Reset form
    setNewOrderForm({
      customerName: '',
      customerPhone: '',
      mealType: 'lunch',
      quantity: 1,
      sabji1: 'Paneer Butter Masala',
      sabji2: 'Dal Makhani',
      deliverySlot: 'afternoon',
      street: '',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      totalAmount: 139,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      specialInstructions: ''
    });

    dispatch(
      addToast({
        type: 'success',
        title: 'New Order Created! 🎉',
        message: 'Order added to kitchen queue & scheduled for delivery.'
      })
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search) ||
      order.deliveryAddress?.area?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSlot = filterSlot === 'all' || order.deliverySlot === filterSlot;

    return matchesSearch && matchesStatus && matchesSlot;
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            <span>Order Management & Dispatch Control</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor live orders, create manual orders, edit meals, and assign delivery fleet.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Order</span>
        </button>
      </div>

      {/* Search & Filters (Mobile Horizontal Scrollable) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order #, Customer, Phone, Locality..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Slot Filter Dropdown */}
          <select
            value={filterSlot}
            onChange={(e) => dispatch(setFilterSlot(e.target.value as any))}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">🕒 All Delivery Slots</option>
            <option value="morning">🌅 Morning (Breakfast)</option>
            <option value="afternoon">☀️ Afternoon (Lunch)</option>
            <option value="evening">🌙 Evening (Dinner)</option>
          </select>
        </div>

        {/* Status Pills (Scrollable on Mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => dispatch(setFilterStatus(st as any))}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                filterStatus === st
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Count Summary */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900 dark:text-white">{filteredOrders.length}</strong> orders
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE CARDS VIEW (Displayed on mobile screens < md) */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-400">No orders found matching your search</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
            >
              {/* Card Header: Order Number, Time & Status */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                      {order.deliverySlot}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.scheduledDate || 'Today'}
                  </span>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* Customer Details & Call Button */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span className="truncate max-w-[200px]">{order.deliveryAddress?.area}, {order.deliveryAddress?.city}</span>
                  </div>
                </div>

                <a
                  href={`tel:${order.customerPhone}`}
                  className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
                  title="Call Customer"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Meal Items Summary */}
              <div className="space-y-1 text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="bg-orange-50/60 dark:bg-orange-950/30 p-2 rounded-xl border border-orange-100 dark:border-orange-900/40">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="text-emerald-600 font-black">₹{it.price * it.quantity}</span>
                    </div>
                    {it.sabjis && it.sabjis.length > 0 && (
                      <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold mt-0.5">
                        🥘 {it.sabjis.join(' + ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Amount & Payment Info */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Total Bill</span>
                  <span className="font-black text-sm text-slate-900 dark:text-white">₹{order.totalAmount}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">Payment</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Status Selector & Rider Assignment on Mobile */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fleet Rider</label>
                  <select
                    value={order.deliveryBoyId || ''}
                    onChange={(e) => handleAssignRider(order.id, e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="">-- Assign Rider --</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="py-2 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(order)}
                  className="py-2 px-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeletingOrder(order)}
                  className="py-2 px-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200 dark:border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP TABLE VIEW (Displayed on screens >= md) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Meal Items</th>
                <th className="p-3.5">Delivery Slot</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Assigned Rider</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
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
                                {it.sabjis.join(', ')}
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
                      {order.deliveryAddress?.area}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-600">
                      {order.paymentMethod} • {order.paymentStatus}
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
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-extrabold uppercase outline-none cursor-pointer"
                    >
                      <option value="placed">Placed</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(order)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Edit Order"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingOrder(order)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODALS: ADD ORDER, EDIT ORDER, VIEW DETAILS, DELETE CONFIRMATION */}
      {/* ========================================================================= */}

      {/* A. CREATE NEW ORDER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Create New Tiffin Order
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerName}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    placeholder="10-digit phone"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Meal Slot</label>
                  <select
                    value={newOrderForm.deliverySlot}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, deliverySlot: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Lunch</option>
                    <option value="evening">Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newOrderForm.quantity}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value), totalAmount: Number(e.target.value) * 139 })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Total (₹)</label>
                  <input
                    type="number"
                    value={newOrderForm.totalAmount}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, totalAmount: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Sabji Choice 1</label>
                  <input
                    type="text"
                    value={newOrderForm.sabji1}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, sabji1: e.target.value })}
                    placeholder="e.g. Paneer Butter Masala"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Sabji Choice 2</label>
                  <input
                    type="text"
                    value={newOrderForm.sabji2}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, sabji2: e.target.value })}
                    placeholder="e.g. Dal Tadka"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase text-[10px]">Delivery Street & Flat No.</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.street}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, street: e.target.value })}
                  placeholder="Flat 102, Shanti Kunj, 5th Main"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Area / Locality</label>
                  <input
                    type="text"
                    value={newOrderForm.area}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, area: e.target.value })}
                    placeholder="Indiranagar"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Payment Status</label>
                  <select
                    value={newOrderForm.paymentStatus}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentStatus: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="paid">Paid (UPI / Online)</option>
                    <option value="pending">Pending (Cash on Delivery)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase text-[10px]">Special Instructions</label>
                <input
                  type="text"
                  value={newOrderForm.specialInstructions}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, specialInstructions: e.target.value })}
                  placeholder="e.g. Less spicy, send extra spoons"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Save & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Edit Order #{editingOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.customerName}
                    onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.customerPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, customerPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Delivery Slot</label>
                  <select
                    value={editFormData.deliverySlot}
                    onChange={(e) => setEditFormData({ ...editFormData, deliverySlot: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="morning">Morning (Breakfast)</option>
                    <option value="afternoon">Afternoon (Lunch)</option>
                    <option value="evening">Evening (Dinner)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Order Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="placed">Placed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={editFormData.totalAmount}
                    onChange={(e) => setEditFormData({ ...editFormData, totalAmount: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value as any })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase text-[10px]">Delivery Street & Flat</label>
                <input
                  type="text"
                  value={editFormData.street}
                  onChange={(e) => setEditFormData({ ...editFormData, street: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Area</label>
                  <input
                    type="text"
                    value={editFormData.area}
                    onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Assign Rider</label>
                  <select
                    value={editFormData.deliveryBoyId}
                    onChange={(e) => setEditFormData({ ...editFormData, deliveryBoyId: e.target.value })}
                    className="w-full mt-1 px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold outline-none"
                  >
                    <option value="">-- No Rider --</option>
                    {riders.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 uppercase text-[10px]">Special Instructions</label>
                <input
                  type="text"
                  value={editFormData.specialInstructions}
                  onChange={(e) => setEditFormData({ ...editFormData, specialInstructions: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. DELETE CONFIRMATION MODAL */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">Delete Order?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to delete order <strong className="text-slate-800 dark:text-slate-200">#{deletingOrder.orderNumber}</strong> for {deletingOrder.customerName}?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingOrder(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. ORDER DETAIL MODAL */}
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
                <a href={`tel:${selectedOrder.customerPhone}`} className="text-emerald-600 hover:underline">
                  {selectedOrder.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                <span>
                  {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.area}, {selectedOrder.deliveryAddress?.pincode}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Meal Items</span>
              {selectedOrder.items.map((it, i) => (
                <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-medium space-y-1">
                  <div className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-bold">₹{it.price * it.quantity}</span>
                  </div>
                  {it.sabjis && it.sabjis.length > 0 && (
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">
                      Sabji: {it.sabjis.join(', ')}
                    </div>
                  )}
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
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
