import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, DietaryType } from '../../types';
import { customerService } from '../../services/api';

interface CustomerState {
  customers: User[];
  searchQuery: string;
  filterDietary: DietaryType | 'all';
  selectedCustomer: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  searchQuery: '',
  filterDietary: 'all',
  selectedCustomer: null,
  isLoading: false,
  error: null
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async () => {
    return await customerService.getCustomers();
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData: Omit<User, 'id' | 'createdAt'>) => {
    return await customerService.addCustomer(customerData);
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, updates }: { id: string; updates: Partial<User> }) => {
    return await customerService.updateCustomer(id, updates);
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string) => {
    return await customerService.deleteCustomer(id);
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomerSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCustomerDietaryFilter: (state, action: PayloadAction<DietaryType | 'all'>) => {
      state.filterDietary = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<User | null>) => {
      state.selectedCustomer = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.customers[index] = action.payload;
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c.id !== action.payload);
      });
  }
});

export const { setCustomerSearch, setCustomerDietaryFilter, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
