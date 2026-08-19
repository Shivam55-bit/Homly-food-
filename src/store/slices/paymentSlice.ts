import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaymentTransaction, PaymentStatus } from '../../types';
import { paymentService } from '../../services/api';

interface PaymentState {
  transactions: PaymentTransaction[];
  selectedTransaction: PaymentTransaction | null;
  filterStatus: PaymentStatus | 'all';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  transactions: [],
  selectedTransaction: null,
  filterStatus: 'all',
  searchQuery: '',
  isLoading: false,
  error: null
};

export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async () => {
    return await paymentService.getTransactions();
  }
);

export const updateTransactionStatus = createAsyncThunk(
  'payments/updateTransactionStatus',
  async ({ id, status }: { id: string; status: PaymentStatus }) => {
    return await paymentService.updateTransactionStatus(id, status);
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPaymentFilterStatus: (state, action: PayloadAction<PaymentStatus | 'all'>) => {
      state.filterStatus = action.payload;
    },
    setPaymentSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTransaction: (state, action: PayloadAction<PaymentTransaction | null>) => {
      state.selectedTransaction = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(updateTransactionStatus.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.transactions[index] = action.payload;
      });
  }
});

export const { setPaymentFilterStatus, setPaymentSearch, setSelectedTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;
