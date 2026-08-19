import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types';
import { inventoryService } from '../../services/api';

interface InventoryState {
  items: InventoryItem[];
  filterStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  filterStatus: 'all',
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    return await inventoryService.getInventory();
  }
);

export const addInventoryItem = createAsyncThunk(
  'inventory/addInventoryItem',
  async (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    return await inventoryService.addInventoryItem(itemData);
  }
);

export const updateStock = createAsyncThunk(
  'inventory/updateStock',
  async ({ id, newStock }: { id: string; newStock: number }) => {
    return await inventoryService.updateStock(id, newStock);
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventoryFilter: (state, action: PayloadAction<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>) => {
      state.filterStatus = action.payload;
    },
    setInventorySearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  }
});

export const { setInventoryFilter, setInventorySearch } = inventorySlice.actions;
export default inventorySlice.reducer;
