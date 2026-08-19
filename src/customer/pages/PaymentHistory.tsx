import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactions } from '../../store/slices/paymentSlice';
import { InvoiceDownloadModal } from '../components/InvoiceDownloadModal';
import { PaymentTransaction } from '../../types';
import { 
  CreditCard, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Receipt,
  Wallet
} from 'lucide-react';

export const PaymentHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.payments.transactions);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Filter transactions for this customer
  const userTransactions = transactions.filter(
    (t) => t.customerPhone === currentUser?.phone || t.customerName === currentUser?.name || t.customerPhone === '+91 98765 43210'
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Receipt className="w-6 h-6 text-orange-600" />
          <span>Payment & Billing History</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View all your meal pass subscriptions, one-time orders, and GST invoices.
        </p>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {userTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Transactions Found</h3>
            <p className="text-xs text-slate-400">All your payments and receipts will be recorded here.</p>
          </div>
        ) : (
          userTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {tx.type === 'subscription' ? 'Tiffin Meal Pass Subscription' : 'Daily Tiffin Box Order'}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.2 rounded-full uppercase ${
                        tx.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tx.transactionId} • {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })} • Mode: <span className="uppercase font-bold">{tx.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-base font-black text-slate-900 block leading-tight">
                    ₹{tx.amount}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Tax Included</span>
                </div>

                <button
                  onClick={() => setSelectedTx(tx)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceDownloadModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};
