export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DietaryType = 'veg' | 'non-veg' | 'jain';
export type PlanType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type SubscriptionStatus = 'active' | 'paused' | 'expired' | 'pending';
export type DeliverySlot = 'morning' | 'afternoon' | 'evening';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod' | 'wallet';
export type ExpenseCategory = 'groceries' | 'packaging' | 'logistics' | 'utilities' | 'salaries' | 'marketing' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  avatar?: string;
  dietaryPreference?: DietaryType;
  addresses?: Address[];
  walletBalance?: number;
  kitchenName?: string;
  vendorId?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  kitchenName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  city: string;
  fssaiLicense: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  totalOrdersCompleted: number;
  activeSubscribers: number;
  todaysEarnings: number;
  totalEarnings: number;
  commissionPercentage: number;
  speciality: string[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  mealType: MealType;
  dietaryType: DietaryType;
  price: number;
  image: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  isSpecial?: boolean;
  dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  itemsIncluded: string[];
  rating: number;
  reviewsCount: number;
  available: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: PlanType;
  durationDays: number;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description: string;
  mealsIncluded: MealType[];
  dietaryType: DietaryType;
  benefits: string[];
  isPopular?: boolean;
  canPause: boolean;
  maxPauseDays: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  planId: string;
  planName: string;
  planType: PlanType;
  dietaryType: DietaryType;
  mealTypes: MealType[];
  startDate: string;
  endDate: string;
  totalDays: number;
  daysRemaining: number;
  status: SubscriptionStatus;
  deliveryAddress: Address;
  deliverySlot: DeliverySlot;
  pauseDates: string[]; // ISO date strings
  amountPaid: number;
  autoRenew: boolean;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  mealType: MealType;
  dietaryType: DietaryType;
  quantity: number;
  price: number;
  image?: string;
  sabjiCount?: number; // 1 sabji vs 2 sabji
  sabjis?: string[];   // e.g. ["Paneer Butter Masala", "Dal Makhani"]
  rotiCount?: number;  // e.g. 3 or 4
  rice?: string;       // e.g. "Jeera Rice"
  sweet?: string;      // e.g. "Gulab Jamun"
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  planType: PlanType;
  selectedMeals: MealType[];
  scheduledDate: string;
  deliverySlot: DeliverySlot;
  deliveryAddress: Address;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryBoyId?: string;
  deliveryBoyName?: string;
  deliveryBoyPhone?: string;
  vendorId?: string;
  vendorName?: string;
  specialInstructions?: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  tiffinDetails?: {
    sabjiCount: number;
    sabjiNames: string[];
    rotiCount: number;
    hasRice: boolean;
    hasSweet: boolean;
    hasSalad: boolean;
    isPacked?: boolean;
  };
}

export interface DeliveryPersonnel {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: 'Bike' | 'Scooter' | 'Van';
  status: 'active' | 'busy' | 'offline';
  assignedArea: string;
  currentOrdersCount: number;
  rating: number;
  avatar?: string;
}

export interface DeliveryAssignment {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliverySlot: DeliverySlot;
  slotTime: string;
  mealType: MealType;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  status: OrderStatus;
  pincode: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  orderOrSubId: string;
  type: 'order' | 'subscription' | 'refund';
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: string;
  invoiceUrl?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptNumber?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Grains & Pulses' | 'Vegetables' | 'Dairy & Oil' | 'Spices' | 'Packaging' | 'Gas & Cleaning';
  currentStock: number;
  unit: 'kg' | 'liters' | 'packets' | 'boxes' | 'cylinders';
  minThreshold: number;
  pricePerUnit: number;
  lastRestocked: string;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  mealName?: string;
  avatar?: string;
  foodRating: number;
  deliveryRating: number;
  packagingRating: number;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  fssaiNumber: string;
  gstNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  breakfastCutoff: string; // e.g. "07:00 AM"
  lunchCutoff: string;     // e.g. "10:30 AM"
  dinnerCutoff: string;    // e.g. "05:30 PM"
  pauseDeadlineHours: number; // e.g. 12 hours before delivery
  deliverySlots: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  taxPercentage: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}
