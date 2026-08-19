import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ChefHat, Smartphone, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Invalid Phone Number',
          message: 'Please enter a valid 10-digit mobile number.'
        })
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/otp-verify', { state: { phone: phoneNumber } });
      dispatch(
        addToast({
          type: 'info',
          title: 'OTP Sent',
          message: `Verification code sent to +91 ${phoneNumber}`
        })
      );
    }, 400);
  };

  const handleQuickDemoLogin = (type: 'customer' | 'vendor' | 'admin') => {
    if (type === 'customer') {
      dispatch(loginUser('+91 98765 43210'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Logged in as Aarav Sharma (Customer)',
          message: 'Welcome back to Homly Food customer app!'
        })
      );
      navigate('/');
    } else if (type === 'vendor') {
      dispatch(loginUser('sharmaji.kitchen@example.com'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Logged in as Sharma Ji Rasoi (Vendor)',
          message: 'Redirecting to Vendor Kitchen Hub & Packing Station...'
        })
      );
      navigate('/vendor/kitchen-hub');
    } else {
      dispatch(loginUser('admin@homlyfood.com'));
      dispatch(
        addToast({
          type: 'success',
          title: 'Logged in as Master Super Admin',
          message: 'Redirecting to Super Admin CRM portal...'
        })
      );
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-md mx-auto px-4 py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white shadow-xl shadow-orange-500/25 mb-4 animate-pulse-subtle">
          <ChefHat className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to <span className="text-orange-600">Homly Food</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Wholesome, home-style daily tiffin deliveries & multi-kitchen partner platform.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500"></div>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 text-slate-500 font-bold text-sm border-r border-slate-200 pr-2.5">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10-digit number"
                className="w-full pl-24 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              We'll send a 6-digit OTP for instant role verification
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phoneNumber.length < 10}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Get OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick 1-Click Role Logins
          </span>
        </div>

        {/* 3 Role Demo Logins: Customer, Vendor, Super Admin */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span>Customer App</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vendor')}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl border border-amber-300 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              <span>Vendor / Kitchen</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin')}
            className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Master Super Admin Portal</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-orange-600 hover:underline">
              Register New Account
            </Link>
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>100% Secure FSSAI Certified Kitchens • No Spam Guarantee</span>
      </div>
    </div>
  );
};
