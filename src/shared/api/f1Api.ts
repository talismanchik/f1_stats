import axios, { AxiosError } from 'axios';
import { DriverStandingsResponse } from '../types/driver';
import { axiosInstance } from './axios';

class F1Api {
  private static instance: F1Api;
  private controller: AbortController | null = null;

  private constructor() {}

  public static getInstance(): F1Api {
    if (!F1Api.instance) {
      F1Api.instance = new F1Api();
    }
    return F1Api.instance;
  }

  private createController() {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    return this.controller;
  }

  public async getDriverStandings(
    year: number,
    limit: number = 10,
    offset: number = 0,
    signal?: AbortSignal
  ): Promise<DriverStandingsResponse> {
    const controller = this.createController();
    const currentSignal = signal || controller.signal;

    try {
      const response = await axiosInstance.get<DriverStandingsResponse>(
        `/${year}/driverStandings.json`,
        {
          params: {
            limit,
            offset,
          },
          signal: currentSignal,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error('Запрос был отменен');
      }
      if (error instanceof AxiosError) {
        if (error.response) {
          throw new Error(`Ошибка сервера: ${error.response.status}`);
        }
        if (error.request) {
          throw new Error('Нет ответа от сервера');
        }
      }
      throw new Error('Ошибка при выполнении запроса');
    }
  }
}

export const f1Api = F1Api.getInstance(); 