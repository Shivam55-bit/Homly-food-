import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface UiState {
  theme: 'light' | 'dark';
  mobileDeviceFrame: boolean; // For customer web preview mode
  sidebarCollapsed: boolean;
  toasts: ToastMessage[];
  activeModal: string | null;
}

const initialState: UiState = {
  theme: 'light',
  mobileDeviceFrame: false,
  sidebarCollapsed: false,
  toasts: [],
  activeModal: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleMobileDeviceFrame: (state) => {
      state.mobileDeviceFrame = !state.mobileDeviceFrame;
    },
    setMobileDeviceFrame: (state, action: PayloadAction<boolean>) => {
      state.mobileDeviceFrame = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileDeviceFrame,
  setMobileDeviceFrame,
  toggleSidebar,
  setSidebarCollapsed,
  addToast,
  removeToast,
  setActiveModal
} = uiSlice.actions;

export default uiSlice.reducer;
