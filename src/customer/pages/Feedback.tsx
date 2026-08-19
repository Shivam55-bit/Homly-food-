import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToast } from '../../store/slices/uiSlice';
import { reviewService } from '../../services/api';
import { 
  HeartHandshake, 
  Star, 
  Sparkles, 
  Camera, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Utensils, 
  Truck, 
  Package 
} from 'lucide-react';

export const Feedback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [foodRating, setFoodRating] = useState<number>(5);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [packagingRating, setPackagingRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Authentic Home Taste', 'Delivered Hot']);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const complimentOptions = [
    'Authentic Home Taste',
    'Delivered Hot & Fresh',
    'Less Oily & Healthy',
    'Generous Portions',
    'Polite Rider',
    'Eco-Friendly Packaging',
    'Punctual Delivery',
    'Melt-in-mouth Phulkas'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const overallRating = Math.round((foodRating + deliveryRating + packagingRating) / 3);

    await reviewService.addReview({
      customerName: currentUser?.name || 'Aarav Sharma',
      rating: overallRating,
      comment: comment || selectedTags.join(', '),
      mealName: 'Homly Daily Tiffin Meal',
      avatar: currentUser?.avatar,
      foodRating,
      deliveryRating,
      packagingRating
    });

    setIsSubmitting(false);
    dispatch(
      addToast({
        type: 'success',
        title: 'Thank You for Your Review! ⭐',
        message: 'Your feedback helps our kitchen chefs maintain the highest quality.'
      })
    );
    navigate('/');
  };

  const renderStars = (rating: number, setFn: (n: number) => void) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setFn(star)}
          className="p-1 hover:scale-110 transition-transform cursor-pointer"
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mb-3">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          How was Your Homly Meal?
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Rate your food taste, packaging, and rider punctuality.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
        {/* Rating categories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-5 h-5 text-orange-600" />
              <div>
                <span className="font-extrabold text-xs text-slate-800 block">Food Taste & Freshness</span>
                <span className="text-[10px] text-slate-400">Flavor, spices, softness</span>
              </div>
            </div>
            {renderStars(foodRating, setFoodRating)}
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-extrabold text-xs text-slate-800 block">Delivery Punctuality</span>
                <span className="text-[10px] text-slate-400">On time, polite rider</span>
              </div>
            </div>
            {renderStars(deliveryRating, setDeliveryRating)}
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-amber-600" />
              <div>
                <span className="font-extrabold text-xs text-slate-800 block">Packaging & Hygiene</span>
                <span className="text-[10px] text-slate-400">Spill-proof, insulated hot</span>
              </div>
            </div>
            {renderStars(packagingRating, setPackagingRating)}
          </div>
        </div>

        {/* Compliments Quick Tags */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            What did you love the most?
          </span>
          <div className="flex flex-wrap gap-2">
            {complimentOptions.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Comment */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Share Detailed Feedback (Optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you liked or how we can improve our recipes..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 outline-none focus:bg-white focus:border-orange-500 transition-all resize-none"
          />
        </div>

        {/* Photo Upload Simulation */}
        <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
          <span className="text-xs font-bold text-slate-700 block">Add Photo of your Tiffin Box</span>
          <span className="text-[10px] text-slate-400">Earn 50 Homly Coins for photo reviews</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Meal Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
