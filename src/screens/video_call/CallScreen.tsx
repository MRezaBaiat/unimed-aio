import React, { useEffect, useRef, useState } from 'react';
import AppContainer from '../../components/base/app-container/AppContainer';
import { useDispatch, useSelector } from 'react-redux';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import { BackHandler, StatusBar } from 'react-native';
import CallApi from '../../network/CallApi';
import ToastMaster from '../../helpers/ToastMaster';
import dictionary from '../../assets/strings/dictionary';
import { actionClearCall, actionSetCallConnection } from '../../redux/actions/call_actions';
import WaitingScreen from './views/waiting-view';
import AnswerView from './views/answer-view';
import TransmittingView from './views/transmitting-view';
import StateView from './views/state-view';
import ChatService from '../../services/ChatService';
import AppPermissions from '../../helpers/AppPermissions';
import P2PRoom from './v3/P2PRoom';
import { ConferenceType } from 'api';
import { getDeviceInfo } from '../../helpers';
import useActiveCall from '../../hooks/useActiveCall';

function CallScreen(props) {
  const { visitId, type } = getScreenParam(props);
  const dispatch = useDispatch();
  const connection = useActiveCall();
  const [initiating, setInitiating] = useState(!connection);

  useEffect(() => {
    if (connection && connection.session.state === 'initiating') {
      connection.callManager.startRing(connection.isInitiator);
    } else if (connection) {
      connection.callManager.stopRing();
    }
  }, [connection && connection.session.state]);

  useEffect(() => {
    const handleBackButton = () => {
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    const fn = async () => {
      if (!ChatService.isConnected()) {
        alert('ارتباط شما با سرور قطع می باشد');
        dispatch(actionClearCall());
        return AppNavigator.goBack();
      }

      if ((await AppPermissions.isMicrophoneBlocked()) || (type === ConferenceType.video_audio && (await AppPermissions.isCameraBlocked()))) {
        AppPermissions.alertNoPermission();
        dispatch(actionClearCall());
        return AppNavigator.goBack();
      }

      if (!connection) {
        getDeviceInfo(false).then((deviceInfo) => {
          CallApi.initiateCall(visitId, type, deviceInfo)
            .then((res) => {
              dispatch(actionSetCallConnection(new P2PRoom(res.data)));
              setInitiating(false);
            })
            .catch((e) => {
              console.log(e);
              ToastMaster.makeText(dictionary.error_connecting);
              AppNavigator.goBack();
            });
        });
      }
    };

    fn();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      // dispatch(actionClearCall(true));
    };
  }, []);

  useEffect(() => {
    if (!connection && !initiating && AppNavigator.getTopScreen() === 'CallScreen') {
      AppNavigator.goBack();
    }
  }, [connection, initiating]);

  return (
    <AppContainer>
      <StatusBar hidden />
      {!connection && initiating && <StateView text={dictionary.sending_request} />}
      {connection && connection.isInitiator && connection.session.state === 'initiating' && <WaitingScreen />}
      {connection && !connection.isInitiator && connection.session.state === 'initiating' && <AnswerView />}
      {connection && connection.session.state === 'transmitting' && <TransmittingView />}
    </AppContainer>
  );
}

export default React.memo(CallScreen);
