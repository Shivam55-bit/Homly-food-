import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../../store/slices/menuSlice';
import { addToast } from '../../store/slices/uiSlice';
import { MenuItem, MealType, DietaryType } from '../../types';
import { 
  UtensilsCrossed, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Sparkles, 
  X, 
  Check, 
  Flame, 
  Star,
  CheckCircle2
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner'];

export const MenuManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector((state) => state.menu.items);

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealType: 'lunch' as MealType,
    dietaryType: 'veg' as DietaryType,
    price: 150,
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
    calories: 620,
    protein: '20g',
    carbs: '75g',
    fat: '14g',
    isSpecial: false,
    dayOfWeek: 'Monday' as any,
    itemsIncludedText: 'Paneer Curry, Dal Makhani, 3 Phulkas, Rice, Salad',
    available: true
  });

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleOpenAdd = (day?: string, meal?: MealType) => {
    setFormData({
      name: '',
      description: '',
      mealType: meal || 'lunch',
      dietaryType: 'veg',
      price: 150,
      image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=600&q=80',
      calories: 600,
      protein: '18g',
      carbs: '80g',
      fat: '14g',
      isSpecial: false,
      dayOfWeek: day || 'Monday',
      itemsIncludedText: 'Paneer Curry, Dal Tadka, 3 Phulkas, Steamed Rice, Raita',
      available: true
    });
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      mealType: item.mealType,
      dietaryType: item.dietaryType,
      price: item.price,
      image: item.image,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      isSpecial: !!item.isSpecial,
      dayOfWeek: item.dayOfWeek || 'Monday',
      itemsIncludedText: item.itemsIncluded.join(', '),
      available: item.available
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsList = formData.itemsIncludedText.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingItem) {
      dispatch(
        updateMenuItem({
          id: editingItem.id,
          updates: {
            ...formData,
            itemsIncluded: itemsList
          }
        })
      );
      dispatch(addToast({ type: 'success', title: 'Menu Item Updated', message: `${formData.name} updated.` }));
    } else {
      dispatch(
        addMenuItem({
          ...formData,
          itemsIncluded: itemsList
        })
      );
      dispatch(addToast({ type: 'success', title: 'Dish Added', message: `${formData.name} added to ${formData.dayOfWeek} menu.` }));
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete ${name} from menu?`)) {
      dispatch(deleteMenuItem(id));
      dispatch(addToast({ type: 'info', title: 'Dish Removed', message: `${name} deleted.` }));
    }
  };

  const handleToggleAvailable = (item: MenuItem) => {
    dispatch(updateMenuItem({ id: item.id, updates: { available: !item.available } }));
    dispatch(
      addToast({
        type: 'info',
        title: item.available ? 'Marked Out of Stock' : 'Marked In Stock',
        message: `${item.name} status updated.`
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
            <span>Menu & Kitchen Recipe Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Weekly 7-day meal matrix, daily recipe ingredients, and calorie counts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          Weekly Matrix Planner (Mon-Sun)
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          All Dishes List ({menuItems.length})
        </button>
      </div>

      {activeTab === 'calendar' ? (
        /* Weekly Matrix Table */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-5">
          <div className="space-y-6">
            {DAYS.map((day) => {
              const dayDishes = menuItems.filter((m) => m.dayOfWeek === day);

              return (
                <div key={day} className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-black text-xs flex items-center justify-center">
                        {day.slice(0, 3)}
                      </span>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">{day} Menu Schedule</h3>
                    </div>
                    <button
                      onClick={() => handleOpenAdd(day)}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Dish to {day}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {MEALS.map((meal) => {
                      const mealDish = dayDishes.find((m) => m.mealType === meal);
                      return (
                        <div
                          key={meal}
                          className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700/70 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {meal}
                              </span>
                              {mealDish && (
                                <button
                                  onClick={() => handleToggleAvailable(mealDish)}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    mealDish.available
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {mealDish.available ? 'In Stock' : 'Out of Stock'}
                                </button>
                              )}
                            </div>

                            {mealDish ? (
                              <div>
                                <h4 className="font-black text-xs text-slate-900 dark:text-white leading-snug">
                                  {mealDish.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                  {mealDish.description}
                                </p>
                                <div className="text-[11px] font-bold text-orange-600 mt-2">
                                  ₹{mealDish.price} • {mealDish.calories} kcal
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <span className="text-[11px] text-slate-400 italic block mb-1">
                                  No {meal} dish assigned
                                </span>
                                <button
                                  onClick={() => handleOpenAdd(day, meal)}
                                  className="text-[11px] font-bold text-orange-600 hover:underline"
                                >
                                  + Assign Dish
                                </button>
                              </div>
                            )}
                          </div>

                          {mealDish && (
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700 mt-3">
                              <button
                                onClick={() => handleOpenEdit(mealDish)}
                                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(mealDish.id, mealDish.name)}
                                className="text-[11px] font-bold text-rose-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                    {item.dayOfWeek || 'Everyday'} • {item.mealType}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                  <span className="text-sm font-black text-emerald-600">₹{item.price}</span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                <div className="text-[11px] text-slate-400 font-medium">
                  Calories: {item.calories} kcal • Protein: {item.protein}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                <button
                  onClick={() => handleToggleAvailable(item)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.available ? 'In Stock' : 'Out of Stock'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {editingItem ? 'Edit Menu Recipe' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Dish Title
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal North Indian Thali"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fresh Paneer Butter Masala, Slow cooked dal, 3 phulkas..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Meal Slot
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={(e) => setFormData({ ...formData, mealType: e.target.value as MealType })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="breakfast">Breakfast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Dietary
                  </label>
                  <select
                    value={formData.dietaryType}
                    onChange={(e) => setFormData({ ...formData, dietaryType: e.target.value as DietaryType })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="jain">Jain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Day of Week
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Items Included (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.itemsIncludedText}
                  onChange={(e) => setFormData({ ...formData, itemsIncludedText: e.target.value })}
                  placeholder="e.g. Paneer Butter Masala, Dal Makhani, 3 Phulkas, Rice"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                >
                  {editingItem ? 'Save Updates' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
