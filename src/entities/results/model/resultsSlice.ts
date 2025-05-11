import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrandPrix, Result } from '../../../shared/types/results';

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