import axios from 'axios';

const BASE_URL = 'https://ergast.com/api/f1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для обработки ошибок
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Сервер ответил с ошибкой
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      console.error('Request error:', error.request);
    } else {
      // Ошибка при настройке запроса
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
); 