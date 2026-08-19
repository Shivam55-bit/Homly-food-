import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserSubscription, resumeSubscriptionDate } from '../../store/slices/subscriptionSlice';
import { addToast } from '../../store/slices/uiSlice';
import { 
  CalendarClock, 
  PauseCircle, 
  PlayCircle, 
  RotateCcw, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const MySubscription: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const activeSub = useAppSelector((state) => state.subscriptions.activeSubscription);
  const allSubs = useAppSelector((state) => state.subscriptions.subscriptions);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserSubscription(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const handleResumeDate = (date: string) => {
    if (!activeSub) return;
    dispatch(resumeSubscriptionDate({ subId: activeSub.id, date }));
    dispatch(addToast({ type: 'success', title: 'Meal Resumed', message: `Delivery resumed for ${date}.` }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-orange-600" />
          <span>My Tiffin Subscription</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your active meal schedule, view paused dates, and renew your pass.
        </p>
      </div>

      {activeSub ? (
        <div className="space-y-5">
          {/* Active Plan Big Card */}
          <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ● {activeSub.status} Subscription
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{activeSub.planName}</h2>
                <p className="text-xs text-slate-500">
                  {activeSub.totalDays} Days Pass • {activeSub.mealTypes.map(m => m.toUpperCase()).join(' + ')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/pause-delivery"
                  className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-orange-200 flex items-center gap-1.5 transition-colors"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Delivery</span>
                </Link>
                <Link
                  to="/order"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Renew</span>
                </Link>
              </div>
            </div>

            {/* Days Remaining Progress */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-slate-700">
                <span>{activeSub.daysRemaining} days remaining</span>
                <span className="text-orange-600">{activeSub.totalDays} Total Days</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                  style={{
                    width: `${Math.max(10, (activeSub.daysRemaining / activeSub.totalDays) * 100)}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Started: {activeSub.startDate}</span>
                <span>Expires: {activeSub.endDate}</span>
              </div>
            </div>

            {/* Delivery Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
                <MapPin className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Delivery Address</span>
                  <p className="text-slate-500 text-[11px]">
                    {activeSub.deliveryAddress.street}, {activeSub.deliveryAddress.area}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Scheduled Time Slot</span>
                  <p className="text-slate-500 text-[11px] capitalize">
                    {activeSub.deliverySlot} Delivery (12:15 PM - 1:45 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paused Dates Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Upcoming Paused Delivery Dates
              </span>
              <span className="text-xs text-slate-400">
                {activeSub.pauseDates.length} days paused
              </span>
            </div>

            {activeSub.pauseDates.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No upcoming paused dates. Your tiffin is scheduled to arrive every day!
              </div>
            ) : (
              <div className="space-y-2">
                {activeSub.pauseDates.map((date) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <PauseCircle className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-bold text-slate-800">
                          {new Date(date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-[10px] text-amber-800 block">Credit rolled over</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleResumeDate(date)}
                      className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Resume Delivery</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <CalendarClock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900">No Active Tiffin Subscription</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Subscribe to a 7-day or 30-day meal pass to enjoy automatic daily deliveries and big savings.
            </p>
          </div>
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md hover:from-orange-700 hover:to-amber-600 transition-all active:scale-95"
          >
            <span>Explore Meal Plans</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
