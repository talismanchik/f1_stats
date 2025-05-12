import { DriverStandingsResponse } from '../types/driver';
import { axiosInstance } from './axios';
import { createAbortController, handleApiError, BaseRequestParams } from './apiUtils';

const abortController = createAbortController();

export type GetDriverStandingsParams = BaseRequestParams & {
  year: number;
};

export const getDriverStandings = async ({
  year,
  limit = 10,
  offset = 0,
  signal
}: GetDriverStandingsParams): Promise<DriverStandingsResponse> => {
  const controller = abortController.getController();
  const currentSignal = signal || controller.signal;

  try {
    const response = await axiosInstance.get<DriverStandingsResponse>(
      `/${year}/driverStandings.json`,
      {
        params: { limit, offset },
        signal: currentSignal,
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, 'getDriverStandings');
  }
}; 