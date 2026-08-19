import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { loginUser, registerUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ChefHat, ArrowRight, User, Phone, Mail, MapPin, Leaf, Check } from 'lucide-react';
import { DietaryType } from '../../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dietaryPreference: 'veg' as DietaryType,
    street: '',
    area: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || formData.phone.length < 10) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Missing Fields',
          message: 'Please provide your full name and valid 10-digit phone number.'
        })
      );
      return;
    }

    await dispatch(registerUser(formData));
    dispatch(
      addToast({
        type: 'success',
        title: 'Account Created!',
        message: `Welcome to Homly Food, ${formData.name}!`
      })
    );
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-md mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white shadow-lg shadow-orange-500/20 mb-3">
          <ChefHat className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Join <span className="text-orange-600">Homly Food</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tell us about your taste preferences & delivery address
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-100 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. aarav@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Dietary Preference Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Meal Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'veg', label: 'Pure Veg', color: 'emerald' },
                { id: 'non-veg', label: 'Non-Veg', color: 'rose' },
                { id: 'jain', label: 'Jain Satvik', color: 'amber' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietaryPreference: opt.id as DietaryType })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all ${
                    formData.dietaryPreference === opt.id
                      ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {formData.dietaryPreference === opt.id && (
                    <Check className="w-3 h-3 text-orange-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Delivery Address
            </label>
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Flat No, Building, Street Name"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Area / Locality"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                  required
                />
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-98 cursor-pointer mt-2"
          >
            <span>Register & Start Ordering</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};
