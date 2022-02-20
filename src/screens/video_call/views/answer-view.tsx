import React, { useEffect, useState } from 'react';
import { CallAnalytics, CallMetricsEvent, ConferenceType, User, Visit } from 'api';
import { useDispatch, useSelector } from 'react-redux';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppView from '../../../components/base/app-view/AppView';
import CameraView from '../camera-view/CameraView';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppImageView from '../../../components/base/app-image/app-imageview';
import CallApi from '../../../network/CallApi';
import R from '../../../assets/R';
import { actionClearCall, actionSetCallConnection } from '../../../redux/actions/call_actions';
import AppLottieView from '../../../components/base/app-lottieview/AppLottieView';
import AnswerButtonsView from './answer-buttons-view';
import P2PRoom from '../v3/P2PRoom';
import Analytics from '../../../analytics/analytics';
import { getDeviceInfo } from '../../../helpers';
import dictionary from '../../../assets/strings/dictionary';
import useUser from '../../../hooks/useUser';
import useActiveCall from '../../../hooks/useActiveCall';
import useActiveVisit from '../../../hooks/useActiveVisit';

export default function AnswerView() {
  const user = useUser();
  const connection = useActiveCall() as P2PRoom;
  const visit = useActiveVisit() as Visit;
  const imageUrl = user.type === 'PATIENT' ? visit.doctor.imageUrl : visit.patient.imageUrl;
  const name = user.type === 'PATIENT' ? visit.doctor.name : visit.patient.name;
  const [localStream, setLocalStream] = useState(undefined as any);
  const dispatch = useDispatch();

  useEffect(() => {
    connection.getPeerLocalStream().addListener((stream) => {
      console.log('stream', stream);
      if (connection.type === ConferenceType.video_audio) {
        setLocalStream(stream);
      }
    });
  }, []);

  return (
    <AppContainer style={{ width: '100%', height: '100%' }}>
      {connection.type === ConferenceType.video_audio && (
        <AppView style={{ width: '100%', height: '100%' }}>
          <CameraView localStream={localStream} style={{ height: '100%', width: '100%' }} />
          <AppView style={{ height: hp(100), width: wp(100), backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2, position: 'absolute' }} />
          <AppTextView style={{ position: 'absolute', bottom: hp(70), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), textAlign: 'center', zIndex: 2 }} textColor="#FFFFFF" text={dictionary.receiving_video_call_from} />
          <AppTextView style={{ position: 'absolute', bottom: hp(62), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(6), textAlign: 'center', zIndex: 2 }} textColor="#FFFFFF" text={name} />
        </AppView>
      )}
      {connection.type === ConferenceType.audio && (
        <AppView style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
          <AppView style={{ height: wp(100), width: '100%', backgroundColor: '#198b8c', justifyContent: 'center', alignItems: 'center' }}>
            <AppView style={{ height: '40%', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <AppImageView defaultImage={R.images.user_empty_view} src={imageUrl} resizeMode="cover" style={{ width: '60%', height: '60%', alignSelf: 'center', zIndex: 100, borderRadius: 100 }} />
              <AppLottieView style={{ width: '100%', height: '100%', alignSelf: 'center', position: 'absolute' }} width={'100%'} height={'100%'} animation={R.animations.patient_waiting_anim} loop />
            </AppView>
            {/* <AppImageView resizeMode='cover' style={{ width: wp(35), height: wp(35), position: 'absolute', alignSelf: 'center', top: hp(19.4), zIndex: 100, borderRadius: 100 }} src={{ uri: imageUrl }} />
                        <AppLottieView
                            style={{ width: wp(100), alignSelf: 'center', position: 'absolute' }}
                            width={wp(100)}
                            height={hp(100)}
                            loop={true}
                            animation={R.animations.caller_pulse}
                        /> */}
            <AppTextView style={{ position: 'absolute', bottom: hp(10), alignSelf: 'center', fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), textAlign: 'center' }} textColor="#FFFFFF" text={dictionary['دریافت تماس از']} />
            <AppView style={{ position: 'absolute', bottom: 0, width: '100%', height: hp(8), backgroundColor: '#50bcbd', alignItems: 'center', justifyContent: 'center' }}>
              <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(6), textAlign: 'center' }} textColor="#FFFFFF" text={name} />
            </AppView>
          </AppView>
        </AppView>
      )}
      <AnswerButtonsView
        onAccept={() => {
          Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.ACCEPT_CLICKED));
          getDeviceInfo(false).then((deviceInfo) => {
            CallApi.acceptCall(connection.session, deviceInfo).catch((e) => {
              console.log(e);
              dispatch(actionClearCall());
            });
          });
          connection.session.state = 'transmitting';
          dispatch(actionSetCallConnection(connection));
        }}
        onReject={() => {
          Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.REJECT_CLICKED));
          dispatch(actionClearCall());
        }}
      />
    </AppContainer>
  );
}
