import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUserSubscription, pauseSubscriptionDates, resumeSubscriptionDate } from '../../store/slices/subscriptionSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MealType } from '../../types';
import { 
  Calendar as CalendarIcon, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Info,
  ShieldCheck
} from 'lucide-react';

export const PauseDelivery: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const activeSub = useAppSelector((state) => state.subscriptions.activeSubscription);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserSubscription(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  // Current calendar month view state
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [pauseSlot, setPauseSlot] = useState<string>('all');
  const [pauseReason, setPauseReason] = useState<string>('Vacation / Traveling');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper calendar date generator
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = '2026-08-18';

  const toggleDateSelection = (dateStr: string) => {
    if (dateStr < todayStr) return; // cannot pause past dates

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleConfirmPause = () => {
    if (!activeSub) {
      dispatch(addToast({ type: 'warning', title: 'No active subscription found' }));
      return;
    }
    if (selectedDates.length === 0) {
      dispatch(addToast({ type: 'warning', title: 'Select at least 1 date to pause' }));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      dispatch(pauseSubscriptionDates({ subId: activeSub.id, dates: selectedDates }));
      setIsSubmitting(false);
      dispatch(
        addToast({
          type: 'success',
          title: 'Deliveries Paused Successfully',
          message: `${selectedDates.length} days paused. Credits rolled over to next month.`
        })
      );
      navigate('/my-subscription');
    }, 400);
  };

  const handleResumeSingleDate = (dateStr: string) => {
    if (!activeSub) return;
    dispatch(resumeSubscriptionDate({ subId: activeSub.id, date: dateStr }));
    dispatch(addToast({ type: 'info', title: `Delivery Resumed for ${dateStr}` }));
  };

  const alreadyPausedDates = activeSub?.pauseDates || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <PauseCircle className="w-6 h-6 text-orange-600" />
          <span>Pause / Resume Tiffin Delivery</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select dates you are away. Your meals roll over automatically with zero deduction.
        </p>
      </div>

      {/* Info notice */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">12-Hour Pause Rule</span>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            Please pause morning breakfast/lunch before <strong>10:00 PM</strong> of the previous day, and dinner before <strong>12:00 PM</strong> of the same day.
          </p>
        </div>
      </div>

      {/* Interactive Calendar Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        {/* Month Navigator */}
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-orange-600" />
            <span>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
          </h2>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month starts */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} className="h-11 rounded-xl"></div>
          ))}

          {/* Days in Month */}
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNum = i + 1;
            const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
            const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;
            const isAlreadyPaused = alreadyPausedDates.includes(dateStr);
            const isSelected = selectedDates.includes(dateStr);

            let bgClass = 'bg-slate-50 text-slate-700 hover:bg-orange-50/70 border-slate-200';
            if (isPast) {
              bgClass = 'bg-slate-100/50 text-slate-300 border-transparent cursor-not-allowed';
            } else if (isAlreadyPaused) {
              bgClass = 'bg-amber-100 border-amber-400 text-amber-900 font-bold';
            } else if (isSelected) {
              bgClass = 'bg-orange-600 text-white font-black border-orange-600 shadow-md scale-105';
            } else if (isToday) {
              bgClass = 'bg-emerald-50 text-emerald-900 border-emerald-400 font-extrabold';
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={() => {
                  if (isAlreadyPaused) {
                    handleResumeSingleDate(dateStr);
                  } else {
                    toggleDateSelection(dateStr);
                  }
                }}
                className={`h-11 rounded-2xl border text-xs flex flex-col items-center justify-center transition-all relative ${bgClass}`}
              >
                <span>{dayNum}</span>
                {isAlreadyPaused && (
                  <span className="text-[8px] uppercase font-bold text-amber-800">Paused</span>
                )}
                {isSelected && (
                  <span className="text-[8px] uppercase font-bold text-orange-200">Selected</span>
                )}
                {isToday && !isAlreadyPaused && !isSelected && (
                  <span className="text-[8px] uppercase font-bold text-emerald-600">Today</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400"></div>
            <span>Scheduled Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400"></div>
            <span>Already Paused</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md bg-orange-600"></div>
            <span>New Pause Selection</span>
          </div>
        </div>
      </div>

      {/* Pause Options Form */}
      {selectedDates.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Pause Details ({selectedDates.length} Days Selected)
              </h3>
              <p className="text-xs text-slate-500">
                Selected: {selectedDates.join(', ')}
              </p>
            </div>
            <span className="bg-orange-100 text-orange-700 font-bold text-xs px-2.5 py-1 rounded-full">
              +{selectedDates.length} Days Credit Rollover
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Meal Slot to Pause
              </label>
              <select
                value={pauseSlot}
                onChange={(e) => setPauseSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value="all">Full Day (All Meals)</option>
                <option value="lunch">Lunch Only</option>
                <option value="dinner">Dinner Only</option>
                <option value="breakfast">Breakfast Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Reason for Pause
              </label>
              <select
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value="Vacation / Traveling">Vacation / Traveling</option>
                <option value="Fasting / Religious Vrat">Fasting / Religious Vrat</option>
                <option value="Dining out with Friends / Family">Dining out with Friends / Family</option>
                <option value="Working from Office with Cafeteria">Working from Office with Cafeteria</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Notes for Kitchen (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Back in town on 25th August"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
            />
          </div>

          <button
            onClick={handleConfirmPause}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Pause for {selectedDates.length} Days</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
