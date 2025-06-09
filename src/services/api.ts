import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from '../utils/constants';

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'IdeaTec-ReactNative/1.0.0',
  },
});


api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Erro na requisição:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(`[API] Erro ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[API] Erro de rede:', error.message);
    } else {
      console.error('[API] Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
