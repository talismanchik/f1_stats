import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverStanding } from '../../../shared/types/driver';

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
}

const initialState: DriverStandingsState = {
  standings: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  cache: {},
};

const driverStandingsSlice = createSlice({
  name: 'driverStandings',
  initialState,
  reducers: {
    fetchDriverStandingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDriverStandingsSuccess: (state, action: PayloadAction<{ standings: DriverStanding[]; hasMore: boolean }>) => {
      state.standings = action.payload.standings;
      state.loading = false;
      state.hasMore = action.payload.hasMore;
    },
    fetchDriverStandingsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
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
    },
    setStandings: (state, action: PayloadAction<{ drivers: DriverStanding[]; total: number; year: number }>) => {
      state.standings = action.payload.drivers;
      state.cache[action.payload.year] = {
        standings: action.payload.drivers,
        totalDrivers: action.payload.total,
      };
    },
    appendStandings: (state, action: PayloadAction<{ drivers: DriverStanding[]; total: number; year: number }>) => {
      state.standings = [...state.standings, ...action.payload.drivers];
      if (state.cache[action.payload.year]) {
        state.cache[action.payload.year].standings = [
          ...state.cache[action.payload.year].standings,
          ...action.payload.drivers,
        ];
      }
    },
    loadFromCache: (state, action: PayloadAction<number>) => {
      const cachedData = state.cache[action.payload];
      if (cachedData) {
        state.standings = cachedData.standings;
        state.loading = false;
        state.error = null;
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