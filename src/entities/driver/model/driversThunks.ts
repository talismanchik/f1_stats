import { createAsyncThunk } from '@reduxjs/toolkit';
import { f1Api } from '../../../shared/api/f1Api';
import { setDrivers, setLoading, setError } from './driversSlice';

export const fetchDrivers = createAsyncThunk(
  'drivers/fetchDrivers',
  async (year: number, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await f1Api.getDrivers(year);
      dispatch(setDrivers(response.MRData.DriverTable.Drivers));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Произошла ошибка'));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const API_BASE_URL = 'https://ergast.com/api/f1';
export const DEFAULT_YEAR = 2023;
export const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]; 