import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriverStanding } from '../../../shared/types/driver';
import { f1Api } from '../../../shared/api/f1Api';
import {
  fetchDriverStandingsStart,
  fetchDriverStandingsSuccess,
  fetchDriverStandingsFailure,
  setLoading,
  setError,
  resetStandings,
  setStandings,
  appendStandings,
  loadFromCache,
} from './driverStandingsSlice';

const DRIVERS_PER_PAGE = 10;

interface FetchDriverStandingsParams {
  year: number;
  page: number;
}

export const fetchDriverStandings = createAsyncThunk(
  'driverStandings/fetchDriverStandings',
  async ({ year, page }: FetchDriverStandingsParams, { dispatch, getState }) => {
    try {
      if (page === 1) {
        const state = getState() as any;
        const cachedData = state.driverStandings.cache[year];
        
        if (cachedData) {
          dispatch(loadFromCache(year));
          return { drivers: cachedData.standings, total: cachedData.totalDrivers };
        }
        
        dispatch(setLoading(true));
        dispatch(resetStandings());
      }

      dispatch(fetchDriverStandingsStart());
      
      const response = await fetch(`https://ergast.com/api/f1/${year}/driverStandings.json`);
      const data = await response.json();
      
      if (!data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
        throw new Error('Некорректный формат данных');
      }

      const drivers = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      const total = parseInt(data.MRData.total, 10);

      const formattedDrivers: DriverStanding[] = drivers.map((driver: any) => ({
        position: driver.position,
        positionText: driver.positionText || driver.position,
        points: driver.points,
        wins: driver.wins || '0',
        Driver: {
          driverId: driver.Driver.driverId,
          permanentNumber: driver.Driver.permanentNumber || '',
          code: driver.Driver.code,
          url: driver.Driver.url,
          givenName: driver.Driver.givenName,
          familyName: driver.Driver.familyName,
          dateOfBirth: driver.Driver.dateOfBirth,
          nationality: driver.Driver.nationality,
        },
        Constructors: driver.Constructors.map((constructor: any) => ({
          constructorId: constructor.constructorId,
          url: constructor.url,
          name: constructor.name,
          nationality: constructor.nationality,
        })),
        year: String(year),
      }));

      if (page === 1) {
        dispatch(setStandings({ drivers: formattedDrivers, total, year }));
      } else {
        dispatch(appendStandings({ drivers: formattedDrivers, total, year }));
      }

      return { drivers: formattedDrivers, total };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных гонщиков';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      if (page === 1) {
        dispatch(setLoading(false));
      }
    }
  }
);

export const fetchDriverStandingsThunk = createAsyncThunk(
  'driverStandings/fetch',
  async ({ year, page }: FetchDriverStandingsParams, { dispatch, rejectWithValue, signal, getState }) => {
    try {
      if (page === 1) {
        const state = getState() as any;
        const cachedData = state.driverStandings.cache[year];
        
        if (cachedData) {
          dispatch(loadFromCache(year));
          return { drivers: cachedData.standings, total: cachedData.totalDrivers };
        }
        
        dispatch(setLoading(true));
        dispatch(resetStandings());
      }

      const offset = (page - 1) * DRIVERS_PER_PAGE;
      const data = await f1Api.getDriverStandings(year, DRIVERS_PER_PAGE, offset, signal);
      const drivers = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
      const total = parseInt(data.MRData.total, 10);
      console.log('drivers: '+ drivers.length);
      console.log(data);
      const formattedDrivers: DriverStanding[] = drivers.map((driver: any) => ({
        position: driver.position,
        positionText: driver.positionText || driver.position,
        points: driver.points,
        wins: driver.wins || '0',
        Driver: {
          driverId: driver.Driver.driverId,
          permanentNumber: driver.Driver.permanentNumber,
          code: driver.Driver.code,
          url: driver.Driver.url,
          givenName: driver.Driver.givenName,
          familyName: driver.Driver.familyName,
          dateOfBirth: driver.Driver.dateOfBirth,
          nationality: driver.Driver.nationality,
        },
        Constructors: driver.Constructors.map((constructor: any) => ({
          constructorId: constructor.constructorId,
          url: constructor.url,
          name: constructor.name,
          nationality: constructor.nationality,
        })),
        year: String(year),
      }));

      if (page === 1) {
        dispatch(setStandings({ drivers: formattedDrivers, total, year }));
      } else {
        dispatch(appendStandings({ drivers: formattedDrivers, total, year }));
      }

      return { drivers: formattedDrivers, total };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
        return rejectWithValue('Request was cancelled');
      }
      console.error('Error fetching driver standings:', error);
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch driver standings'));
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch driver standings');
    } finally {
      if (page === 1) {
        dispatch(setLoading(false));
      }
    }
  }
); 