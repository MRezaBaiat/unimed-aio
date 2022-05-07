import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Kit from 'javascript-dev-kit';
import { useDispatch, useSelector } from 'react-redux';
import RemoteView from '../remote-view/RemoteView';
import CameraView from '../camera-view/CameraView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppView from '../../../components/base/app-view/AppView';
import AppImageView from '../../../components/base/app-image/app-imageview';
import { CallAnalytics, CallMetricsEvent, ConferenceType, User, Visit } from 'api';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import R from '../../../assets/R';
import { actionClearCall } from '../../../redux/actions/call_actions';
import StateView from './state-view';
import AppHeader from '../../../components/composite/header/AppHeader';
import AppNavigator from '../../../navigation/AppNavigator';
import StatsView from './stats-view';
import P2PRoom from '../v3/P2PRoom';
import AnswerButtonsView from './answer-buttons-view';
import CallButtonsView from './call-buttons-view';
import CallManager from '../call-manager/CallManager';
import Analytics from '../../../analytics/analytics';
import dictionary from '../../../assets/strings/dictionary';
import useActiveCall from '../../../hooks/useActiveCall';
import useUser from '../../../hooks/useUser';
import useActiveVisit from '../../../hooks/useActiveVisit';

function TransmittingView(props) {
  const connection = useActiveCall() as P2PRoom;
  const user = useUser();
  const visit = useActiveVisit() as Visit;
  const imageUrl = user.type === 'PATIENT' ? visit!.doctor.imageUrl : visit!.patient.imageUrl;
  const name = user.type === 'PATIENT' ? visit!.doctor.name : visit!.patient.name;
  const [speakerOn, setSpeakerOn] = useState(connection && connection.callManager.isSpeakerPhoneOn());
  const [localStream, setLocalStream] = useState(undefined as any);
  const [remoteStream, setRemoteStream] = useState(undefined as any);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState('connecting' as string);

  const dispatch = useDispatch();

  useEffect(() => {
    connection.callManager.startTransmitting(connection.type);
    connection.getPeerLocalStream().addListener((stream) => {
      if (connection.type === ConferenceType.video_audio) {
        setLocalStream(stream);
      }
      setMuted(connection.getPeerLocalStream().isMuted());
    });
    connection.addListener((peers) => {
      console.log('remote available');
      setRemoteStream(peers[0]);
    });
    const sub = connection.callManager.addListener(() => {
      setSpeakerOn(connection.callManager.isSpeakerPhoneOn());
    });
    connection.start();
    return () => {
      sub.unregister();
    };
  }, []);

  useEffect(() => {
    const listener = () => {
      remoteStream && setState(remoteStream.getState());
    };
    remoteStream && remoteStream.addListener(listener);
    return () => {
      remoteStream && remoteStream.removeListener(listener);
    };
  }, [remoteStream]);

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      {
        <AppHeader
          onBackPress={() => {
            if (!connection.callManager.isHeadsetPluggedIn()) {
              connection.callManager.setSpeakerEnabled(true);
            }
            AppNavigator.goBack();
          }}
        />
      }
      <AppView style={{ flex: 1 }}>
        {remoteStream && (
          <RemoteView
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
        )}
        {localStream && connection.type === ConferenceType.video_audio && (
          <CameraView
            localStream={localStream}
            style={{
              position: 'absolute',
              height: 150,
              width: 100,
              top: hp(3),
              right: wp(1),
            }}
          />
        )}
        {connection.type === ConferenceType.audio && (
          <AppView
            style={{
              height: hp(100),
              width: wp(100),
              alignItems: 'center',
              backgroundColor: '#50BCBD',
              justifyContent: 'center',
            }}
          >
            <AppView
              style={{
                height: hp(78),
                width: wp(100),
                marginTop: hp(22),
                backgroundColor: '#FFFFFF',
              }}
            >
              <AppImageView
                resizeMode="cover"
                style={{
                  width: wp(35),
                  height: wp(35),
                  borderRadius: 100,
                  marginTop: wp(-17.5),
                  alignSelf: 'center',
                }}
                src={imageUrl}
              />
              <AppTextView
                style={{
                  alignSelf: 'center',
                  fontFamily: R.fonts.fontFamily_faNum_Bold,
                  fontSize: wp(6),
                  textAlign: 'center',
                  marginTop: hp(3),
                }}
                textColor="#38488A"
                text={name}
              />
              {/* <AppTextView
                    style={{
                      alignSelf: 'center',
                      fontSize: wp(6),
                      textAlign: 'center',
                      marginTop: hp(3),
                      fontFamily: R.fonts.fontFamily_faNum
                    }}
                    textColor="#38488A"
                    text={` ${
                        minutes.toString().length === 1
                            ? '0' + minutes.toString()
                            : minutes.toString()
                    }:${
                        seconds.toString().length === 1
                            ? '0' + seconds.toString()
                            : seconds.toString()
                    }`}
                /> */}
            </AppView>
          </AppView>
        )}
      </AppView>
      <AnswerButtonsView
        onReject={() => {
          Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.END_CALL_CLICKED));
          dispatch(actionClearCall());
        }}
      />
      <CallButtonsView
        onSwitchCamera={
          connection.type === ConferenceType.video_audio
            ? () => {
                Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.CAMERA_SWITCH_CLICKED));
                connection.getPeerLocalStream().switchCamera();
              }
            : undefined
        }
        speakerOn={speakerOn}
        muted={muted}
        onMute={() => {
          Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.MUTE_CLICKED));
          connection.getPeerLocalStream().toggleMute();
        }}
        onSpeaker={
          Platform.OS !== 'web'
            ? () => {
                Analytics.send(new CallAnalytics.AbstractCallMetric(connection.session.id, CallMetricsEvent.SPEAKER_CLICKED));
                connection.callManager.setSpeakerEnabled(!speakerOn);
                // setSpeakerOn(!speakerOn);
              }
            : undefined
        }
      />
      {remoteStream && <StatsView connection={connection} />}
      {state !== 'connected' && <StateView text={dictionary.connecting} />}
    </View>
  );
}

export default React.memo(TransmittingView);
