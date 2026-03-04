import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../types/interfaces';

interface AuthState {
  isLogin: boolean;
  user: AuthUser | null;
  token: string | null; // 🔥 NEW
}

const initialState: AuthState = {
  isLogin: false,
  user: null,
  token: null, // 🔥 NEW
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🔐 login with token + user
    loginSuccess(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) {
      state.isLogin = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    logout(state) {
      state.isLogin = false;
      state.user = null;
      state.token = null; // 🔥 clear token
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
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
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