import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseItem, ExpenseCategory } from '../../types';
import { expenseService } from '../../services/api';

interface ExpenseState {
  expenses: ExpenseItem[];
  filterCategory: ExpenseCategory | 'all';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  filterCategory: 'all',
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async () => {
    return await expenseService.getExpenses();
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData: Omit<ExpenseItem, 'id'>) => {
    return await expenseService.addExpense(expenseData);
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string) => {
    await expenseService.deleteExpense(id);
    return id;
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenseFilterCategory: (state, action: PayloadAction<ExpenseCategory | 'all'>) => {
      state.filterCategory = action.payload;
    },
    setExpenseSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      });
  }
});

export const { setExpenseFilterCategory, setExpenseSearch } = expenseSlice.actions;
export default expenseSlice.reducer;
