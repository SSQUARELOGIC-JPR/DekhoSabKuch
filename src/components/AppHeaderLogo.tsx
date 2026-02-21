import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import { Images } from '../constants/images';
import { Strings } from '../constants/strings';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

const AppHeaderLogo = () => {
  return (
    <View style={styles.top}>
      <Image
        source={Images.logoBadge}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{Strings.appName}</Text>
        <Text style={styles.tagline}>{Strings.tagline}</Text>
      </View>
    </View>
  );
};

export default AppHeaderLogo;

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  logo: {
    height: moderateScale(110),
    width: moderateScale(110),
  },
  textBlock: {
    marginTop: verticalScale(16),
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    ...Typography.title,
  },
  tagline: {
    marginTop: verticalScale(6),
    color: Colors.lightWhite,
    ...Typography.subtitle,
  },
});
