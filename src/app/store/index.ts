import { configureStore } from '@reduxjs/toolkit';
import driversReducer from '../../entities/driver/model/driversSlice';
import driverStandingsReducer from '../../entities/driver/model/driverStandingsSlice';

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    driverStandings: driverStandingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 