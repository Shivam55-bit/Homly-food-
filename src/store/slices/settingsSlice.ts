import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BusinessSettings } from '../../types';
import { settingsService } from '../../services/api';
import { INITIAL_SETTINGS } from '../../services/mockData';

interface SettingsState {
  settings: BusinessSettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: INITIAL_SETTINGS,
  isLoading: false,
  error: null
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async () => {
    return await settingsService.getSettings();
  }
);

export const updateBusinessSettings = createAsyncThunk(
  'settings/updateBusinessSettings',
  async (settings: Partial<BusinessSettings>) => {
    return await settingsService.updateSettings(settings);
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateBusinessSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  }
});

export default settingsSlice.reducer;
