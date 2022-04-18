import React, { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { PatientStatus } from 'Api';
import ChatService from '../../../services/ChatService';
import R from '../../../assets/R';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppView from '../../../components/base/app-view/AppView';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppTouchable from '../../../components/base/app-touchable/AppTouchable';
import { hp, wp } from '../../../helpers/responsive-screen';
import QueueAnim from './queue-anim';
import { addFavoriteDoctor } from '../../../helpers';
import dictionary from '../../../assets/strings/dictionary';
import useStatus from '../../../hooks/useStatus';
import { StoreType } from '../../../redux/Store';
import useLang from '../../../hooks/useLang';

const QueueModeScreen = () => {
  const status = useStatus();
  const queue = useSelector<StoreType, number>((state) => state.queueReducer.queue);
  const estimated = useSelector<StoreType>((state) => state.queueReducer.estimated);
  const lang = useLang();

  useEffect(() => {
    if (status.visit?.doctor) {
      addFavoriteDoctor(status.visit.doctor);
    }
  }, []);

  return (
    <AppContainer>
      <AppView style={{ backgroundColor: '#50BCBD', height: hp(32), width: wp(100) }}>
        <AppView style={{ flex: 1 }} />
        <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AppTextView textColor="#FFFFFF" text={dictionary.soon_your_call_with} fontSize={wp(3.3)} />
        </AppView>
        <AppView style={{ flex: 1, backgroundColor: '#198b8c', justifyContent: 'center', alignItems: 'center' }}>
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(6) }} textColor="#FFFFFF" text={status.visit!.doctor.name} />
        </AppView>
        <AppView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AppTextView textColor="#FFFFFF" text={dictionary.will_establish} fontSize={wp(3.3)} />
        </AppView>
      </AppView>
      {estimated && (
        <AppView style={{ height: hp(6), width: wp(80), marginTop: hp(2), alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around' }}>
          <AppTextView textColor="#38488A" text={dictionary.estimated_queue_time} fontSize={wp(3.3)} />
          <AppView style={{ height: 0.4, backgroundColor: 'rgba(80,188,189,0.5)', flex: 1, marginHorizontal: 10, marginTop: hp(1) }} />
          <AppTextView textColor="#38488A" style={{ fontFamily: R.fonts.fontFamily_faNum_Bold }} text={`${estimated} ${dictionary['دقیقه'][lang]} `} />
        </AppView>
      )}
      {queue && (
        <AppView style={{ height: hp(6), width: wp(80), alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around' }}>
          <AppTextView textColor="#38488A" fontSize={wp(3.3)} text={dictionary.quantity_in_queue} />
          <AppView style={{ height: 0.4, backgroundColor: 'rgba(80,188,189,0.5)', flex: 1, marginHorizontal: 10, marginTop: hp(1) }} />
          <AppTextView textColor="#38488A" style={{ fontFamily: R.fonts.fontFamily_faNum_Bold }} text={`${queue - 1} ${dictionary.N} `} />
        </AppView>
      )}
      <QueueAnim />
      <AppTouchable
        onClick={() => {
          ChatService.endVisitRequest(status.visit!._id);
        }}
        style={{ height: hp(6.5), width: wp(76), backgroundColor: '#38488A', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', borderRadius: hp(1.2), bottom: hp(8), position: 'absolute' }}
      >
        <AppTextView text={dictionary.cancel_request} fontSize={wp(3.8)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold, textAlign: 'center' }} />
      </AppTouchable>
    </AppContainer>
  );
};
export default memo(QueueModeScreen);
