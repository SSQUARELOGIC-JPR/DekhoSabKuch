import { useSelector } from 'react-redux';
import { RootState } from '../store';
import en from './en';
import hi from './hi';

const translations = { en, hi };

export const useTranslation = () => {
  const lang = useSelector((state: RootState) => state.language.currentLang);
  return translations[lang];
};