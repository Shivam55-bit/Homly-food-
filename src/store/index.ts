import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import orderReducer from './slices/orderSlice';
import customerReducer from './slices/customerSlice';
import vendorReducer from './slices/vendorSlice';
import deliveryReducer from './slices/deliverySlice';
import paymentReducer from './slices/paymentSlice';
import expenseReducer from './slices/expenseSlice';
import inventoryReducer from './slices/inventorySlice';
import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    subscriptions: subscriptionReducer,
    orders: orderReducer,
    customers: customerReducer,
    vendors: vendorReducer,
    delivery: deliveryReducer,
    payments: paymentReducer,
    expenses: expenseReducer,
    inventory: inventoryReducer,
    settings: settingsReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
