import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const DummyScreen = () => (
  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <Text>Main App Screen</Text>
  </View>
);

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DummyScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
