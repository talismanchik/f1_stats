import { RootState } from '../../../app/store';

export const selectDrivers = (state: RootState) => state.drivers.drivers;
export const selectDriversLoading = (state: RootState) => state.drivers.loading;
export const selectDriversError = (state: RootState) => state.drivers.error; 