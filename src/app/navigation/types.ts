import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Drivers: undefined;
  DriverPage: {
    driverId: string;
  };
};

export type MainTabParamList = {
  Drivers: undefined;
  Favorites: undefined;
  Settings: undefined;
}; 