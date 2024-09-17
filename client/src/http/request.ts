import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';

import { apiBaseURL } from './config';
import { sessionStorageKey } from '@/utils/storage';

interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
}

export class Request {
  private instance: AxiosInstance;
  private defaultConfig: AxiosRequestConfig = {
    baseURL: apiBaseURL,
    timeout: 6000
  };
  constructor(config: AxiosRequestConfig) {
    const mergedConfig = { ...this.defaultConfig, ...config };
    this.instance = axios.create(mergedConfig);

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const apiError = error.response?.data;
        return Promise.reject(apiError);
      }
    );
  }

  public request(config: AxiosRequestConfig): Promise<any> {
    return this.instance.request(config);
  }

  public get<TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<APIResponse<TResponse>>> {
    return this.instance.get(url, config);
  }

  public post<TRequest = any, TResponse = any>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<APIResponse<TResponse>>> {
    return this.instance.post(url, data, config);
  }

  public put<TRequest = any, TResponse = any>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<APIResponse<TResponse>>> {
    return this.instance.put(url, data, config);
  }

  public delete<TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<APIResponse<TResponse>>> {
    return this.instance.delete(url, config);
  }

  public getToken(): string | null {
    return JSON.parse(sessionStorage.getItem(`${sessionStorageKey}authToken`) || 'null');
  }
}

export default new Request({});
