import { RootState } from '../../../app/store';

export const selectDriverStandings = (state: RootState) => state.driverStandings.standings;
export const selectDriverStandingsLoading = (state: RootState) => state.driverStandings.loading;
export const selectDriverStandingsError = (state: RootState) => state.driverStandings.error;
export const selectHasMore = (state: RootState) => state.driverStandings.hasMore;
export const selectCachedYear = (year: number) => (state: RootState) => state.driverStandings.cache[year]; 