import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverStanding } from '../../../../shared/types/driver';

interface DriverStandingsState {
  standings: DriverStanding[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  cache: {
    [key: string]: {
      standings: DriverStanding[];
      totalDrivers: number;
    };
  };
  noDataForYear: boolean;
}

const initialState: DriverStandingsState = {
  standings: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  cache: {},
  noDataForYear: false,
};

const driverStandingsSlice = createSlice({
  name: 'driverStandings',
  initialState,
  reducers: {
    fetchDriverStandingsStart: (state) => {
      state.loading = true;
      state.error = null;
      state.noDataForYear = false;
    },
    fetchDriverStandingsSuccess: (state, action: PayloadAction<{ standings: DriverStanding[]; hasMore: boolean }>) => {
      state.standings = action.payload.standings;
      state.loading = false;
      state.hasMore = action.payload.hasMore;
      state.noDataForYear = action.payload.standings.length === 0 && !state.error;
    },
    fetchDriverStandingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.noDataForYear = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetStandings: (state) => {
      state.standings = [];
      state.hasMore = true;
      state.error = null;
      state.noDataForYear = false;
    },
    setStandings: (state, action: PayloadAction<{ drivers: DriverStanding[]; total: number; year: number }>) => {
      state.standings = action.payload.drivers;
      state.hasMore = action.payload.drivers.length === 10 && action.payload.total > 10;
      state.noDataForYear = action.payload.drivers.length === 0 && !state.error;
      state.cache[action.payload.year] = {
        standings: action.payload.drivers,
        totalDrivers: action.payload.total,
      };
    },
    appendStandings: (state, action: PayloadAction<{ drivers: DriverStanding[]; total: number; year: number }>) => {
      action.payload.drivers.forEach(driver => {
        state.standings.push(driver);
      });
      state.hasMore = state.standings.length < action.payload.total && action.payload.drivers.length === 10;
      if (state.cache[action.payload.year]) {
        action.payload.drivers.forEach(driver => {
          state.cache[action.payload.year].standings.push(driver);
        });
      }
    },
    loadFromCache: (state, action: PayloadAction<number>) => {
      const cachedData = state.cache[action.payload];
      if (cachedData) {
        state.standings = cachedData.standings;
        state.hasMore = cachedData.standings.length < cachedData.totalDrivers;
        state.loading = false;
        state.error = null;
        state.currentPage = Math.max(1, Math.ceil(cachedData.standings.length / 10));
      }
    },
  },
});

export const {
  fetchDriverStandingsStart,
  fetchDriverStandingsSuccess,
  fetchDriverStandingsFailure,
  setLoading,
  setError,
  resetStandings,
  setStandings,
  appendStandings,
  loadFromCache,
} = driverStandingsSlice.actions;

export default driverStandingsSlice.reducer; 