import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  setCartMealTypes, 
  setCartPlanType, 
  setCartScheduledDate, 
  setCartDeliverySlot, 
  setCartQuantity,
  placeOrder,
  clearCart
} from '../../store/slices/orderSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MealType, PlanType, DeliverySlot, PaymentMethod, Address } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Utensils, 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const OrderNow: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const cart = useAppSelector((state) => state.orders.cart);
  const menuItems = useAppSelector((state) => state.menu.items);
  const plans = useAppSelector((state) => state.subscriptions.plans);

  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(cart.selectedMeals.length > 0 ? cart.selectedMeals : ['lunch']);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(cart.planType || 'daily');
  const [scheduledDate, setScheduledDate] = useState<string>(cart.scheduledDate);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot>(cart.deliverySlot || 'afternoon');
  const [quantity, setQuantity] = useState<number>(cart.quantity || 1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [coupon, setCoupon] = useState('FIRSTHOMELOVE');
  const [couponApplied, setCouponApplied] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address selection
  const userAddresses = currentUser?.addresses || [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Sunshine Residency, 14th Main',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      isDefault: true
    }
  ];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userAddresses.find(a => a.isDefault)?.id || userAddresses[0]?.id || 'addr-1'
  );

  const activeAddress = userAddresses.find(a => a.id === selectedAddressId) || userAddresses[0];

  // Meal Selection Toggle
  const toggleMeal = (meal: MealType) => {
    if (selectedMeals.includes(meal)) {
      if (selectedMeals.length > 1) {
        setSelectedMeals(selectedMeals.filter(m => m !== meal));
      } else {
        dispatch(addToast({ type: 'warning', title: 'At least 1 meal required' }));
      }
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  // Price calculations
  let basePricePerMeal = 150;
  if (selectedPlan === 'weekly') basePricePerMeal = 135;
  if (selectedPlan === 'monthly') basePricePerMeal = 120;

  const planMultiplier = selectedPlan === 'monthly' ? 30 : selectedPlan === 'weekly' ? 7 : 1;
  const mealsCount = selectedMeals.length;
  const rawSubtotal = basePricePerMeal * mealsCount * quantity * planMultiplier;
  const discountAmount = couponApplied ? Math.round(rawSubtotal * 0.15) : 0;
  const deliveryFee = rawSubtotal > 300 || selectedPlan !== 'daily' ? 0 : 25;
  const tax = Math.round((rawSubtotal - discountAmount) * 0.05);
  const finalTotal = rawSubtotal - discountAmount + deliveryFee + tax;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FIRSTHOMELOVE' || coupon.trim().toUpperCase() === 'MONTHLY25') {
      setCouponApplied(true);
      dispatch(addToast({ type: 'success', title: 'Coupon Applied!', message: '15% discount applied to your order.' }));
    } else {
      dispatch(addToast({ type: 'error', title: 'Invalid Coupon', message: 'Try using code FIRSTHOMELOVE' }));
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const orderPayload = {
      userId: currentUser?.id || 'usr-1',
      customerName: currentUser?.name || 'Aarav Sharma',
      customerPhone: currentUser?.phone || '+91 98765 43210',
      items: selectedMeals.map((meal) => ({
        menuItemId: `item-${meal}`,
        name: `${meal.toUpperCase()} Executive Thali Combo`,
        mealType: meal,
        dietaryType: currentUser?.dietaryPreference || 'veg',
        quantity: quantity,
        price: basePricePerMeal
      })),
      planType: selectedPlan,
      selectedMeals: selectedMeals,
      scheduledDate: scheduledDate,
      deliverySlot: selectedSlot,
      deliveryAddress: activeAddress,
      status: 'placed' as const,
      subtotal: rawSubtotal,
      deliveryFee: deliveryFee,
      discount: discountAmount,
      tax: tax,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? ('pending' as const) : ('paid' as const),
      specialInstructions: specialInstructions
    };

    setTimeout(() => {
      dispatch(placeOrder(orderPayload));
      dispatch(clearCart());
      setIsSubmitting(false);
      dispatch(
        addToast({
          type: 'success',
          title: 'Order Confirmed!',
          message: 'Your tiffin delivery is scheduled. Kitchen is notified.'
        })
      );
      navigate('/my-orders');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Utensils className="w-6 h-6 text-orange-600" />
          <span>Customize Your Tiffin Order</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select meals, delivery slots, dates, and address in a few taps.
        </p>
      </div>

      <form onSubmit={handleConfirmOrder} className="space-y-5">
        {/* 1. Meal Selection (Breakfast / Lunch / Dinner) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>1. Meal Selection</span>
              <span className="text-[10px] text-orange-600 font-bold">(Select multiple if needed)</span>
            </span>
            <span className="text-xs font-bold text-slate-400">{selectedMeals.length} selected</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'breakfast', label: 'Breakfast', time: '8:00 AM', cal: '380 kcal' },
              { id: 'lunch', label: 'Lunch', time: '12:30 PM', cal: '680 kcal' },
              { id: 'dinner', label: 'Dinner', time: '7:30 PM', cal: '620 kcal' }
            ].map((meal) => {
              const isChecked = selectedMeals.includes(meal.id as MealType);
              return (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => toggleMeal(meal.id as MealType)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-orange-50 border-orange-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-extrabold capitalize ${isChecked ? 'text-orange-900' : 'text-slate-700'}`}>
                      {meal.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isChecked ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500">{meal.time}</div>
                  <div className="text-[10px] font-semibold text-amber-700 mt-1">{meal.cal}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Plan Duration Selection (Daily / Weekly / Monthly) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              2. Plan Duration
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Free Doorstep Delivery</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'daily', label: 'Daily Single', sub: '₹150 / meal', tag: 'Standard' },
              { id: 'weekly', label: '7-Day Weekly', sub: '₹135 / meal', tag: 'Save 10%' },
              { id: 'monthly', label: '30-Day Monthly', sub: '₹120 / meal', tag: 'Save 25%' }
            ].map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlan(p.id as PlanType)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 inline-block mb-1">
                    {p.tag}
                  </span>
                  <div className="font-black text-xs">{p.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Date Picker & Delivery Slot */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            3. Schedule Date & Time Slot
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Starting Delivery Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-orange-600" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Preferred Slot
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'morning', label: 'Morning' },
                  { id: 'afternoon', label: 'Lunch (12-2)' },
                  { id: 'evening', label: 'Dinner (7-9)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSlot(s.id as DeliverySlot)}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      selectedSlot === s.id
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Address Selection */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              4. Delivery Address
            </span>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              + Add New
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userAddresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-orange-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {addr.street}, {addr.area}, {addr.pincode}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Quantity Stepper & Special Instructions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                5. Meal Tiffin Quantity
              </span>
              <span className="text-[11px] text-slate-400">Number of tiffin boxes per slot</span>
            </div>

            <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white text-slate-800 font-black shadow-xs flex items-center justify-center hover:bg-slate-50"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-black text-sm text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-orange-600 text-white font-black shadow-xs flex items-center justify-center hover:bg-orange-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Kitchen Instructions / Allergies (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Less spicy dal, no extra salt, ring doorbell twice"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-orange-500"
            />
          </div>
        </div>

        {/* 6. Payment Method & Coupon Code */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            6. Payment Method
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'upi', label: 'UPI (GPay / PhonePe)' },
              { id: 'card', label: 'Credit / Debit Card' },
              { id: 'wallet', label: `Wallet (₹${currentUser?.walletBalance || 450})` },
              { id: 'cod', label: 'Cash on Delivery' }
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                  paymentMethod === pm.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter Coupon (FIRSTHOMELOVE)"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* 7. Total Amount Breakdown & Confirm CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-3">
          <h3 className="font-extrabold text-sm border-b border-slate-800 pb-2">
            Order Summary ({selectedPlan.toUpperCase()} Pass)
          </h3>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>{mealsCount} Meals × {quantity} Box × {planMultiplier} Days:</span>
              <span className="font-bold text-white">₹{rawSubtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Coupon Discount (15%):</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Doorstep Delivery:</span>
              <span className="text-emerald-400 font-bold">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST & Taxes (5%):</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="text-orange-400 text-lg">₹{finalTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm Order & Pay ₹{finalTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Money-Back Satisfaction Guarantee</span>
          </div>
        </div>
      </form>
    </div>
  );
};
