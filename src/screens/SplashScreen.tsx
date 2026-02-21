import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import { Strings } from '../constants/strings';
import { Routes } from '../constants/routes';
import { Images } from '../constants/images';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const SplashScreen = ({ navigation }: any) => {
  // Logo animation
  const fadeAnim = useRef(new Animated.Value(0.2)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;

  // Text animation
  const textTranslate = useRef(new Animated.Value(40)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo fade + zoom
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    // Text slide animation
    Animated.parallel([
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 700,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    const t = setTimeout(() => {
      navigation.replace(Routes.Home);
    }, 2600); // 🔥 correct duration (2.6 sec)

    return () => clearTimeout(t);
  }, []);

  return (
    <ImageBackground
      source={Images.splashBg}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ transform: [{ scale: 1.08 }] }} // subtle zoom effect
    >
      {/* Gradient Overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Center Content */}
        <View style={styles.center}>
          <Animated.Image
            source={Images.logoBadge}
            style={[
              styles.logo,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
            resizeMode="contain"
          />

          <Animated.View
            style={{
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
              alignItems: 'center',
              marginTop: verticalScale(14),
            }}
          >
            <Text style={styles.title}>{Strings.appName}</Text>
            <Text style={styles.tagline}>{Strings.tagline}</Text>
          </Animated.View>
        </View>

        {/* Bottom */}
        <Text style={styles.poweredBy}>
          {Strings.common.poweredBy}
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  bg: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 35, 120, 0.25)', // premium blue tint
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    height: moderateScale(130),
    width: moderateScale(130),
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12, // Android glow
  },

  title: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    ...Typography.title,
  },

  tagline: {
    marginTop: verticalScale(6),
    color: '#EAF2FF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    ...Typography.subtitle,
  },

  poweredBy: {
    color: Colors.white,
    ...Typography.button,
    fontStyle: 'italic',
  },
});
