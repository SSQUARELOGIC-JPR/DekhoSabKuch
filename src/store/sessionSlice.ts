import { createSlice } from '@reduxjs/toolkit';

interface SessionState {
  sessionExpired: boolean;
}

const initialState: SessionState = {
  sessionExpired: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    openSessionExpired: state => {
      state.sessionExpired = true;
    },
    closeSessionExpired: state => {
      state.sessionExpired = false;
    },
  },
});

export const { openSessionExpired, closeSessionExpired } =
  sessionSlice.actions;

export default sessionSlice.reducer;