import Gateway, { fileFormData, ResponseType } from './Gateway';
import { Rating, ResponseTime, User, UserType, QueryResponse, Visit } from 'api';
import Kit, { Gateway as JSGateway } from 'javascript-dev-kit';
import AuthService from '../services/AuthService';
import axios from 'axios';
import FileAsset from '../helpers/file-manager/FileAsset';
import { replaceArabicChars } from '../helpers';

export default class UserApi {
  public static sendPostVisit_Doctor(visit_id: string, return_cost: boolean): ResponseType<Visit[]> {
    return Gateway.post('/api/users/postvisit_doctor', { visit_id, return_cost });
  }

  public static sendPostVisit_Patient(rating: Rating): ResponseType<Visit[]> {
    return Gateway.post('/api/users/postvisit_patient', rating);
  }

  public static getTermsAndConditions(): ResponseType<string> {
    return Gateway.get('/api/users/termsandconditions');
  }

  public static iplookup() {
    return Gateway.post('/api/users/iplookup', { data: 'dummy data' });
  }

  public static patchProfile({ name, gender }): ResponseType<User> {
    return Gateway.patch('/api/users', { name, gender });
  }

  public static getDoctors(skip: number, limit: number, search = ''): ResponseType<QueryResponse<User>> {
    search = Kit.numbersToEnglish(replaceArabicChars(search));
    // @ts-ignore
    return JSGateway.withCancelerGroup('get-doctor').get(`/api/users/query?skip=${skip}&limit=${limit}&search=${search}&type=${UserType.DOCTOR}`);
  }

  public static postProfileImage(file: FileAsset): ResponseType<string> {
    // @ts-ignore
    return file.upload(axios.defaults.baseURL + '/api/users/profileimage', undefined, undefined);
  }

  public static updateMyWorkTimes(workTimes: { 0: ResponseTime[]; 1: ResponseTime[]; 2: ResponseTime[]; 3: ResponseTime[]; 4: ResponseTime[]; 5: ResponseTime[]; 6: ResponseTime[] }): ResponseType<void> {
    return Gateway.patch('/api/users/worktimes', workTimes);
  }

  public static getMyWorkTimes(): ResponseType<{ 0: ResponseTime[]; 1: ResponseTime[]; 2: ResponseTime[]; 3: ResponseTime[]; 4: ResponseTime[]; 5: ResponseTime[]; 6: ResponseTime[] }> {
    return Gateway.get('/api/users/worktimes');
  }
}
