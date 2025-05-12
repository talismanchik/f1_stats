import { axiosInstance } from './axios';
import { GrandPrix, Result } from '../types/results';
import { handleApiError, BaseRequestParams } from './apiUtils';

export type GetGrandPrixListParams = BaseRequestParams & {
  year: number;
};

export type GetResultsByGrandPrixParams = BaseRequestParams & {
  year: number;
  round: number;
};

export const getGrandPrixList = async ({
  year,
  signal
}: GetGrandPrixListParams): Promise<GrandPrix[]> => {
  try {
    const response = await axiosInstance.get(`/${year}.json`, { signal });
    
    return response.data.MRData.RaceTable.Races.map((race: any) => ({
      round: Number(race.round),
      raceName: race.raceName.replace(' Grand Prix', ''),
      date: race.date,
    }));
  } catch (error) {
    return handleApiError(error, 'getGrandPrixList');
  }
};

export const getResultsByGrandPrix = async ({
  year,
  round,
  signal
}: GetResultsByGrandPrixParams): Promise<Result[]> => {
  try {
    console.log('getResultsByGrandPrix');
    
    const response = await axiosInstance.get(`/${year}/${round}/results.json`, { signal });
    const results = response.data.MRData.RaceTable.Races[0]?.Results || [];
    
    return results.map((item: any) => ({
      position: item.position,
      driver: `${item.Driver.givenName} ${item.Driver.familyName}`,
      grid: item.grid,
      points: item.points,
    }));
  } catch (error) {
    return handleApiError(error, 'getResultsByGrandPrix');
  }
}; 