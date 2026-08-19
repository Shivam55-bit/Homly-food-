import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderItem, OrderStatus, MealType, PlanType, DeliverySlot, Address, PaymentMethod, PaymentStatus } from '../../types';
import { orderService } from '../../services/api';

interface CartState {
  items: OrderItem[];
  planType: PlanType;
  selectedMeals: MealType[];
  scheduledDate: string;
  deliverySlot: DeliverySlot;
  deliveryAddress: Address | null;
  paymentMethod: PaymentMethod;
  quantity: number;
  couponCode: string;
  discount: number;
  specialInstructions: string;
}

interface OrderState {
  orders: Order[];
  userOrders: Order[];
  activeTrackingOrder: Order | null;
  cart: CartState;
  filterStatus: OrderStatus | 'all';
  filterSlot: DeliverySlot | 'all';
  isLoading: boolean;
  error: string | null;
}

const initialTomorrow = new Date();
initialTomorrow.setDate(initialTomorrow.getDate() + 1);
const tomorrowISO = initialTomorrow.toISOString().split('T')[0];

const initialCart: CartState = {
  items: [],
  planType: 'daily',
  selectedMeals: ['lunch'],
  scheduledDate: tomorrowISO,
  deliverySlot: 'afternoon',
  deliveryAddress: null,
  paymentMethod: 'upi',
  quantity: 1,
  couponCode: 'FIRSTHOMELOVE',
  discount: 20,
  specialInstructions: ''
};

const initialState: OrderState = {
  orders: [],
  userOrders: [],
  activeTrackingOrder: null,
  cart: initialCart,
  filterStatus: 'all',
  filterSlot: 'all',
  isLoading: false,
  error: null
};

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async () => {
    return await orderService.getAllOrders();
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string) => {
    return await orderService.getUserOrders(userId);
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    return await orderService.createOrder(orderData);
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, riderId }: { orderId: string; status: OrderStatus; riderId?: string }) => {
    return await orderService.updateOrderStatus(orderId, status, riderId);
  }
);

export const editOrder = createAsyncThunk(
  'orders/editOrder',
  async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
    return await orderService.updateOrder(id, updates);
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: string) => {
    return await orderService.deleteOrder(id);
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCartMealTypes: (state, action: PayloadAction<MealType[]>) => {
      state.cart.selectedMeals = action.payload;
    },
    setCartPlanType: (state, action: PayloadAction<PlanType>) => {
      state.cart.planType = action.payload;
    },
    setCartScheduledDate: (state, action: PayloadAction<string>) => {
      state.cart.scheduledDate = action.payload;
    },
    setCartDeliverySlot: (state, action: PayloadAction<DeliverySlot>) => {
      state.cart.deliverySlot = action.payload;
    },
    setCartDeliveryAddress: (state, action: PayloadAction<Address>) => {
      state.cart.deliveryAddress = action.payload;
    },
    setCartPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.cart.paymentMethod = action.payload;
    },
    setCartQuantity: (state, action: PayloadAction<number>) => {
      state.cart.quantity = Math.max(1, action.payload);
    },
    setCartSpecialInstructions: (state, action: PayloadAction<string>) => {
      state.cart.specialInstructions = action.payload;
    },
    addItemToCart: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.cart.items.find(i => i.menuItemId === action.payload.menuItemId);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.cart.items.push(action.payload);
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.cart.items = state.cart.items.filter(i => i.menuItemId !== action.payload);
    },
    clearCart: (state) => {
      state.cart.items = [];
      state.cart.specialInstructions = '';
    },
    setActiveTrackingOrder: (state, action: PayloadAction<Order | null>) => {
      state.activeTrackingOrder = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<OrderStatus | 'all'>) => {
      state.filterStatus = action.payload;
    },
    setFilterSlot: (state, action: PayloadAction<DeliverySlot | 'all'>) => {
      state.filterSlot = action.payload;
    },
    updateOrderPaymentStatus: (state, action: PayloadAction<{ orderId: string; paymentStatus: PaymentStatus }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.paymentStatus = action.payload.paymentStatus;
      }
      const userOrder = state.userOrders.find(o => o.id === action.payload.orderId);
      if (userOrder) {
        userOrder.paymentStatus = action.payload.paymentStatus;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        if (!state.activeTrackingOrder && action.payload.length > 0) {
          state.activeTrackingOrder = action.payload[0];
        }
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        if (action.payload.length > 0) {
          state.activeTrackingOrder = action.payload[0];
        }
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.userOrders.unshift(action.payload);
        state.activeTrackingOrder = action.payload;
        state.cart.items = [];
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
        const userIndex = state.userOrders.findIndex(o => o.id === action.payload.id);
        if (userIndex !== -1) state.userOrders[userIndex] = action.payload;
        if (state.activeTrackingOrder?.id === action.payload.id) {
          state.activeTrackingOrder = action.payload;
        }
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
        const userIndex = state.userOrders.findIndex(o => o.id === action.payload.id);
        if (userIndex !== -1) state.userOrders[userIndex] = action.payload;
        if (state.activeTrackingOrder?.id === action.payload.id) {
          state.activeTrackingOrder = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
        state.userOrders = state.userOrders.filter(o => o.id !== action.payload);
        if (state.activeTrackingOrder?.id === action.payload) {
          state.activeTrackingOrder = state.orders[0] || null;
        }
      });
  }
});

export const {
  setCartMealTypes,
  setCartPlanType,
  setCartScheduledDate,
  setCartDeliverySlot,
  setCartDeliveryAddress,
  setCartPaymentMethod,
  setCartQuantity,
  setCartSpecialInstructions,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  setActiveTrackingOrder,
  setFilterStatus,
  setFilterSlot,
  updateOrderPaymentStatus
} = orderSlice.actions;

export default orderSlice.reducer;
