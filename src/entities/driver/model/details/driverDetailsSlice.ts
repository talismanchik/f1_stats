import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverDetails } from '../../../../shared/types/driver';

interface DriverDetailsState {
  details: DriverDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: DriverDetailsState = {
  details: null,
  loading: false,
  error: null,
};

export const driverDetailsSlice = createSlice({
  name: 'driverDetails',
  initialState,
  reducers: {
    fetchDriverDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDriverDetailsSuccess: (state, action: PayloadAction<DriverDetails>) => {
      state.loading = false;
      state.details = action.payload;
    },
    fetchDriverDetailsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDriverDetailsStart,
  fetchDriverDetailsSuccess,
  fetchDriverDetailsFailure,
} = driverDetailsSlice.actions;

export default driverDetailsSlice.reducer; 