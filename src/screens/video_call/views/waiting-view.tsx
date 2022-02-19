import React, { useEffect, useState } from 'react';
import { CallAnalytics, CallMetricsEvent, ConferenceType, User, Visit } from 'api';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppView from '../../../components/base/app-view/AppView';
import CameraView from '../camera-view/CameraView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppImageView from '../../../components/base/app-image/app-imageview';
import R from '../../../assets/R';
import { useDispatch, useSelector } from 'react-redux';
import AppLottieView from '../../../components/base/app-lottieview/AppLottieView';
import AnswerButtonsView from './answer-buttons-view';
import { actionClearCall } from '../../../redux/actions/call_actions';
import P2PRoom from '../v3/P2PRoom';
import Analytics from '../../../analytics/analytics';
import dictionary from '../../../assets/strings/dictionary';
import { StoreType } from '../../../redux/Store';
import useActiveCall from '../../../hooks/useActiveCall';
import useUser from '../../../hooks/useUser';
import useStatus from '../../../hooks/useStatus';
import useActiveVisit from '../../../hooks/useActiveVisit';

export default function WaitingScreen() {
  const user = useUser();
  const visit = useActiveVisit() as Visit;
  const imageUrl = user.type === 'PATIENT' ? visit.doctor.imageUrl : visit.patient.imageUrl;
  const name = user.type === 'PATIENT' ? visit.doctor.name : visit.patient.name;
  const connection = useActiveCall() as P2PRoom;
  const [localStream, setLocalStream] = useState(undefined as any);
  const dispatch = useDispatch();

  useEffect(() => {
    connection.getPeerLocalStream().addListener((stream) => {
      if (connection.type === ConferenceType.video_audio) {
        console.log('stream', 'set');
        setLocalStream(stream);
      }
    });
  }, []);

  return (
    <AppContainer>
      {connection.type === ConferenceType.video_audio && (
        <AppView style={{ width: '100%', height: '100%' }}>
          <AppView style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2, position: 'absolute' }} />
          <CameraView localStream={localStream} style={{ height: '100%', width: '100%' }} />
          <AppTextView style={{ position: 'absolute', bottom: hp(70), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), textAlign: 'center', zIndex: 2 }} textColor="#FFFFFF" text={dictionary.video_calling_to} />
          <AppTextView style={{ position: 'absolute', bottom: hp(62), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(6), textAlign: 'center', zIndex: 2 }} textColor="#FFFFFF" text={name} />
        </AppView>
      )}
      {connection.type === ConferenceType.audio && (
        <AppView style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
          <AppView style={{ height: wp(100), width: '100%', backgroundColor: '#50bcbd', justifyContent: 'center', alignItems: 'center' }}>
            <AppView style={{ height: '40%', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <AppImageView defaultImage={R.images.user_empty_view} src={imageUrl} resizeMode="cover" style={{ width: '60%', height: '60%', alignSelf: 'center', zIndex: 100, borderRadius: 100 }} />
              <AppLottieView style={{ width: '100%', height: '100%', alignSelf: 'center', position: 'absolute' }} width={'100%'} height={'100%'} animation={R.animations.patient_waiting_anim} loop />
            </AppView>
            <AppTextView style={{ position: 'absolute', bottom: hp(10), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), textAlign: 'center' }} textColor="#FFFFFF" text={dictionary.calling_to} />
            <AppView style={{ position: 'absolute', bottom: 0, width: '100%', height: hp(8), backgroundColor: '#198b8c', alignItems: 'center', justifyContent: 'center' }}>
              <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(6), textAlign: 'center' }} textColor="#FFFFFF" text={name} />
            </AppView>
          </AppView>
        </AppView>
      )}
      <AnswerButtonsView
        onReject={() => {
          Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.REJECT_CLICKED));
          dispatch(actionClearCall());
        }}
      />
    </AppContainer>
  );
}
