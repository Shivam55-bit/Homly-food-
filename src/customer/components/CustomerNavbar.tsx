import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setDietaryFilter, setSearchQuery } from '../../store/slices/menuSlice';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  ChevronDown, 
  Wallet, 
  User as UserIcon,
  Leaf,
  Bell
} from 'lucide-react';

export const CustomerNavbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.orders.cart);
  const selectedDietary = useAppSelector((state) => state.menu.selectedDietaryType);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  const defaultAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];
  const totalCartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Location */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl tracking-tighter">H</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-lg text-slate-800 tracking-tight block leading-tight">
                  Homly<span className="text-orange-500">Food</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Fresh Daily Tiffins
                </span>
              </div>
            </Link>

            {/* Address Selector */}
            <div className="relative">
              <button
                onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100/70 text-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span className="truncate max-w-[130px] sm:max-w-[190px]">
                  {defaultAddress ? `${defaultAddress.label} • ${defaultAddress.area}` : 'Indiranagar, Bangalore'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {addressDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    Select Delivery Address
                  </div>
                  <div className="space-y-1.5">
                    {currentUser?.addresses?.map((addr) => (
                      <button
                        key={addr.id}
                        onClick={() => setAddressDropdownOpen(false)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-orange-50/70 border border-transparent hover:border-orange-200 transition-all flex items-start gap-2.5"
                      >
                        <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                            {addr.label}
                            {addr.isDefault && (
                              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {addr.street}, {addr.area}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setAddressDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full mt-2 text-center text-xs font-bold text-orange-600 hover:text-orange-700 py-1.5 bg-orange-50/50 rounded-lg hover:bg-orange-100/50 transition-colors"
                  >
                    + Add or Edit Addresses
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Pure Veg Quick Toggle */}
            <button
              onClick={() => dispatch(setDietaryFilter(selectedDietary === 'veg' ? 'all' : 'veg'))}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                selectedDietary === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle Pure Veg Only Filter"
            >
              <Leaf className="w-3 h-3" />
              <span className="hidden sm:inline">Pure Veg</span>
            </button>

            {/* Wallet pill */}
            <Link
              to="/profile"
              className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Wallet className="w-3 h-3 text-amber-600" />
              <span>₹{currentUser?.walletBalance || 450}</span>
            </Link>

            {/* Cart / Order CTA */}
            <Link
              to="/order"
              className="relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white p-2 rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center"
              title="Your Tiffin Cart & Orders"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
