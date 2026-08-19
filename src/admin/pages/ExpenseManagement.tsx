import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchExpenses, addExpense, deleteExpense } from '../../store/slices/expenseSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ExpenseItem, ExpenseCategory, PaymentMethod } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Receipt, 
  Plus, 
  Search, 
  Trash2, 
  IndianRupee, 
  Tag, 
  X, 
  Check, 
  FileText, 
  TrendingDown,
  ShoppingBag
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  groceries: '#10b981',
  packaging: '#f59e0b',
  logistics: '#3b82f6',
  utilities: '#8b5cf6',
  salaries: '#ef4444',
  marketing: '#ec4899',
  maintenance: '#64748b'
};

export const ExpenseManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.expenses);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'groceries' as ExpenseCategory,
    amount: 1500,
    date: new Date().toISOString().split('T')[0],
    paidTo: '',
    paymentMethod: 'upi' as PaymentMethod,
    notes: '',
    receiptNumber: `REC-2026-${Math.floor(100 + Math.random() * 900)}`
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || e.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  // Calculate Category breakdown for Chart
  const categoryMap = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoryMap).map((cat) => ({
    name: cat.toUpperCase(),
    value: categoryMap[cat]
  }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    dispatch(
      addExpense({
        ...formData,
        amount: Number(formData.amount)
      })
    );

    setShowModal(false);
    dispatch(addToast({ type: 'success', title: 'Expense Added', message: `₹${formData.amount} recorded under ${formData.category}.` }));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete expense "${title}"?`)) {
      dispatch(deleteExpense(id));
      dispatch(addToast({ type: 'info', title: 'Expense Deleted' }));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>Kitchen & Operational Expense Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log grocery mandis, packaging supplies, staff payouts, logistics fuel, and utilities.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* KPI & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total August Expenses
            </span>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
              ₹{totalExpense.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Combined raw material procurement, staff wages & operations.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Groceries & Dairy:</span>
              <span className="font-bold">₹{categoryMap['groceries'] || 0}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Eco Meal Packaging:</span>
              <span className="font-bold">₹{categoryMap['packaging'] || 0}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Staff & Kitchen Wages:</span>
              <span className="font-bold">₹{categoryMap['salaries'] || 0}</span>
            </div>
          </div>
        </div>

        {/* Expense Category Breakdown Pie Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">Expense Category Distribution</h3>
            <span className="text-xs font-bold text-slate-400">August 2026</span>
          </div>

          <div className="h-48 sm:h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name.toLowerCase()] || '#64748b'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`₹${val}`, 'Amount']}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
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
            placeholder="Search expenses, vendors..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'groceries', 'packaging', 'logistics', 'utilities', 'salaries'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Expense Title & Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Paid To Vendor</th>
                <th className="p-3.5">Mode</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {exp.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {exp.date} • Rec: {exp.receiptNumber || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className="capitalize px-2.5 py-1 rounded-full text-[10px] font-extrabold"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[exp.category]}20`,
                        color: CATEGORY_COLORS[exp.category]
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {exp.paidTo}
                  </td>
                  <td className="p-3.5 uppercase font-bold text-slate-600 dark:text-slate-400">
                    {exp.paymentMethod}
                  </td>
                  <td className="p-3.5 font-black text-rose-600 dark:text-rose-400 text-sm">
                    ₹{exp.amount}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(exp.id, exp.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Record Kitchen Expense</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Expense Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Fresh Tomatoes & Paneer 20kg"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="groceries">Groceries</option>
                    <option value="packaging">Packaging</option>
                    <option value="logistics">Logistics</option>
                    <option value="utilities">Utilities</option>
                    <option value="salaries">Salaries</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Paid To / Vendor</label>
                  <input
                    type="text"
                    value={formData.paidTo}
                    onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                    placeholder="e.g. City Veggies Wholesale"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Payment Mode</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="cod">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Receipt / Invoice Ref</label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
