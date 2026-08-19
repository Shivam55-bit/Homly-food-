import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer,
  setCustomerSearch,
  setCustomerDietaryFilter,
  setSelectedCustomer
} from '../../store/slices/customerSlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { User, DietaryType, Address } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  X, 
  Check, 
  Calendar, 
  Wallet,
  Leaf
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, searchQuery, filterDietary, selectedCustomer } = useAppSelector((state) => state.customers);
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions);
  const orders = useAppSelector((state) => state.orders.orders);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [viewCustomerDrawer, setViewCustomerDrawer] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dietaryPreference: 'veg' as DietaryType,
    walletBalance: 0,
    street: '',
    area: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038'
  });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.addresses && c.addresses.some(a => a.area.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDiet = filterDietary === 'all' || c.dietaryPreference === filterDietary;
    return matchesSearch && matchesDiet;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      dietaryPreference: 'veg',
      walletBalance: 200,
      street: '',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038'
    });
    setEditingCustomer(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (customer: User) => {
    const addr = customer.addresses?.[0];
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      dietaryPreference: customer.dietaryPreference || 'veg',
      walletBalance: customer.walletBalance || 0,
      street: addr?.street || '',
      area: addr?.area || 'Indiranagar',
      city: addr?.city || 'Bangalore',
      pincode: addr?.pincode || '560038'
    });
    setEditingCustomer(customer);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingCustomer) {
      dispatch(
        updateCustomer({
          id: editingCustomer.id,
          updates: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            dietaryPreference: formData.dietaryPreference,
            walletBalance: Number(formData.walletBalance)
          }
        })
      );
      dispatch(addToast({ type: 'success', title: 'Customer Updated', message: `${formData.name}'s profile modified.` }));
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        label: 'Home',
        street: formData.street || '12th Main Road',
        area: formData.area || 'Indiranagar',
        city: formData.city || 'Bangalore',
        pincode: formData.pincode || '560038',
        isDefault: true
      };

      dispatch(
        addCustomer({
          name: formData.name,
          phone: formData.phone.startsWith('+') ? formData.phone : `+91 ${formData.phone}`,
          email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          role: 'customer',
          dietaryPreference: formData.dietaryPreference,
          walletBalance: Number(formData.walletBalance),
          addresses: [newAddress]
        })
      );
      dispatch(addToast({ type: 'success', title: 'Customer Added', message: `${formData.name} added to CRM.` }));
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
      dispatch(deleteCustomer(id));
      dispatch(addToast({ type: 'info', title: 'Customer Removed', message: `${name} has been deleted.` }));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Customer Management & Directory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage subscriber profiles, delivery addresses, and dietary preferences.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setCustomerSearch(e.target.value))}
            placeholder="Search by name, phone, or area..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400">Dietary:</span>
          {['all', 'veg', 'non-veg', 'jain'].map((diet) => (
            <button
              key={diet}
              onClick={() => dispatch(setCustomerDietaryFilter(diet as any))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterDietary === diet
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Dietary Pref</th>
                <th className="p-3.5">Primary Delivery Area</th>
                <th className="p-3.5">Wallet Balance</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map((customer) => {
                const defaultAddr = customer.addresses?.[0];
                return (
                  <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={customer.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block text-sm">
                            {customer.name}
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {customer.dietaryPreference || 'Veg'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                          {defaultAddr ? `${defaultAddr.area}, ${defaultAddr.city}` : 'Indiranagar, Bangalore'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                      ₹{customer.walletBalance || 0}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewCustomerDrawer(customer)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Customer 360 View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(customer)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id, customer.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {editingCustomer ? 'Edit Customer Details' : 'Add New Customer'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aarav@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Dietary Preference
                  </label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as DietaryType })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="jain">Jain Satvik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Wallet Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {!editingCustomer && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    Initial Delivery Address
                  </span>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Street / Flat Details"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Area / Locality"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  {editingCustomer ? 'Save Changes' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer 360 View Drawer */}
      {viewCustomerDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full p-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-base text-slate-900 dark:text-white">Customer 360 Profile</h3>
                <button
                  onClick={() => setViewCustomerDrawer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <img
                  src={viewCustomerDrawer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={viewCustomerDrawer.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">{viewCustomerDrawer.name}</h4>
                  <p className="text-xs text-slate-400">{viewCustomerDrawer.phone}</p>
                  <p className="text-xs text-slate-400">{viewCustomerDrawer.email}</p>
                  <span className="inline-block mt-1 uppercase text-[9px] font-black px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {viewCustomerDrawer.dietaryPreference || 'Veg'}
                  </span>
                </div>
              </div>

              {/* Subscriptions */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-400">Subscription History</span>
                {subscriptions
                  .filter((s) => s.userId === viewCustomerDrawer.id || s.customerPhone === viewCustomerDrawer.phone)
                  .map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{sub.planName}</span>
                        <StatusBadge status={sub.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {sub.daysRemaining} days remaining • Slot: {sub.deliverySlot}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Recent Orders */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-400">Recent Orders</span>
                {orders
                  .filter((o) => o.userId === viewCustomerDrawer.id || o.customerPhone === viewCustomerDrawer.phone)
                  .slice(0, 3)
                  .map((ord) => (
                    <div key={ord.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Order #{ord.orderNumber}</span>
                        <span>₹{ord.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        <StatusBadge status={ord.status} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setViewCustomerDrawer(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 mt-6"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
