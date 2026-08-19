import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionPlan, UserSubscription, PlanType, DietaryType, MealType, Address, DeliverySlot } from '../../types';
import { subscriptionService } from '../../services/api';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  subscriptions: UserSubscription[];
  activeSubscription: UserSubscription | null;
  selectedPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  subscriptions: [],
  activeSubscription: null,
  selectedPlan: null,
  isLoading: false,
  error: null
};

export const fetchPlans = createAsyncThunk(
  'subscriptions/fetchPlans',
  async () => {
    return await subscriptionService.getPlans();
  }
);

export const fetchAllSubscriptions = createAsyncThunk(
  'subscriptions/fetchAllSubscriptions',
  async () => {
    return await subscriptionService.getAllSubscriptions();
  }
);

export const fetchUserSubscription = createAsyncThunk(
  'subscriptions/fetchUserSubscription',
  async (userId: string) => {
    return await subscriptionService.getUserSubscription(userId);
  }
);

export const subscribeToPlan = createAsyncThunk(
  'subscriptions/subscribeToPlan',
  async (subData: Omit<UserSubscription, 'id' | 'createdAt'>) => {
    return await subscriptionService.createSubscription(subData);
  }
);

export const pauseSubscriptionDates = createAsyncThunk(
  'subscriptions/pauseSubscriptionDates',
  async ({ subId, dates }: { subId: string; dates: string[] }) => {
    return await subscriptionService.pauseDates(subId, dates);
  }
);

export const resumeSubscriptionDate = createAsyncThunk(
  'subscriptions/resumeSubscriptionDate',
  async ({ subId, date }: { subId: string; date?: string }) => {
    return await subscriptionService.resumeSubscription(subId, date);
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSelectedPlan: (state, action: PayloadAction<SubscriptionPlan | null>) => {
      state.selectedPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        if (!state.selectedPlan && action.payload.length > 0) {
          state.selectedPlan = action.payload[0];
        }
      })
      .addCase(fetchAllSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.activeSubscription = action.payload;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.subscriptions.unshift(action.payload);
        state.activeSubscription = action.payload;
      })
      .addCase(pauseSubscriptionDates.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.subscriptions[index] = action.payload;
        if (state.activeSubscription?.id === action.payload.id) {
          state.activeSubscription = action.payload;
        }
      })
      .addCase(resumeSubscriptionDate.fulfilled, (state, action) => {
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.subscriptions[index] = action.payload;
        if (state.activeSubscription?.id === action.payload.id) {
          state.activeSubscription = action.payload;
        }
      });
  }
});

export const { setSelectedPlan } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
