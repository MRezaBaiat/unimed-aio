import Gateway, { fileFormData, ResponseType } from './Gateway';
import { AxiosPromise } from 'axios';
import { HealthCenter, QueryResponse, Transaction, User } from 'api';

export default class ChatApi {
  public static getHealthCenters(): ResponseType<HealthCenter[]> {
    return Gateway.get('/api/healthcenters');
  }

  public static getDoctorsIn(healthCenterId: string): ResponseType<User[]> {
    return Gateway.get(`/api/healthcenters/in?id=${healthCenterId}`);
  }
}
