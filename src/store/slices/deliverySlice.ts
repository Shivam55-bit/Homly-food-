import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryPersonnel, DeliverySlot } from '../../types';
import { deliveryService } from '../../services/api';

interface DeliveryState {
  riders: DeliveryPersonnel[];
  selectedSlot: DeliverySlot | 'all';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  riders: [],
  selectedSlot: 'all',
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchRiders = createAsyncThunk(
  'delivery/fetchRiders',
  async () => {
    return await deliveryService.getRiders();
  }
);

export const addRider = createAsyncThunk(
  'delivery/addRider',
  async (riderData: Omit<DeliveryPersonnel, 'id' | 'currentOrdersCount' | 'rating'>) => {
    return await deliveryService.addRider(riderData);
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliverySlotFilter: (state, action: PayloadAction<DeliverySlot | 'all'>) => {
      state.selectedSlot = action.payload;
    },
    setRiderSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.riders = action.payload;
      })
      .addCase(addRider.fulfilled, (state, action) => {
        state.riders.push(action.payload);
      });
  }
});

export const { setDeliverySlotFilter, setRiderSearch } = deliverySlice.actions;
export default deliverySlice.reducer;
