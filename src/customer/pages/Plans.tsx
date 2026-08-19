import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPlans, setSelectedPlan } from '../../store/slices/subscriptionSlice';
import { setCartPlanType } from '../../store/slices/orderSlice';
import { SubscriptionPlan } from '../../types';
import { 
  CalendarClock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

export const Plans: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { plans, activeSubscription } = useAppSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    dispatch(setSelectedPlan(plan));
    dispatch(setCartPlanType(plan.type));
    navigate('/order');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Meal Memberships</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Choose Your Tiffin Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Save up to 30% with zero cancellation hassles. Pause deliveries anytime without losing your credits.
        </p>
      </div>

      {/* Current Active Plan Alert if subscribed */}
      {activeSubscription && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-900 block">
                You have an active plan: {activeSubscription.planName}
              </span>
              <span className="text-[11px] text-emerald-700">
                {activeSubscription.daysRemaining} days remaining • Valid until {activeSubscription.endDate}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/my-subscription')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
          >
            Manage Plan
          </button>
        </div>
      )}

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isSelected = activeSubscription?.planId === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between relative bg-white border ${
                plan.isPopular
                  ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-xl'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                  ★ Most Popular Plan
                </div>
              )}

              <div>
                {/* Plan Title & Duration */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                    <span className="text-xs font-bold text-slate-400 capitalize">{plan.durationDays} Days Pass</span>
                  </div>
                  {plan.discountPercentage > 0 && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                      SAVE {plan.discountPercentage}%
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-4 min-h-[32px]">{plan.description}</p>

                {/* Price Display */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">₹{plan.price}</span>
                    {plan.originalPrice > plan.price && (
                      <span className="text-xs text-slate-400 line-through font-semibold">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    ≈ ₹{Math.round(plan.price / plan.durationDays)} / meal • Free Delivery
                  </span>
                </div>

                {/* Benefits List */}
                <div className="space-y-2.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Plan Benefits
                  </span>
                  {plan.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md cursor-pointer ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white shadow-orange-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isSelected ? 'Renew Plan' : 'Select Plan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Value Proposition Highlights */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-black text-base text-center">
          Why 12,000+ Customers Love Homly Meal Plans
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <RotateCcw className="w-6 h-6 text-orange-400 mb-2" />
            <h4 className="font-bold text-xs">Flexible Pause & Resume</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Traveling or eating out? Pause 12 hours in advance and roll over credits automatically.
            </p>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-amber-400 mb-2" />
            <h4 className="font-bold text-xs">Punctual Hot Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Guaranteed delivery window between 12:15 PM - 1:45 PM for lunch and 7:30 PM - 9:00 PM for dinner.
            </p>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h4 className="font-bold text-xs">Home Quality Standard</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Zero soda, zero preservatives, 100% cold pressed cooking oils, and farm sourced produce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
