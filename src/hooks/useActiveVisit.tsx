import { DoctorStatus, PatientStatus, User } from 'api';
import { useSelector } from 'react-redux';
import { StoreType } from '../redux/Store';
import useStatus from './useStatus';

export default function useActiveVisit() {
  const status = useStatus();
  return status.visit;
}
