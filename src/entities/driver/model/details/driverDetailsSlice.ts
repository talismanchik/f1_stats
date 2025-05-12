import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DriverDetails } from '../../../../shared/types/driver';
import { fetchDriverDetails } from './driverDetailsThunks';

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
    resetDriverDetails: (state) => {
      state.details = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchDriverDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch driver details';
      });
  }
});

export const { resetDriverDetails } = driverDetailsSlice.actions;

export default driverDetailsSlice.reducer; 