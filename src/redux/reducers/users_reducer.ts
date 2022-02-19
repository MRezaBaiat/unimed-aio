import * as actions from '../actions/users_actions';
import { PatientStatus, DoctorStatus, User, Visit } from 'api';

export interface InitialState {
  user: User;
  status: PatientStatus | DoctorStatus;
  finalizableVisits: Visit[];
  isIpAllowed: boolean;
  lang: string;
}
const initialState: InitialState = {
  user: null as any,
  status: null as any,
  finalizableVisits: [],
  isIpAllowed: true,
  lang: 'fa',
};

const userReducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actions.ACTION_SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case actions.ACTION_SET_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case actions.ACTION_SET_LANG:
      return {
        ...state,
        lang: action.payload,
      };
    case actions.ACTION_SET_FINALIZABLE_VISITS:
      return {
        ...state,
        finalizableVisits: action.payload,
      };
    case actions.ACTION_SET_IP_ALLOWED:
      return {
        ...state,
        isIpAllowed: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
