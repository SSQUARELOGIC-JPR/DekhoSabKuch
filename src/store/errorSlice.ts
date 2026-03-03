import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalErrorState, BannerType } from '../types/interfaces';

const initialState: GlobalErrorState = {
  message: '',
  type: 'error',
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showError: (
      state,
      action: PayloadAction<{ message: string; type?: BannerType }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type ?? 'error';
    },
    clearError: state => {
      state.message = '';
    },
  },
});

export const { showError, clearError } = errorSlice.actions;
export default errorSlice.reducer;