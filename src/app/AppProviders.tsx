import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: Props) => {
  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
};

export default AppProviders;
