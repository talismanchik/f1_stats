import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriverDetails } from './types';
import {
  fetchDriverDetailsStart,
  fetchDriverDetailsSuccess,
  fetchDriverDetailsFailure,
} from './driverDetailsSlice';

export const fetchDriverDetails = createAsyncThunk(
  'driverDetails/fetchDriverDetails',
  async (driverId: string, { dispatch }) => {
    try {
      dispatch(fetchDriverDetailsStart());
      
      // TODO: Заменить на реальный API запрос
      const response = await fetch(`https://ergast.com/api/f1/drivers/${driverId}.json`);
      const data = await response.json();
      
      const driverDetails: DriverDetails = {
        driverId: data.MRData.DriverTable.Drivers[0].driverId,
        permanentNumber: data.MRData.DriverTable.Drivers[0].permanentNumber,
        code: data.MRData.DriverTable.Drivers[0].code,
        url: data.MRData.DriverTable.Drivers[0].url,
        givenName: data.MRData.DriverTable.Drivers[0].givenName,
        familyName: data.MRData.DriverTable.Drivers[0].familyName,
        dateOfBirth: data.MRData.DriverTable.Drivers[0].dateOfBirth,
        nationality: data.MRData.DriverTable.Drivers[0].nationality,
        // TODO: Добавить реальные данные
        biography: 'Биография гонщика...',
        achievements: {
          championships: 0,
          wins: 0,
          podiums: 0,
          polePositions: 0,
          fastestLaps: 0,
        },
      };

      dispatch(fetchDriverDetailsSuccess(driverDetails));
      return driverDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных гонщика';
      dispatch(fetchDriverDetailsFailure(errorMessage));
      throw error;
    }
  }
); 