import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { DriversPage } from '../../pages/DriversPage/DriversPage';
import { DriverPage } from '../../pages/DriverPage/DriverPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Drivers"
          component={DriversPage}
          options={{
            title: 'Гонщики',
          }}
        />
        <Stack.Screen
          name="DriverPage"
          component={DriverPage}
          options={{
            title: 'Гонщик',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 