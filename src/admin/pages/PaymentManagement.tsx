import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactions, updateTransactionStatus } from '../../store/slices/paymentSlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { InvoiceDownloadModal } from '../../customer/components/InvoiceDownloadModal';
import { PaymentTransaction, PaymentStatus } from '../../types';
import { 
  CreditCard, 
  Search, 
  IndianRupee, 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowDownLeft,
  Smartphone
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, filterStatus, searchQuery } = useAppSelector((state) => state.payments);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [selectedTxForInvoice, setSelectedTxForInvoice] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.customerPhone.includes(search);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (tx: PaymentTransaction) => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Payment Reminder Sent',
        message: `WhatsApp payment link sent to ${tx.customerName} (${tx.customerPhone}).`
      })
    );
  };

  const handleMarkAsPaid = (txId: string) => {
    dispatch(updateTransactionStatus({ id: txId, status: 'paid' }));
    dispatch(addToast({ type: 'success', title: 'Payment Marked Paid', message: 'Transaction status updated.' }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Payments, Billing & Invoicing</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track online payments, UPI transactions, cash on delivery reconciliation, and GST tax invoices.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Collected</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400">All successful payments</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Payments</span>
            <div className="text-2xl font-black text-amber-500 mt-1">₹{pendingAmount.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400">COD & unverified dues</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Invoices</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{transactions.length}</div>
            <span className="text-[11px] text-slate-400">Digital GST compliant invoices</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Txn ID, customer name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'paid', 'pending', 'failed', 'refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Payment Mode</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {tx.transactionId}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {tx.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400">{tx.customerPhone}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="capitalize px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3.5 uppercase font-bold text-slate-700 dark:text-slate-300">
                    {tx.paymentMethod}
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white text-sm">
                    ₹{tx.amount}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleSendReminder(tx)}
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 flex items-center gap-1 font-bold text-[11px]"
                            title="Send WhatsApp Payment Link"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Remind</span>
                          </button>
                          <button
                            onClick={() => handleMarkAsPaid(tx.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1 font-bold text-[11px]"
                            title="Mark Collected"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Paid</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedTxForInvoice(tx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Print / View Invoice"
                      >
                        <FileText className="w-4 h-4 text-orange-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      <InvoiceDownloadModal
        isOpen={!!selectedTxForInvoice}
        onClose={() => setSelectedTxForInvoice(null)}
        transaction={selectedTxForInvoice}
      />
    </div>
  );
};
