import { createAsyncThunk } from '@reduxjs/toolkit';
import { getGrandPrixList, getResultsByGrandPrix } from '../../../shared/api/resultsApi';

export const fetchGrandPrixList = createAsyncThunk(
  'results/fetchGrandPrixList',
  async (year: number, { signal, rejectWithValue }) => {
    try {
      const grandPrixList = await getGrandPrixList({ year, signal });
      console.log('grandPrixList', grandPrixList);
      
      if (!grandPrixList || grandPrixList.length === 0) {
        return rejectWithValue('No grand prix found for this year');
      }
      
      return grandPrixList;
    } catch (error) {
      console.error('Error fetching grand prix list:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch grand prix list');
    }
  }
);

export const fetchResultsByGrandPrix = createAsyncThunk(
  'results/fetchResultsByGrandPrix',
  async ({ year, round }: { year: number; round: number }, { signal, rejectWithValue }) => {
    try {
      console.log('fetchResultsByGrandPrix', { year, round });
      
      const results = await getResultsByGrandPrix({ year, round, signal });
      console.log('results', results);
      
      if (!results || results.length === 0) {
        return rejectWithValue('No results found for this grand prix');
      }
      
      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch results');
    }
  }
); 