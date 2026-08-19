import React, { useEffect, useState } from 'react';
import { Vendor } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVendors, addVendor, updateVendor } from '../../store/slices/vendorSlice';
import { addToast } from '../../store/slices/uiSlice';
import { 
  Building2, 
  Search, 
  Plus, 
  Star, 
  Phone, 
  MapPin, 
  ChefHat, 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck,
  X,
  Users,
  Utensils
} from 'lucide-react';

export const VendorManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vendors, isLoading } = useAppSelector((state) => state.vendors);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  // New Vendor Form
  const [formData, setFormData] = useState({
    kitchenName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    city: 'Bangalore',
    fssaiLicense: `FSSAI-2026-${Math.floor(1000000 + Math.random() * 9000000)}`,
    commissionPercentage: 10,
    speciality: 'North Indian Thalis, Dal Makhani'
  });

  const filteredVendors = vendors.filter((v) => {
    return v.kitchenName.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      v.area.toLowerCase().includes(search.toLowerCase());
  });

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVendorPayload: Partial<Vendor> = {
      kitchenName: formData.kitchenName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      area: formData.area,
      city: formData.city,
      fssaiLicense: formData.fssaiLicense,
      commissionPercentage: Number(formData.commissionPercentage),
      speciality: formData.speciality.split(',').map((s) => s.trim())
    };

    await dispatch(addVendor(newVendorPayload));
    setShowAddModal(false);
    dispatch(
      addToast({
        type: 'success',
        title: 'Kitchen Vendor Onboarded! 👨‍🍳',
        message: `${formData.kitchenName} is now active and can start receiving tiffin orders.`
      })
    );
  };

  const handleToggleStatus = (vendor: Vendor) => {
    const nextStatus = vendor.status === 'active' ? 'suspended' : 'active';
    dispatch(updateVendor({ id: vendor.id, updates: { status: nextStatus } }));
    dispatch(
      addToast({
        type: 'info',
        title: `Vendor ${nextStatus === 'active' ? 'Activated' : 'Suspended'}`,
        message: `${vendor.kitchenName} status updated to ${nextStatus}.`
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <span>Kitchen Vendors & Mess Partners</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Super Admin Portal: Manage cloud kitchens, tiffin suppliers, commission cuts, and food licenses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Vendor</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Active Kitchens</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {vendors.filter((v) => v.status === 'active').length}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">100% verified partners</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Combined Subscribers</span>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {vendors.reduce((sum, v) => sum + (v.activeSubscribers || 0), 0)}
            </div>
            <span className="text-[11px] text-slate-400">Across all kitchen hubs</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Today's Vendor Sales</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              ₹{vendors.reduce((sum, v) => sum + (v.todaysEarnings || 0), 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-400">Platform cut: 10%</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-black">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kitchen name, owner, area..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Vendors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  {vendor.kitchenName}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  Owner: {vendor.ownerName}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                  vendor.status === 'active'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                }`}
              >
                {vendor.status}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Rating</span>
                <span className="text-xs font-black text-amber-500 flex items-center justify-center gap-0.5 mt-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {vendor.rating}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Orders</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {vendor.totalOrdersCompleted}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Commission</span>
                <span className="text-xs font-black text-emerald-600 mt-0.5 block">
                  {vendor.commissionPercentage}%
                </span>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{vendor.area}, {vendor.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate font-mono">{vendor.fssaiLicense}</span>
              </div>
            </div>

            {/* Speciality Pills */}
            <div className="flex flex-wrap gap-1 pt-1">
              {vendor.speciality.map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] font-bold border border-orange-200 dark:border-orange-900/50"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Toggle Status Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-slate-400">
                Active Subscribers: <strong className="text-slate-700 dark:text-slate-300">{vendor.activeSubscribers}</strong>
              </span>
              <button
                onClick={() => handleToggleStatus(vendor)}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  vendor.status === 'active'
                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                }`}
              >
                {vendor.status === 'active' ? 'Suspend Kitchen' : 'Activate Kitchen'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ChefHat className="w-5 h-5" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Onboard Kitchen / Vendor
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Kitchen / Mess Name</label>
                  <input
                    type="text"
                    required
                    value={formData.kitchenName}
                    onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                    placeholder="e.g. Radhe Krishna Bhojnalaya"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Owner Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Radheshyam Gupta"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kitchen@example.com"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Kitchen Address & Area</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value, area: e.target.value.split(',')[0] || 'Indiranagar' })}
                  placeholder="Plot No, Street, Landmark, Area"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">FSSAI License No.</label>
                  <input
                    type="text"
                    value={formData.fssaiLicense}
                    onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                    placeholder="FSSAI-2026-XXXX"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Platform Cut (%)</label>
                  <input
                    type="number"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Food Specialities (Comma separated)</label>
                <input
                  type="text"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  placeholder="North Indian, Gujarati Kadhi, Satvik Thali"
                  className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Save & Onboard Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
