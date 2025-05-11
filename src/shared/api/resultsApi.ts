import { axiosInstance } from './axios';
import { GrandPrix, Result } from '../types/results';

export const resultsApi = {
  async getGrandPrixList(year: number): Promise<GrandPrix[]> {
    const res = await axiosInstance.get(`/${year}.json`);
    
    return res.data.MRData.RaceTable.Races.map((race: any) => ({
      round: Number(race.round),
      raceName: race.raceName.replace(' Grand Prix', ''),
      date: race.date,
    }));
  },
  async getResultsByGrandPrix(year: number, round: number): Promise<Result[]> {
    const res = await axiosInstance.get(`/${year}/${round}/results.json`);
    const results = res.data.MRData.RaceTable.Races[0]?.Results || [];
    return results.map((item: any) => ({
      position: item.position,
      driver: `${item.Driver.givenName} ${item.Driver.familyName}`,
      grid: item.grid,
      points: item.points,
    }));
  },
}; 