import { DriverDetailsResponse, DriverAchievements } from '../types/driver';
import { axiosInstance } from './axios';

export const getDriverDetails = async (driverId: string): Promise<DriverDetailsResponse> => {
  try {
    const response = await axiosInstance.get(`/drivers/${driverId}.json`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch driver details:', error);
    throw new Error('Failed to fetch driver details');
  }
};

export const getDriverAchievements = async (driverId: string): Promise<DriverAchievements> => {
  try {
    let allResults: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await axiosInstance.get(`/drivers/${driverId}/results.json`, {
        params: {
          limit,
          offset
        }
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

    const championshipsResponse = await axiosInstance.get(`/drivers/${driverId}/driverStandings/1.json`);
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
    console.error('Failed to fetch driver achievements:', error);
    throw new Error('Failed to fetch driver achievements');
  }
}; 