import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../types/interfaces'; // 👈 important

interface AuthState {
  isLogin: boolean;
  user: AuthUser | null;
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.isLogin = true;
      state.user = action.payload;
    },

    logout(state) {
      state.isLogin = false;
      state.user = null;
  },

    updateProfileDone(state) {
      if (state.user) {
        state.user.profileDone = true;
      }
    },

    updatePaymentDone(state) {
      if (state.user) {
        state.user.paymentDone = true;
      }
    },

    // Save / Update Profile Data
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginSuccess,
  logout,
  updateProfileDone,
  updatePaymentDone,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;