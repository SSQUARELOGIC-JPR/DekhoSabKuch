import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../theme/colors';

interface Props {
  rating: number;
}

const StarRating: React.FC<Props> = ({ rating }) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: verticalScale(2) }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star-outline'}
          size={moderateScale(13)}
          color={Colors.star}
          style={{ marginRight: moderateScale(2) }}
        />
      ))}
    </View>
  );
};

export default StarRating;