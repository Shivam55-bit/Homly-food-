import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchRiders, addRider } from '../../store/slices/deliverySlice';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { DeliveryPersonnel, Order, OrderStatus, DeliverySlot } from '../../types';
import { 
  Truck, 
  Plus, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Search, 
  X, 
  Star, 
  Navigation,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export const DeliveryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const riders = useAppSelector((state) => state.delivery.riders);
  const orders = useAppSelector((state) => state.orders.orders);

  const [activeTab, setActiveTab] = useState<'fleet' | 'dispatches'>('dispatches');
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | 'all'>('afternoon');
  const [showRiderModal, setShowRiderModal] = useState(false);

  // New Rider Form
  const [riderForm, setRiderForm] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
    vehicleType: 'Bike' as 'Bike' | 'Scooter' | 'Van',
    assignedArea: 'Indiranagar / Domlur',
    status: 'active' as 'active' | 'busy' | 'offline'
  });

  useEffect(() => {
    dispatch(fetchRiders());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((o) => {
    if (selectedSlot === 'all') return true;
    return o.deliverySlot === selectedSlot;
  });

  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderForm.name || !riderForm.phone) return;

    dispatch(
      addRider({
        name: riderForm.name,
        phone: riderForm.phone,
        vehicleNumber: riderForm.vehicleNumber || 'KA 01 EK 0000',
        vehicleType: riderForm.vehicleType,
        assignedArea: riderForm.assignedArea,
        status: riderForm.status,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      })
    );

    setShowRiderModal(false);
    dispatch(addToast({ type: 'success', title: 'Delivery Partner Added', message: `${riderForm.name} added to fleet.` }));
  };

  const handleAssignRider = (orderId: string, riderId: string) => {
    dispatch(updateOrderStatus({ orderId, status: 'out_for_delivery', riderId }));
    dispatch(addToast({ type: 'success', title: 'Rider Dispatched', message: 'Delivery status updated.' }));
  };

  const handleBatchDispatch = () => {
    const undispatched = filteredOrders.filter(o => o.status === 'preparing' || o.status === 'placed');
    undispatched.forEach((o, i) => {
      const assignedRider = riders[i % riders.length];
      dispatch(updateOrderStatus({ orderId: o.id, status: 'out_for_delivery', riderId: assignedRider.id }));
    });

    dispatch(
      addToast({
        type: 'success',
        title: 'Batch Dispatched!',
        message: `Dispatched ${undispatched.length} meals for ${selectedSlot} delivery slot.`
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-600" />
            <span>Delivery Management & Route Fleet</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time delivery route tracking, rider assignments, and slot batch dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRiderModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Partner</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('dispatches')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'dispatches'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Daily Dispatch Board ({orders.length} deliveries)
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'fleet'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Fleet Riders Directory ({riders.length} Active)
        </button>
      </div>

      {activeTab === 'dispatches' ? (
        <div className="space-y-4">
          {/* Slot filter and Batch Dispatch Button */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Delivery Slot:</span>
              {['morning', 'afternoon', 'evening', 'all'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              onClick={handleBatchDispatch}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark All {selectedSlot.toUpperCase()} Dispatched</span>
            </button>
          </div>

          {/* Dispatch Board Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Order #</th>
                    <th className="p-3.5">Customer & Phone</th>
                    <th className="p-3.5">Delivery Route / Address</th>
                    <th className="p-3.5">Slot Time</th>
                    <th className="p-3.5">Assigned Rider</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">{order.customerPhone}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-start gap-1.5 max-w-[200px]">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 truncate">
                            {order.deliveryAddress.street}, {order.deliveryAddress.area}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {order.deliverySlot} (12:30 PM)
                      </td>
                      <td className="p-3.5">
                        <select
                          value={order.deliveryBoyId || ''}
                          onChange={(e) => handleAssignRider(order.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none"
                        >
                          <option value="">-- Select Rider --</option>
                          {riders.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.vehicleType})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Fleet Riders Directory */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {riders.map((rider) => (
            <div
              key={rider.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rider.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={rider.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{rider.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{rider.rating} Rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rider.vehicleNumber} ({rider.vehicleType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span className="truncate">{rider.assignedArea}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400">
                  {rider.currentOrdersCount} Active Deliveries
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {rider.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rider Modal */}
      {showRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Add Delivery Partner</h3>
              <button
                onClick={() => setShowRiderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRider} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Rider Full Name</label>
                <input
                  type="text"
                  value={riderForm.name}
                  onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={riderForm.phone}
                  onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                  placeholder="+91 98800 12345"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vehicle Type</label>
                  <select
                    value={riderForm.vehicleType}
                    onChange={(e) => setRiderForm({ ...riderForm, vehicleType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Bike">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Van">Electric Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={riderForm.vehicleNumber}
                    onChange={(e) => setRiderForm({ ...riderForm, vehicleNumber: e.target.value })}
                    placeholder="KA 03 HM 4521"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assigned Route / Area</label>
                <input
                  type="text"
                  value={riderForm.assignedArea}
                  onChange={(e) => setRiderForm({ ...riderForm, assignedArea: e.target.value })}
                  placeholder="Indiranagar / Domlur / HAL"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRiderModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  Add Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
