import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriverDetails } from './types';
import { AppDispatch } from '../../../app/store';
import { getDriverDetails, getDriverAchievements } from '../../../shared/api/driverApi';
import {
  fetchDriverDetailsStart,
  fetchDriverDetailsSuccess,
  fetchDriverDetailsFailure,
} from './driverDetailsSlice';

export const fetchDriverDetails = createAsyncThunk(
  'driverDetails/fetchDriverDetails',
  async (driverId: string, { dispatch }: { dispatch: AppDispatch }) => {
    try {
      dispatch(fetchDriverDetailsStart());
      
      const [detailsResponse, achievements] = await Promise.all([
        getDriverDetails(driverId),
        getDriverAchievements(driverId)
      ]);

      const driver = detailsResponse.MRData.DriverTable.Drivers[0];
      
      const driverDetails: DriverDetails = {
        driverId: driver.driverId,
        permanentNumber: driver.permanentNumber,
        code: driver.code,
        url: driver.url,
        givenName: driver.givenName,
        familyName: driver.familyName,
        dateOfBirth: driver.dateOfBirth,
        nationality: driver.nationality,
        achievements: {
          championships: achievements.championships,
          wins: achievements.wins,
          firstPlaces: achievements.wins,
          secondPlaces: achievements.secondPlaces,
          podiums: achievements.podiums,
          polePositions: achievements.polePositions
        }
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