import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMenuItems, setMealFilter, setDietaryFilter, setDayFilter, setSearchQuery } from '../../store/slices/menuSlice';
import { MealCard } from '../components/MealCard';
import { MealType, DietaryType } from '../../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  Flame, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedMealType, selectedDietaryType, selectedDay, searchQuery } = useAppSelector((state) => state.menu);
  const cart = useAppSelector((state) => state.orders.cart);
  const totalCartCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemsIncluded.some(inc => inc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMeal = selectedMealType === 'all' || item.mealType === selectedMealType;
    const matchesDiet = selectedDietaryType === 'all' || item.dietaryType === selectedDietaryType;
    const matchesDay = !item.dayOfWeek || item.dayOfWeek === selectedDay;

    return matchesSearch && matchesMeal && matchesDiet && matchesDay;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-orange-600" />
          <span>Weekly Menu & Specials</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Rotated daily so you never get bored of everyday home food.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="Search by dishes (Paneer, Dal Makhani, Rajma, Poha)..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 shadow-xs transition-all"
        />
      </div>

      {/* Day of the Week Tabs */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Select Day
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => dispatch(setDayFilter(day))}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedDay === day
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters: Meal Type & Dietary preference */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Meal Type Pill Group */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
          {[
            { id: 'all', label: 'All Meals' },
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: 'Dinner' }
          ].map((slot) => (
            <button
              key={slot.id}
              onClick={() => dispatch(setMealFilter(slot.id as any))}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedMealType === slot.id
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>

        {/* Dietary preference filter */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'veg', label: 'Pure Veg' },
            { id: 'non-veg', label: 'Non-Veg' },
            { id: 'jain', label: 'Jain' }
          ].map((diet) => (
            <button
              key={diet.id}
              onClick={() => dispatch(setDietaryFilter(diet.id as any))}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedDietaryType === diet.id
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items count & Grid */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
          <span>Showing {filteredItems.length} dishes for {selectedDay}</span>
          <span className="text-orange-600">Freshly Cooked</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No dishes match your filter</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Try changing the day, meal slot, or dietary preference to see other tasty options.
            </p>
            <button
              onClick={() => {
                dispatch(setMealFilter('all'));
                dispatch(setDietaryFilter('all'));
                dispatch(setSearchQuery(''));
              }}
              className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-orange-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <MealCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40 bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-orange-500/30 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shadow-md">
              {totalCartCount}
            </div>
            <div>
              <span className="font-black text-sm text-white block leading-tight">
                ₹{cartSubtotal}
              </span>
              <span className="text-[10px] text-slate-300">
                {totalCartCount} {totalCartCount === 1 ? 'meal' : 'meals'} in box
              </span>
            </div>
          </div>

          <Link
            to="/order"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>Proceed to Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
