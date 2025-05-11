import { RootState } from '../../../../app/store/index';

export const selectDriverDetails = (state: RootState) => state.driverDetails.details;
export const selectDriverDetailsLoading = (state: RootState) => state.driverDetails.loading;
export const selectDriverDetailsError = (state: RootState) => state.driverDetails.error; 