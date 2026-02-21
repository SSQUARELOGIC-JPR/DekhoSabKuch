import { moderateScale } from 'react-native-size-matters';

export const Typography = {
  title: {
    fontSize: moderateScale(24),
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontWeight: '400' as const,
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '500' as const,
  },
  small: {
    fontSize: moderateScale(12),
  },
  button: {
    fontSize: moderateScale(18),
    fontWeight: '600' as const,
  },
  tabLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600' as const,
  },
};