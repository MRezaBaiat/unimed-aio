import Gateway, { ResponseType } from './Gateway';
import { QueryResponse, Transaction } from 'api';
import { Platform } from 'react-native';

export default class TransactionsApi {
  public static getTransactions(skip: number, limit: number): ResponseType<QueryResponse<Transaction>> {
    return Gateway.get(`/api/transactions?skip=${skip}&limit=${limit}`);
  }

  public static getGatewayUrl(amount: number, doctorCode: string): ResponseType<string> {
    return Gateway.get(`/api/gateway/token?amount=${amount}&os=${Platform.OS}&doctorCode=${doctorCode}`);
  }

  public static getServiceRequestsGatewayUrl(amount: number, requestId: string): ResponseType<string> {
    return Gateway.get(`/api/gateway/service-requests-token?amount=${amount}&requestId=${requestId}&os=${Platform.OS}`);
  }
}
