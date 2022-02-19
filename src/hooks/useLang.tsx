import { User } from 'api';
import { useSelector } from 'react-redux';
import { StoreType } from '../redux/Store';

export default function useLang() {
  return useSelector<StoreType, string>((state) => state.userReducer.lang);
}
