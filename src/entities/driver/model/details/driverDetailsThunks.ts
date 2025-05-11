import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriverDetails } from '../../../../shared/types/driver';
import { getDriverDetails, getDriverAchievements } from '../../../../shared/api/driverApi';
import {
  fetchDriverDetailsStart,
  fetchDriverDetailsSuccess,
  fetchDriverDetailsFailure,
} from './driverDetailsSlice';

export const fetchDriverDetails = createAsyncThunk<DriverDetails, string>(
  'driverDetails/fetchDriverDetails',
  async (driverId, thunkAPI) => {
    try {
      thunkAPI.dispatch(fetchDriverDetailsStart());
      
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

      thunkAPI.dispatch(fetchDriverDetailsSuccess(driverDetails));
      return driverDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных гонщика';
      thunkAPI.dispatch(fetchDriverDetailsFailure(errorMessage));
      throw error;
    }
  }
); 