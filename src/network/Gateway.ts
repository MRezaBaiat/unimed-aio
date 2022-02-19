import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthService from '../services/AuthService';

export type ResponseType<T> = AxiosPromise<T>;

const limitStatus = async (payload) => {
  if (payload.status !== 200 && payload.status !== 201) return Promise.reject(new Error('status received was ' + payload.status));
  return Promise.resolve(payload);
};

const handleError = async (error) => {
  console.log('error in gateway');
  console.log(error);
  if (error.response) {
    if (error.response.status === 401) {
      AuthService.logOut();
    }
  } else if (error.request) {
  } else {
  }
  return Promise.reject(error);
};

export default class Gateway {
  private static client = axios;

  public static setAxiosInstance(axios: any) {
    this.client = axios;
  }

  static put<T>(url: string, body: any, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'PUT', headers, { ...config, data: body });
  }

  static get<T>(url: string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'GET', headers, config);
  }

  static post<T>(url: string, body: any, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'POST', headers, { ...config, data: body });
  }

  static patch<T>(url: string, body: {} | string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'PATCH', headers, { ...config, data: body });
  }

  static delete<T>(url: string, body?: {} | string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'DELETE', headers, { ...config, data: body });
  }

  // @ts-ignore
  static execute = <T>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' = 'GET', headers = {}, config: AxiosRequestConfig): ResponseType<T> =>
    this.client
      .request(url, {
        ...config,
        headers,
        method,
      })
      .then(limitStatus)
      .catch(handleError);
}

export function fileFormData(filePath: string, type = 'image/jpeg') {
  const formData = new FormData();
  formData.append('file', {
    // @ts-ignore
    uri: filePath,
    type: type,
    name: 'photo.jpg',
  });
  return formData;
}
