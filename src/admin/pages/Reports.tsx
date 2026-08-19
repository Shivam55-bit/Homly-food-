import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToast } from '../../store/slices/uiSlice';
import { 
  BarChart3, 
  Download, 
  Printer, 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Percent, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const PNL_MONTHLY_DATA = [
  { month: 'Apr', revenue: 280000, cogs: 120000, opex: 65000, profit: 95000 },
  { month: 'May', revenue: 320000, cogs: 135000, opex: 72000, profit: 113000 },
  { month: 'Jun', revenue: 360000, cogs: 148000, opex: 78000, profit: 134000 },
  { month: 'Jul', revenue: 410000, cogs: 165000, opex: 85000, profit: 160000 },
  { month: 'Aug', revenue: 465000, cogs: 182000, opex: 92000, profit: 191000 }
];

export const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.payments.transactions);
  const expenses = useAppSelector((state) => state.expenses.expenses);

  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  const grossSales = 465000;
  const costOfGoods = 182000;
  const operatingExpenses = 92000;
  const netProfit = grossSales - costOfGoods - operatingExpenses;
  const profitMargin = ((netProfit / grossSales) * 100).toFixed(1);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Amount (INR)\n"
      + `Gross Revenue,${grossSales}\n`
      + `Cost of Ingredients,${costOfGoods}\n`
      + `Operating Expenses,${operatingExpenses}\n`
      + `Net Operating Profit,${netProfit}\n`
      + `Profit Margin,${profitMargin}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `homly_food_financial_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch(
      addToast({
        type: 'success',
        title: 'Report Exported',
        message: 'Financial summary CSV downloaded.'
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Financial & Operational Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Profit & Loss statements, gross meal margins, sales velocity, and customer retention metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl max-w-xs text-xs">
        {[
          { id: 'month', label: 'August (MTD)' },
          { id: 'quarter', label: 'Q2 FY2026' },
          { id: 'year', label: 'Full Year' }
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setDateRange(r.id as any)}
            className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all ${
              dateRange === r.id
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 1. Profit & Loss Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{grossSales.toLocaleString('en-IN')}</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Cost of Ingredients (COGS)</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">₹{costOfGoods.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 block mt-2">39.1% of total revenue</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Kitchen & Logistics Opex</span>
          <div className="text-2xl font-black text-amber-500 mt-1">₹{operatingExpenses.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 block mt-2">Salaries, fuel, packaging, gas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Operating Profit</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{netProfit.toLocaleString('en-IN')}</div>
          <div className="flex items-center gap-1 text-[11px] font-black text-emerald-600 mt-2">
            <Percent className="w-3.5 h-3.5" />
            <span>{profitMargin}% Net Margin</span>
          </div>
        </div>
      </div>

      {/* 2. Profit & Loss Multi-Month Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              5-Month Revenue vs Costs vs Net Profit (₹)
            </h3>
            <p className="text-xs text-slate-400">Monthly fiscal trajectory and operating efficiency</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PNL_MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Gross Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cogs" name="Ingredients COGS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Detailed P&L Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white">
          Formal Profit & Loss Statement (August 2026)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Financial Line Item</th>
                <th className="p-3 text-right">Amount (INR)</th>
                <th className="p-3 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-900 dark:text-white">Total Gross Revenue (Subscriptions + Daily)</td>
                <td className="p-3 text-right font-black text-slate-900 dark:text-white">₹465,000</td>
                <td className="p-3 text-right">100.0%</td>
              </tr>
              <tr className="text-rose-600 dark:text-rose-400">
                <td className="p-3 pl-6">Less: Cost of Raw Ingredients (Atta, Dal, Dairy, Veggies)</td>
                <td className="p-3 text-right">-₹182,000</td>
                <td className="p-3 text-right">39.1%</td>
              </tr>
              <tr className="font-bold bg-slate-50/50 dark:bg-slate-800/40">
                <td className="p-3">Gross Kitchen Profit</td>
                <td className="p-3 text-right text-emerald-600">₹283,000</td>
                <td className="p-3 text-right">60.9%</td>
              </tr>
              <tr className="text-slate-600 dark:text-slate-400">
                <td className="p-3 pl-6">Less: Packaging Supplies (Insulated meal trays & seals)</td>
                <td className="p-3 text-right">-₹28,000</td>
                <td className="p-3 text-right">6.0%</td>
              </tr>
              <tr className="text-slate-600 dark:text-slate-400">
                <td className="p-3 pl-6">Less: Kitchen Staff & Chef Wages</td>
                <td className="p-3 text-right">-₹38,000</td>
                <td className="p-3 text-right">8.2%</td>
              </tr>
              <tr className="text-slate-600 dark:text-slate-400">
                <td className="p-3 pl-6">Less: Rider Delivery Fleet & Fuel Allowances</td>
                <td className="p-3 text-right">-₹16,000</td>
                <td className="p-3 text-right">3.4%</td>
              </tr>
              <tr className="text-slate-600 dark:text-slate-400">
                <td className="p-3 pl-6">Less: Kitchen Utilities (Commercial Gas & Electricity)</td>
                <td className="p-3 text-right">-₹10,000</td>
                <td className="p-3 text-right">2.1%</td>
              </tr>
              <tr className="font-black text-sm bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200">
                <td className="p-3.5">Net Operating Profit Before Tax (EBITDA)</td>
                <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">₹191,000</td>
                <td className="p-3.5 text-right font-black">41.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
