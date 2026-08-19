import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMenuItems } from '../../store/slices/menuSlice';
import { fetchPlans, fetchUserSubscription } from '../../store/slices/subscriptionSlice';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { MealCard } from '../components/MealCard';
import { PwaInstallBanner } from '../components/PwaInstallBanner';
import { DietaryBadge } from '../components/DietaryBadge';
import { 
  Sparkles, 
  CalendarClock, 
  ArrowRight, 
  Tag, 
  Star, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  PauseCircle, 
  PlayCircle,
  Truck,
  HeartHandshake
} from 'lucide-react';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const menuItems = useAppSelector((state) => state.menu.items);
  const activeSubscription = useAppSelector((state) => state.subscriptions.activeSubscription);
  const userOrders = useAppSelector((state) => state.orders.userOrders);
  const selectedDietary = useAppSelector((state) => state.menu.selectedDietaryType);

  const [activeMealTab, setActiveMealTab] = useState<'lunch' | 'dinner' | 'breakfast'>('lunch');

  useEffect(() => {
    dispatch(fetchMenuItems());
    dispatch(fetchPlans());
    if (currentUser?.id) {
      dispatch(fetchUserSubscription(currentUser.id));
      dispatch(fetchUserOrders(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesMeal = item.mealType === activeMealTab;
    const matchesDiet = selectedDietary === 'all' || item.dietaryType === selectedDietary;
    return matchesMeal && matchesDiet;
  });

  const latestActiveOrder = userOrders.find(
    (o) => o.status === 'placed' || o.status === 'preparing' || o.status === 'out_for_delivery'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 pb-24">
      {/* 1. Hero Greetings & Quick Order Bar */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 text-amber-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ghar Jaisa Swad • Daily Pure Desi Meals</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Hello, {currentUser?.name?.split(' ')[0] || 'Foodie'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md">
              Fresh hot meals prepared in hygienic cloud kitchens. Delivered in insulated eco-boxes on time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/order"
              className="bg-white text-orange-700 hover:bg-orange-50 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 flex-shrink-0"
            >
              <span>Order Today's Meal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/plans"
              className="bg-orange-950/40 hover:bg-orange-950/60 text-white border border-white/25 font-bold px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            >
              <CalendarClock className="w-4 h-4 text-amber-300" />
              <span>View Plans</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Live Order Tracking Notification (If any active order) */}
      {latestActiveOrder && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-emerald-500/30 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30 animate-pulse">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-white">
                  Order #{latestActiveOrder.orderNumber}
                </span>
                <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider">
                  {latestActiveOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {latestActiveOrder.status === 'out_for_delivery'
                  ? `Rider ${latestActiveOrder.deliveryBoyName || 'Suresh'} is on the way!`
                  : 'Chef is packing your fresh hot meal'}
              </p>
            </div>
          </div>

          <Link
            to="/my-orders"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 flex-shrink-0 shadow-sm"
          >
            <span>Track</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Active Subscription Widget */}
      {activeSubscription && (
        <div className="bg-white rounded-3xl p-5 border border-orange-100 shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-slate-800">
                    {activeSubscription.planName}
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Scheduled for {activeSubscription.deliverySlot} delivery ({activeSubscription.mealTypes.join(' + ')})
                </p>
              </div>
            </div>

            <Link
              to="/pause-delivery"
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors flex-shrink-0"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Pause / Resume</span>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>{activeSubscription.daysRemaining} days remaining</span>
              <span className="text-orange-600">{activeSubscription.totalDays} days pass</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(10, ((activeSubscription.daysRemaining) / activeSubscription.totalDays) * 100)}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Starts: {activeSubscription.startDate}</span>
              <span>Ends: {activeSubscription.endDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Promotional Offers Carousel Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            <span>Special Offers & Deals</span>
          </h2>
          <span className="text-xs text-orange-600 font-bold">Updated Today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                FLAT 25% OFF
              </span>
              <h4 className="font-black text-sm mt-1">Monthly Meal Pass</h4>
              <p className="text-[11px] text-amber-100 mt-0.5">Use Code: <strong>MONTHLY25</strong> at checkout</p>
            </div>
            <Link
              to="/plans"
              className="relative z-10 bg-white text-orange-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md hover:bg-orange-50 transition-colors"
            >
              Claim
            </Link>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                WEEKEND SWEET
              </span>
              <h4 className="font-black text-sm mt-1">Complimentary Dessert</h4>
              <p className="text-[11px] text-emerald-100 mt-0.5">Free Gulab Jamun on all Sat & Sun orders</p>
            </div>
            <Link
              to="/menu"
              className="relative z-10 bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Today's Special Menu Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <span>Today's Kitchen Menu</span>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-md">
                Fresh Batch
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Cooked fresh with cold-pressed oils and farm vegetables
            </p>
          </div>

          <Link
            to="/menu"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Full Weekly Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Meal Slot Tabs (Breakfast / Lunch / Dinner) */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 max-w-md">
          {[
            { id: 'lunch', label: 'Lunch Special (12:30 PM)', icon: Flame },
            { id: 'dinner', label: 'Dinner Special (7:30 PM)', icon: Clock },
            { id: 'breakfast', label: 'Breakfast (8:00 AM)', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMealTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMealTab === tab.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMenuItems.map((item) => (
            <MealCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* 6. PWA Install Prompt */}
      <PwaInstallBanner />

      {/* 7. Customer Reviews & Trust Badges */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Loved by 12,000+ Happy Foodies</span>
            </h3>
            <p className="text-xs text-slate-500">4.9 / 5 Average Customer Rating</p>
          </div>
          <Link
            to="/feedback"
            className="text-xs font-bold text-orange-600 hover:underline"
          >
            Leave Feedback
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic mb-3">
              "The Paneer Butter Masala and Phulkas taste exactly like Mom's cooking. Packaging keeps the food piping hot till lunch time!"
            </p>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Sneha"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Sneha Kulkarni</span>
                <span className="text-[10px] text-slate-400">Subscribed since Jan 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 italic mb-3">
              "Flexible pause delivery feature is super handy for business trips. Never lost a single rupee of food credit. Highly recommended!"
            </p>
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Vikram"
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Vikramaditya Rao</span>
                <span className="text-[10px] text-slate-400">Monthly Executive Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
