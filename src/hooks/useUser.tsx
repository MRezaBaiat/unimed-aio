import { User } from 'api';
import { useSelector } from 'react-redux';
import { StoreType } from '../redux/Store';

export default function useUser() {
  return useSelector<StoreType, User>((state) => state.userReducer.user);
}
