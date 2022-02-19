import Gateway, { ResponseType } from './Gateway';
import { Chat, DiscountCoupon, QueryResponse, Specialization, Visit } from 'api';
import Kit from 'javascript-dev-kit';

export default class VisitApi {
  public static initiateVisit(doctorCode: string): ResponseType<{ error: string; cost: number; currency: number; name: string; specialization: Specialization }> {
    doctorCode = Kit.numbersToEnglish(String(doctorCode));
    return Gateway.get(`/api/visits/initiate_visit?code=${doctorCode}`);
  }

  public static getDiscountInfo(code: string): ResponseType<{ error?: string; amount?: number; _id?: string }> {
    code = Kit.numbersToEnglish(code);
    return Gateway.get(`/api/discounts?code=${code}`);
  }

  public static getVisitHistories(targetId: string | undefined, skip: number, limit: number): ResponseType<QueryResponse<Visit>> {
    return Gateway.get(`/api/visits/history?skip=${skip}&limit=${limit}&target=${targetId}`);
  }

  public static getConversationHistory(visitId: string): ResponseType<Chat[]> {
    return Gateway.get(`/api/visits/conversations?id=${visitId}`);
  }
}
