import axios, { AxiosError } from 'axios';

// Типы для ошибок
export type ApiErrorType = {
  message: string;
  status?: number;
  code?: string;
  name: string;
};

// Создаем ошибку API
export const createApiError = (message: string, status?: number, code?: string): ApiErrorType => ({
  message,
  status,
  code,
  name: 'ApiError'
});

// Фабрика для создания контроллера отмены запросов
export const createAbortController = () => {
  let controller: AbortController | null = null;

  return {
    getController: () => {
      if (controller) {
        controller.abort();
      }
      controller = new AbortController();
      return controller;
    }
  };
};

// Общая функция обработки ошибок
export const handleApiError = (error: unknown, context: string): never => {
  if (axios.isCancel(error)) {
    throw createApiError('Запрос был отменен');
  }

  if (error instanceof AxiosError) {
    if (error.response) {
      throw createApiError(
        `Ошибка сервера: ${error.response.status}`,
        error.response.status,
        error.code
      );
    }
    if (error.request) {
      throw createApiError('Нет ответа от сервера');
    }
  }

  console.error(`Ошибка в ${context}:`, error);
  throw createApiError(`Ошибка при выполнении запроса: ${context}`);
};

// Типы для параметров
export type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type BaseRequestParams = PaginationParams & {
  signal?: AbortSignal;
}; 