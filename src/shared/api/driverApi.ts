import { DriverDetailsResponse, DriverAchievements } from '../types/driver';
import { axiosInstance } from './axios';
import { handleApiError, BaseRequestParams } from './apiUtils';

export type GetDriverDetailsParams = BaseRequestParams & {
  driverId: string;
};

export const getDriverDetails = async ({
  driverId,
  signal
}: GetDriverDetailsParams): Promise<DriverDetailsResponse> => {
  try {
    const response = await axiosInstance.get<DriverDetailsResponse>(
      `/drivers/${driverId}.json`,
      { signal }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getDriverDetails');
  }
};

export type GetDriverAchievementsParams = BaseRequestParams & {
  driverId: string;
};

export const getDriverAchievements = async ({
  driverId,
  signal
}: GetDriverAchievementsParams): Promise<DriverAchievements> => {
  try {
    let allResults: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await axiosInstance.get(`/drivers/${driverId}/results.json`, {
        params: { limit, offset },
        signal
      });
      
      const data = response.data;
      const results = data.MRData.RaceTable.Races || [];
      
      allResults = [...allResults, ...results];
      
      const total = parseInt(data.MRData.total);
      offset += limit;
      hasMore = offset < total;
    }

    const stats = allResults.reduce((acc: any, race: any) => {
      const result = race.Results[0];
      if (!result) return acc;

      if (result.position === '1') acc.wins++;
      if (result.position === '2') acc.secondPlaces++;
      if (result.position === '3') acc.thirdPlaces++;
      if (['1', '2', '3'].includes(result.position)) acc.podiums++;
      if (result.grid === '1') acc.polePositions++;
      acc.careerPoints += parseInt(result.points) || 0;
      
      return acc;
    }, {
      wins: 0,
      secondPlaces: 0,
      thirdPlaces: 0,
      podiums: 0,
      polePositions: 0,
      careerPoints: 0
    });

    const seasons = new Set(allResults.map((race: any) => race.season)).size;

    const championshipsResponse = await axiosInstance.get(
      `/drivers/${driverId}/driverStandings/1.json`,
      { signal }
    );
    const championshipsData = championshipsResponse.data;

    return {
      championships: parseInt(championshipsData.MRData.total) || 0,
      wins: stats.wins,
      secondPlaces: stats.secondPlaces,
      thirdPlaces: stats.thirdPlaces,
      podiums: stats.podiums,
      polePositions: stats.polePositions,
      careerPoints: stats.careerPoints,
      seasons
    };
  } catch (error) {
    return handleApiError(error, 'getDriverAchievements');
  }
}; 