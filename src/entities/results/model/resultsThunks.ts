import { createAsyncThunk } from '@reduxjs/toolkit';
import { resultsApi } from '../../../shared/api/resultsApi';
import { setGrandPrixList, setResults, setLoading, setError } from './resultsSlice';
import { RootState } from '../../../app/store/index';

export const fetchGrandPrixList = createAsyncThunk(
  'results/fetchGrandPrixList',
  async (year: number, { dispatch, getState }) => {
    const state = getState() as RootState;
    const cached = state.results.cache[year]?.grandPrixList;
    if (cached && cached.length > 0) {
      dispatch(setGrandPrixList({ year, grandPrixList: cached }));
      return cached;
    }
    dispatch(setLoading(true));
    try {
      const grandPrixList = await resultsApi.getGrandPrixList(year);
      dispatch(setGrandPrixList({ year, grandPrixList }));
      return grandPrixList;
    } catch (e: any) {
      dispatch(setError(e.message || 'Ошибка загрузки этапов'));
      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchResultsByGrandPrix = createAsyncThunk(
  'results/fetchResultsByGrandPrix',
  async ({ year, round }: { year: number; round: number }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const cached = state.results.cache[year]?.resultsByRound?.[round];
    if (cached && cached.length > 0) {
      dispatch(setResults({ year, round, results: cached }));
      return cached;
    }
    dispatch(setLoading(true));
    try {
      const results = await resultsApi.getResultsByGrandPrix(year, round);
      dispatch(setResults({ year, round, results }));
      return results;
    } catch (e: any) {
      dispatch(setError(e.message || 'Ошибка загрузки результатов'));
      throw e;
    } finally {
      dispatch(setLoading(false));
    }
  }
); 