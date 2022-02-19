import { DoctorStatus, PatientStatus, User } from 'api';
import { useSelector } from 'react-redux';
import { StoreType } from '../redux/Store';

export default function useStatus(): PatientStatus | DoctorStatus {
  return useSelector<StoreType, PatientStatus | DoctorStatus>((state) => state.userReducer.status);
}
