import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProfile, logoutUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { DietaryType, Address } from '../../types';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Wallet, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Leaf, 
  Edit3, 
  Check, 
  Bell, 
  HelpCircle,
  Clock
} from 'lucide-react';

export const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'aarav.sharma@example.com');
  const [dietary, setDietary] = useState<DietaryType>(currentUser?.dietaryPreference || 'veg');

  // Add Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: 'Home' as 'Home' | 'Work' | 'Other',
    street: '',
    area: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038'
  });

  const handleSaveProfile = () => {
    dispatch(updateProfile({ name, email, dietaryPreference: dietary }));
    setIsEditing(false);
    dispatch(addToast({ type: 'success', title: 'Profile Updated', message: 'Your preferences have been saved.' }));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.area) return;

    const currentAddresses = currentUser?.addresses || [];
    const newAddressObj: Address = {
      id: `addr-${Date.now()}`,
      label: newAddr.label,
      street: newAddr.street,
      area: newAddr.area,
      city: newAddr.city,
      pincode: newAddr.pincode,
      isDefault: currentAddresses.length === 0
    };

    dispatch(updateProfile({ addresses: [...currentAddresses, newAddressObj] }));
    setShowAddressModal(false);
    setNewAddr({ label: 'Home', street: '', area: 'Indiranagar', city: 'Bangalore', pincode: '560038' });
    dispatch(addToast({ type: 'success', title: 'Address Added', message: 'New address saved to your address book.' }));
  };

  const handleAddWalletCredits = (amount: number) => {
    const newBal = (currentUser?.walletBalance || 0) + amount;
    dispatch(updateProfile({ walletBalance: newBal }));
    dispatch(addToast({ type: 'success', title: 'Wallet Recharged!', message: `₹${amount} added. New Balance: ₹${newBal}` }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(addToast({ type: 'info', title: 'Logged Out', message: 'You have been safely logged out.' }));
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser?.name}
                className="w-18 h-18 rounded-2xl object-cover border-4 border-orange-100 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" title="Verified Customer" />
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-bold"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-black text-slate-900">{currentUser?.name || 'Aarav Sharma'}</h1>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.phone || '+91 98765 43210'}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentUser?.email || 'aarav.sharma@example.com'}</span>
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Wallet & Tiffin Pass Balance */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">
              Homly Food Wallet
            </span>
            <div className="text-2xl font-black">₹{currentUser?.walletBalance || 450}</div>
            <span className="text-[11px] text-amber-100">Used automatically on daily checkouts</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddWalletCredits(500)}
            className="bg-white text-orange-700 hover:bg-orange-50 font-black text-xs px-3 py-2 rounded-xl shadow-xs transition-transform active:scale-95"
          >
            +₹500
          </button>
          <button
            onClick={() => handleAddWalletCredits(1000)}
            className="bg-orange-950/40 hover:bg-orange-950/60 text-white font-bold text-xs px-3 py-2 rounded-xl border border-white/20 transition-transform active:scale-95"
          >
            +₹1000
          </button>
        </div>
      </div>

      {/* 3. Dietary Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Dietary Preference</span>
        </span>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'veg', label: 'Pure Veg', desc: 'No eggs, no meat' },
            { id: 'non-veg', label: 'Non-Veg', desc: 'Chicken, Egg & Veg' },
            { id: 'jain', label: 'Jain Satvik', desc: 'No onion, no garlic' }
          ].map((diet) => (
            <button
              key={diet.id}
              onClick={() => {
                setDietary(diet.id as DietaryType);
                dispatch(updateProfile({ dietaryPreference: diet.id as DietaryType }));
                dispatch(addToast({ type: 'info', title: `Meal Preference set to ${diet.label}` }));
              }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                dietary === diet.id
                  ? 'bg-orange-50 border-orange-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-extrabold text-xs text-slate-800">{diet.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{diet.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>Saved Addresses</span>
          </span>
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentUser?.addresses?.map((addr) => (
            <div
              key={addr.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-slate-900">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.2 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Logout & Account Actions */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Homly Account</span>
        </button>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-black text-base text-slate-900 mb-4">Add Delivery Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Address Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Work', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, label: lbl as any })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        newAddr.label === lbl
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Street / Flat / Society
                </label>
                <input
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  placeholder="e.g. Flat 301, Palm Meadows"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Locality / Area
                  </label>
                  <input
                    type="text"
                    value={newAddr.area}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                    placeholder="e.g. Koramangala"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    placeholder="560034"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-md shadow-orange-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
