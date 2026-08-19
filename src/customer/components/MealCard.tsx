import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addItemToCart, removeItemFromCart } from '../../store/slices/orderSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MenuItem } from '../../types';
import { DietaryBadge } from './DietaryBadge';
import { Star, Plus, Minus, Flame, Sparkles, Clock, Check } from 'lucide-react';

interface Props {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
}

export const MealCard: React.FC<Props> = ({ item, onCustomize }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.orders.cart.items);
  const cartItem = cartItems.find((i) => i.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      addItemToCart({
        menuItemId: item.id,
        name: item.name,
        mealType: item.mealType,
        dietaryType: item.dietaryType,
        quantity: 1,
        price: item.price,
        image: item.image
      })
    );
    dispatch(
      addToast({
        type: 'success',
        title: 'Added to Tiffin Box',
        message: `${item.name} added to your box.`
      })
    );
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      dispatch(
        addItemToCart({
          menuItemId: item.id,
          name: item.name,
          mealType: item.mealType,
          dietaryType: item.dietaryType,
          quantity: -1,
          price: item.price,
          image: item.image
        })
      );
    } else {
      dispatch(removeItemFromCart(item.id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Image & Badges */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-xs">
            <DietaryBadge type={item.dietaryType} />
          </span>
          {item.isSpecial && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Chef Special
            </span>
          )}
        </div>

        {/* Meal Slot Tag & Calories */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
          <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full font-medium capitalize text-[11px] border border-white/20">
            {item.mealType} Special
          </span>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full text-[11px] border border-white/20 font-semibold">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{item.calories} kcal • {item.protein} protein</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-orange-600 transition-colors">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[11px] font-extrabold flex-shrink-0">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>{item.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          {/* Items Included Chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.itemsIncluded.slice(0, 4).map((inc, i) => (
              <span
                key={i}
                className="bg-orange-50/60 text-slate-600 text-[10px] px-2 py-0.5 rounded-md border border-orange-100/60 font-medium"
              >
                {inc}
              </span>
            ))}
            {item.itemsIncluded.length > 4 && (
              <span className="text-[10px] text-slate-400 font-semibold py-0.5">
                +{item.itemsIncluded.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & Add Stepper */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Per Meal</span>
            <span className="text-base font-extrabold text-slate-900">
              ₹{item.price}
            </span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Box</span>
            </button>
          ) : (
            <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={handleRemove}
                className="p-1.5 hover:bg-orange-700 transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 text-xs font-extrabold">{quantity}</span>
              <button
                onClick={handleAdd}
                className="p-1.5 hover:bg-orange-700 transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
