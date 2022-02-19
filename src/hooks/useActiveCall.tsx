import { useSelector } from 'react-redux';
import { StoreType } from '../redux/Store';

export default function useActiveCall() {
  const activeCall = useSelector<StoreType, StoreType['callReducer']['activeCall']>((s) => s.callReducer.activeCall);
  return activeCall ? activeCall.connection : undefined;
}
