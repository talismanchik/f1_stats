import { createAsyncThunk } from '@reduxjs/toolkit';
import { DriverDetails } from '../../../../shared/types/driver';
import { getDriverDetails, getDriverAchievements } from '../../../../shared/api/driverApi';

export const fetchDriverDetails = createAsyncThunk<DriverDetails, string>(
  'driverDetails/fetchDriverDetails',
  async (driverId, { signal, rejectWithValue }) => {
    try {
      const [detailsResponse, achievements] = await Promise.all([
        getDriverDetails({ driverId, signal }),
        getDriverAchievements({ driverId, signal })
      ]);

      const driver = detailsResponse.MRData.DriverTable.Drivers[0];
      
      if (!driver) {
        return rejectWithValue('Гонщик не найден');
      }
      
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

      return driverDetails;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Не удалось загрузить данные гонщика');
    }
  }
); 