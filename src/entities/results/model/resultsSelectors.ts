import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectResultsYear = (state: RootState) => state.results.year;
export const selectResultsCurrentRound = (state: RootState) => state.results.currentRound;
export const selectResultsLoading = (state: RootState) => state.results.loading;
export const selectResultsError = (state: RootState) => state.results.error;

const EMPTY_GRAND_PRIX_LIST: any[] = [];
const EMPTY_RESULTS: any[] = [];

export const selectGrandPrixList = createSelector(
  [(state: RootState) => state.results.cache, selectResultsYear],
  (cache, year) => cache[year]?.grandPrixList || EMPTY_GRAND_PRIX_LIST
);

export const selectResultsByCurrentRound = createSelector(
  [
    (state: RootState) => state.results.cache,
    selectResultsYear,
    selectResultsCurrentRound
  ],
  (cache, year, round) => cache[year]?.resultsByRound?.[round] || EMPTY_RESULTS
); 