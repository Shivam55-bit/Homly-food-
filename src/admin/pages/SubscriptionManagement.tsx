import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAllSubscriptions, fetchPlans } from '../../store/slices/subscriptionSlice';
import { addToast } from '../../store/slices/uiSlice';
import { StatusBadge } from '../components/StatusBadge';
import { UserSubscription, SubscriptionPlan } from '../../types';
import { 
  CalendarClock, 
  Search, 
  Plus, 
  PauseCircle, 
  PlayCircle, 
  RotateCcw, 
  X, 
  Check, 
  Edit3, 
  Tag, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const SubscriptionManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { subscriptions, plans } = useAppSelector((state) => state.subscriptions);

  const [activeTab, setActiveTab] = useState<'active' | 'expired' | 'plans'>('active');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllSubscriptions());
    dispatch(fetchPlans());
  }, [dispatch]);

  const activeSubs = subscriptions.filter((s) => s.status === 'active' || s.status === 'paused');
  const expiredSubs = subscriptions.filter((s) => s.status === 'expired' || s.status === 'pending');

  const filteredSubs = (activeTab === 'active' ? activeSubs : expiredSubs).filter((s) =>
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    s.customerPhone.includes(search) ||
    s.planName.toLowerCase().includes(search.toLowerCase())
  );

  const handleExtendDays = (subId: string, daysToAdd = 7) => {
    dispatch(
      addToast({
        type: 'success',
        title: 'Subscription Extended',
        message: `Added +${daysToAdd} days to subscription.`
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-emerald-600" />
            <span>Subscription Lifecycle Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor active tiffin passes, pause histories, renewals, and plan pricing.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'active', label: `Active Passes (${activeSubs.length})` },
          { id: 'expired', label: `Expired / Inactive (${expiredSubs.length})` },
          { id: 'plans', label: `Plan Configurations (${plans.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'plans' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriber name, phone..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Plan Name</th>
                    <th className="p-3.5">Duration & Validity</th>
                    <th className="p-3.5">Days Remaining</th>
                    <th className="p-3.5">Paused Dates</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {sub.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">{sub.customerPhone}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">
                        {sub.planName}
                        <span className="text-[10px] text-slate-400 block uppercase font-normal">
                          {sub.mealTypes.join(' + ')} • {sub.deliverySlot}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                        <div>{sub.startDate} to {sub.endDate}</div>
                        <span className="text-[10px] text-slate-400 font-bold">({sub.totalDays} Days Pass)</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {sub.daysRemaining}
                          </span>
                          <span className="text-[10px] text-slate-400">days left</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        {sub.pauseDates && sub.pauseDates.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {sub.pauseDates.map((pd, i) => (
                              <span key={i} className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded">
                                {pd.split('-').slice(1).join('/')}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleExtendDays(sub.id, 7)}
                            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors"
                          >
                            +7 Days
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Plan Configurations Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{plan.name}</h3>
                  <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                    {plan.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>

                <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl my-3">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Validity: {plan.durationDays} Days • Max Pause: {plan.maxPauseDays} Days
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block">Included Benefits</span>
                  {plan.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => dispatch(addToast({ type: 'info', title: 'Plan Editor', message: `Editing ${plan.name}` }))}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Plan Pricing & Rules</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
