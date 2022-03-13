import { PatientStatus, DoctorStatus, User, Visit } from 'api';
import { updateDictionaryLang } from '../../assets/strings/dictionary';
import config from '../../config/config';
import Axios from 'axios';
import ChatService from '../../services/ChatService';
import { handleStateChange } from './actions';
import AppNavigator from '../../navigation/AppNavigator';
import R from '../../assets/R';

export const ACTION_SET_USER = 'ACTION_SET_USER';
export const ACTION_SET_STATUS = 'ACTION_SET_STATUS';
export const ACTION_SET_FINALIZABLE_VISITS = 'ACTION_SET_FINALIZABLE_VISITS';
export const ACTION_SET_IP_ALLOWED = 'ACTION_SET_IP_ALLOWED';
export const ACTION_SET_LANG = 'ACTION_SET_LANG';

export const actionSetUser = (user: User | null) => {
  return {
    type: ACTION_SET_USER,
    payload: user,
  };
};

export const actionSetLang = (lang: 'az' | 'en') => {
  updateDictionaryLang(lang);
  config.saveLanguage(lang);
  ChatService.setLanguage(lang);
  if (lang === 'az') {
    R.fonts.fontFamily = 'Gilroy-Light';
    R.fonts.fontFamily_Bold = 'Gilroy-ExtraBold';
    R.fonts.fontFamily_faNum = 'Gilroy-Light';
    R.fonts.fontFamily_faNum_Bold = 'Gilroy-ExtraBold';
  } else {
    R.fonts.fontFamily = 'Shabnam';
    R.fonts.fontFamily_Bold = 'Shabnam-Bold';
    R.fonts.fontFamily_faNum = 'Shabnam-FD';
    R.fonts.fontFamily_faNum_Bold = 'Shabnam-Bold-FD';
  }
  Axios.defaults.headers.common['Accept-Language'] = lang;
  return {
    type: ACTION_SET_LANG,
    payload: lang,
  };
};

export const actionSetStatus = (status: PatientStatus | DoctorStatus) => {
  return (dispatch, getState) => {
    dispatch({
      type: ACTION_SET_STATUS,
      payload: status,
    });
    dispatch(handleStateChange());
  };
};

export const actionSetFinalizableVisits = (visits: Visit[]) => {
  return {
    type: ACTION_SET_FINALIZABLE_VISITS,
    payload: visits,
  };
};

export const actionSetIpAllowed = (allowed: boolean) => {
  return {
    type: ACTION_SET_IP_ALLOWED,
    payload: allowed,
  };
};
