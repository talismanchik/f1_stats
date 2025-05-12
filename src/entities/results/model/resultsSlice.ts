import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrandPrix, Result } from '../../../shared/types/results';
import { fetchGrandPrixList, fetchResultsByGrandPrix } from './resultsThunks';

interface ResultsCache {
  grandPrixList: GrandPrix[];
  resultsByRound: { [round: number]: Result[] };
}

interface ResultsState {
  year: number;
  currentRound: number;
  loading: boolean;
  error: string | null;
  cache: { [year: number]: ResultsCache };
}

const initialState: ResultsState = {
  year: new Date().getFullYear(),
  currentRound: 1,
  loading: false,
  error: null,
  cache: {},
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload;
      state.currentRound = 1;
    },
    setCurrentRound(state, action: PayloadAction<number>) {
      state.currentRound = action.payload;
    },
    setGrandPrixList(state, action: PayloadAction<{ year: number; grandPrixList: GrandPrix[] }>) {
      if (!state.cache[action.payload.year]) {
        state.cache[action.payload.year] = { grandPrixList: [], resultsByRound: {} };
      }
      state.cache[action.payload.year].grandPrixList = action.payload.grandPrixList;
    },
    setResults(state, action: PayloadAction<{ year: number; round: number; results: Result[] }>) {
      if (!state.cache[action.payload.year]) {
        state.cache[action.payload.year] = { grandPrixList: [], resultsByRound: {} };
      }
      state.cache[action.payload.year].resultsByRound[action.payload.round] = action.payload.results;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrandPrixList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrandPrixList.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.cache[state.year]) {
          state.cache[state.year] = { grandPrixList: [], resultsByRound: {} };
        }
        state.cache[state.year].grandPrixList = action.payload;
      })
      .addCase(fetchGrandPrixList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch grand prix list';
      })
      .addCase(fetchResultsByGrandPrix.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsByGrandPrix.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.cache[state.year]) {
          state.cache[state.year] = { grandPrixList: [], resultsByRound: {} };
        }
        state.cache[state.year].resultsByRound[state.currentRound] = action.payload;
      })
      .addCase(fetchResultsByGrandPrix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch results';
      });
  },
});

export const {
  setYear,
  setCurrentRound,
  setGrandPrixList,
  setResults,
  setLoading,
  setError,
} = resultsSlice.actions;

export default resultsSlice.reducer; 