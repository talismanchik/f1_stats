import { configureStore } from '@reduxjs/toolkit';
import driverStandingsReducer from '../../entities/driver/model/standings/driverStandingsSlice';
import driverDetailsReducer from '../../entities/driver/model/details/driverDetailsSlice';
import resultsReducer from '../../entities/results/model/resultsSlice';

export const store = configureStore({
  reducer: {
    driverStandings: driverStandingsReducer,
    driverDetails: driverDetailsReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 