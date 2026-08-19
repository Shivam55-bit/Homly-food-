import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, MealType, DietaryType } from '../../types';
import { menuService } from '../../services/api';

interface MenuState {
  items: MenuItem[];
  selectedMealType: MealType | 'all';
  selectedDietaryType: DietaryType | 'all';
  selectedDay: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  selectedMealType: 'all',
  selectedDietaryType: 'all',
  selectedDay: 'Monday',
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async () => {
    const items = await menuService.getMenu();
    return items;
  }
);

export const addMenuItem = createAsyncThunk(
  'menu/addMenuItem',
  async (item: Omit<MenuItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const created = await menuService.addMenuItem(item);
    return created;
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, updates }: { id: string; updates: Partial<MenuItem> }) => {
    const updated = await menuService.updateMenuItem(id, updates);
    return updated;
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id: string) => {
    await menuService.deleteMenuItem(id);
    return id;
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMealFilter: (state, action: PayloadAction<MealType | 'all'>) => {
      state.selectedMealType = action.payload;
    },
    setDietaryFilter: (state, action: PayloadAction<DietaryType | 'all'>) => {
      state.selectedDietaryType = action.payload;
    },
    setDayFilter: (state, action: PayloadAction<string>) => {
      state.selectedDay = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch menu';
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  }
});

export const { setMealFilter, setDietaryFilter, setDayFilter, setSearchQuery } = menuSlice.actions;
export default menuSlice.reducer;
