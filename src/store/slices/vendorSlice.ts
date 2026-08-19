import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vendor } from '../../types';
import { vendorService } from '../../services/api';

interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  vendors: [],
  selectedVendor: null,
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchVendors = createAsyncThunk<Vendor[], string | void>(
  'vendors/fetchVendors',
  async (search) => {
    return await vendorService.getVendors(search || undefined);
  }
);

export const addVendor = createAsyncThunk(
  'vendors/addVendor',
  async (vendorData: Partial<Vendor>) => {
    return await vendorService.addVendor(vendorData);
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async ({ id, updates }: { id: string; updates: Partial<Vendor> }) => {
    return await vendorService.updateVendor(id, updates);
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/deleteVendor',
  async (id: string) => {
    await vendorService.deleteVendor(id);
    return id;
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendorSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.selectedVendor = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch vendors';
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.vendors.unshift(action.payload);
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) state.vendors[index] = action.payload;
        if (state.selectedVendor?.id === action.payload.id) {
          state.selectedVendor = action.payload;
        }
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(v => v.id !== action.payload);
      });
  }
});

export const { setVendorSearch, setSelectedVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
