import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToast } from '../../store/slices/uiSlice';
import { 
  Wallet, 
  IndianRupee, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Building2,
  Send
} from 'lucide-react';

export const VendorEarnings: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('5000');

  const walletBalance = currentUser?.walletBalance || 14200;
  const todaysEarnings = 3850;
  const weeklyEarnings = 24600;
  const commissionDeducted = 2730;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayoutModal(false);
    dispatch(
      addToast({
        type: 'success',
        title: 'Payout Request Submitted! 🏦',
        message: `₹${payoutAmount} will be transferred to your registered bank account in 2 hours.`
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-400" />
            <span>Kitchen Earnings & Payouts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time sales settlements, platform commission cuts, and bank withdrawals.
          </p>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Withdraw Paisa
        </button>
      </div>

      {/* Wallet Balance Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-700 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available Wallet Balance
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Ready for Transfer
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
          ₹{walletBalance.toLocaleString('en-IN')}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-700/80">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Today's Net Sales</span>
            <div className="text-sm font-black text-white mt-0.5">₹{todaysEarnings.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">This Week</span>
            <div className="text-sm font-black text-white mt-0.5">₹{weeklyEarnings.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Platform Fee (10%)</span>
            <div className="text-sm font-black text-rose-400 mt-0.5">-₹{commissionDeducted.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-3">
        <h3 className="font-extrabold text-sm text-white">Recent Settlements to Bank</h3>

        <div className="divide-y divide-slate-800 text-xs">
          {[
            { date: '18 Aug 2026', amount: 8500, status: 'Processing', utr: 'HDFC-8891023' },
            { date: '15 Aug 2026', amount: 12000, status: 'Completed', utr: 'HDFC-7719230' },
            { date: '10 Aug 2026', amount: 9500, status: 'Completed', utr: 'HDFC-6629104' },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Bank Transfer - #{item.utr}</div>
                <span className="text-[10px] text-slate-400">{item.date}</span>
              </div>
              <div className="text-right">
                <div className="font-black text-white text-sm">₹{item.amount.toLocaleString('en-IN')}</div>
                <span
                  className={`text-[10px] font-extrabold ${
                    item.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl space-y-4 text-slate-100">
            <h3 className="font-black text-base text-white">Transfer Earnings to Bank</h3>
            <p className="text-xs text-slate-400">
              Transfer funds instantly to HDFC Bank A/C ending in **4591.
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Enter Amount (₹)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={walletBalance}
                  min={500}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Max available: ₹{walletBalance}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
