import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  verticalScale,
  moderateScale,
} from 'react-native-size-matters';

import { Colors } from '../theme';
import { ErrorBannerProps } from '../types/interfaces';
import { clearError } from '../store/errorSlice';

const { width } = Dimensions.get('window');

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  type = 'error',
  duration = 2500,
}) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const translateY = useRef(
    new Animated.Value(-verticalScale(120))
  ).current;

  const opacity = useRef(new Animated.Value(0)).current;

  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!message) return;

    // Reset position before showing
    translateY.setValue(-verticalScale(120));
    opacity.setValue(0);

    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide
    hideTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -verticalScale(120),
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dispatch(clearError()); // ✅ Auto clear redux state
      });
    }, duration);

    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [message]);

  if (!message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.primary;
      case 'warning':
        return Colors.accent;
      case 'error':
      default:
        return Colors.error;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          paddingTop: insets.top + verticalScale(6),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default ErrorBanner;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: width,
    paddingBottom: verticalScale(14),
    paddingHorizontal: moderateScale(20),
    zIndex: 9999,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
});