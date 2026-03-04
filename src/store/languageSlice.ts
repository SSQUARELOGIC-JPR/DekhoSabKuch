import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LangType = 'en' | 'hi';

interface LanguageState {
  currentLang: LangType;
}

const initialState: LanguageState = {
  currentLang: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LangType>) {
      state.currentLang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;