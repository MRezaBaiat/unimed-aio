import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Visit, ChatType, TypingStatus, Chat } from 'api';
import { useIsFocused } from '@react-navigation/native';
import store, { StoreType } from '../../redux/Store';
import { actionSendFile, actionSendText } from '../../redux/actions/chat_actions';
import R from '../../assets/R';
import { BackHandler, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import ChatService from '../../services/ChatService';
import ChatHeaderScreen from './ChatHeaderScreen';
import ChatPermissions from './permissions/ChatPermissions';
import AudioPlayingService from '../../services/audio-player/AudioPlayingService';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppView from '../../components/base/app-view/AppView';
import AppImageButton from '../../components/base/app-image-button/AppImageButton';
import { hp, screenHeight, wp } from '../../helpers/responsive-screen';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import ChatFilePickerModal from '../../modals/ChatFilePickerModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import VisitsHistoryModal from '../../modals/VisitsHistoryModal';
import TextHolderView from '../../components/composite/chat/text_row/TextHolderView';
import FileHolderView from '../../components/composite/chat/file_row/FileHolderView';
import MicView2 from '../../components/composite/mic_view/MicView2';
import RemoteView from '../video_call/remote-view/RemoteView';
import FileAsset from '../../helpers/file-manager/FileAsset';
import AppNavigator from '../../navigation/AppNavigator';
import P2PRoom from '../video_call/v3/P2PRoom';
import AppListView from '../../components/base/app-list-view/AppListView';
import useStatus from '../../hooks/useStatus';
import useUser from '../../hooks/useUser';
import useActiveCall from '../../hooks/useActiveCall';
import useActiveVisit from '../../hooks/useActiveVisit';
import dictionary from '../../assets/strings/dictionary';

function ChatScreen(props) {
  const chats = useSelector<StoreType, Chat[]>((state) => state.chatsReducer.chats);
  const data = chats.slice().reverse();
  const status = useStatus();
  const videoCallAllowed = Boolean(status.visit && status.visit.doctor.details.videoCallAllowed);
  const user = useUser();
  const connection = useActiveCall();
  const typingStatus = useSelector<StoreType, TypingStatus>((state) => state.chatsReducer.typingStatus as TypingStatus);
  const visit = useActiveVisit() as Visit;
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [isPatient, setIsPatient] = useState(user.type === 'PATIENT');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const focused = useIsFocused();
  // const focused = useIsFocused();

  const _exitChat = () => {
    ChatService.endVisitRequest(visit._id);
  };

  useEffect(() => {
    // StatusBar.setHidden(false, 'none');
  }, []);

  useEffect(() => {
    ChatPermissions.initialize();
    return () => {
      // StatusBar.setHidden(true);
      AudioPlayingService.release();
    };
  }, []);

  useEffect(() => {
    if (visit.doctor._id === user._id) {
      // setTitle(visit.patient.mobile);
      setIsPatient(false);
      setImageUrl(visit.patient.imageUrl);
    } else {
      // setTitle(visit.doctor.name);
      setIsPatient(true);
      setImageUrl(visit.doctor.imageUrl);
    }
    BackHandler.addEventListener('hardwareBackPress', _confirmationModalVisible);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _confirmationModalVisible);
    };
  }, [confirmModalVisible]);

  if (!status || !visit) {
    return null;
  }

  const getTypingStatusText = (): string => {
    switch (typingStatus) {
      case TypingStatus.SENDING_MEDIA:
        return 'در حال ارسال رسانه...';
      case TypingStatus.TYPING:
        return 'در حال تایپ...';
      case TypingStatus.RECORDING_VOICE:
        return 'در حال ضبط صدا...';
      default:
        return '';
    }
  };
  const closeModal = () => {
    setModalVisible(false);
    setHistoryModalVisible(false);
  };
  const _confirmationModalVisible = (): boolean => {
    setConfirmModalVisible(true);
    return true;
  };
  const _confirmationModalClose = () => {
    setConfirmModalVisible(false);
  };
  return (
    <AppContainer enabled={false} style={{ justifyContent: 'flex-end' }}>
      {connection && focused && (
        <RemoteView
          pip={true}
          style={{
            zIndex: Number.MAX_SAFE_INTEGER,
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
      {(confirmModalVisible || modalVisible || historyModalVisible) && <AppView style={styles.opacityLayer} />}

      <ChatHeaderScreen setHistoryModalVisible={setHistoryModalVisible} _confirmationModalVisible={_confirmationModalVisible} hp={hp} wp={wp} imageUrl={imageUrl} isPatient={isPatient} videoCallAllowed={videoCallAllowed} visit={visit} getTypingStatusText={getTypingStatusText} user={user} callStream={connection} />

      <KeyboardAvoidingView
        enabled={true}
        behavior={'padding'}
        style={{
          flex: 1,
        }}
      >
        <AppView
          style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
          }}
        >
          <AppListView data={data} inverted keyExtractor={(chat: Chat) => chat.id} renderItem={render} />
        </AppView>
        <AppView
          style={{
            width: wp(100),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f2f2f2',
          }}
        >
          <AppImageButton
            src={R.images.icons.attachment}
            onClick={() => {
              setModalVisible(true);
            }}
            imageStyle={{ width: Math.max(wp(4), 25), height: Math.max(wp(4), 25) }}
            style={{ width: wp(12), height: wp(12) }}
          />
          <AppTextInput
            value={text}
            multiline={true}
            autoGrow={true}
            placeHolder="پیام خود را بنویسید"
            placeholderTextColor="#BDBDBD"
            onChange={(t) => {
              ChatService.sendTypingStatus(TypingStatus.TYPING);
              setText(t);
            }}
            textStyle={{
              fontSize: wp(3.3),
              textAlign: 'right',
              color: '#38488A',
              fontFamily: R.fonts.fontFamily_faNum,
              paddingVertical: hp(1.5),
            }}
            style={{
              flex: 1,
              minHeight: hp(6),
              marginTop: 5,
              marginBottom: 5,
              backgroundColor: '#FFFFFF',
              borderRadius: hp(5),
              justifyContent: 'center',
              paddingHorizontal: hp(2),
            }}
          />
          {/* <ReactMic
           record={recording}
           className="sound-wave"
           onStop={(blob) => {
             console.log('created', blob);
             FileAsset.create(blob.blob, { type: ChatType.MUSIC, mediaInfo: { duration: (blob.stopTime - blob.startTime) / 1000 } }).then((file) => {
               // @ts-ignore
               sendVoice(file, visit._id);
             });
           }}
           strokeColor="#000000"
           backgroundColor="#FF4081" /> */}
          {text === '' && (
            <MicView2
              style={{
                minWidth: wp(12),
                minHeight: wp(12),
              }}
              size={Math.max(wp(4), 25)}
              onRecordComplete={(file) => {
                file && sendVoice(file, visit._id);
              }}
              targetId={visit._id}
            />
          )}
          {text !== '' && (
            <AppImageButton
              src={R.images.icons.send}
              imageStyle={{ width: Math.max(wp(4), 25), height: Math.max(wp(4), 25) }}
              style={{
                minWidth: wp(12),
                minHeight: wp(12),
              }}
              onClick={() => {
                sendChat(text, visit._id);
                setText('');
              }}
            />
          )}
        </AppView>
      </KeyboardAvoidingView>

      {modalVisible && (
        <ChatFilePickerModal
          targetId={visit._id}
          modalVisible={modalVisible}
          onImagePicked={(file: FileAsset) => {
            sendImage(file, visit._id);
          }}
          onRequestClose={() => {}}
          closeModal={closeModal}
          onFilePicked={(file: FileAsset) => {
            sendFile(file, visit._id);
          }}
        />
      )}
      {confirmModalVisible && (
        <ConfirmationModal
          modalVisible={confirmModalVisible}
          onConfirmClick={() => {
            _exitChat();
            _confirmationModalClose();
          }}
          closeModal={() => {
            _confirmationModalClose();
          }}
          text={dictionary['آیا برای پایان مکالمه و خروج از صفحه‌ی مشاوره اطمینان دارید؟']}
          title={dictionary['پایان مشاوره']}
        />
      )}
      {historyModalVisible && <VisitsHistoryModal modalVisible={historyModalVisible} closeModal={closeModal} targetId={isPatient ? visit.doctor._id : visit.patient._id} type={isPatient ? 'patient' : 'doctor'} onRequestClose={() => {}} />}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  opacityLayer: {
    height: hp(100),
    width: wp(100),
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    position: 'absolute',
  },
});

const sendFile = (file: FileAsset, visitId: string) => {
  store.dispatch(actionSendFile(file, visitId));
};

const sendImage = (file: FileAsset, visitId: string) => {
  store.dispatch(actionSendFile(file, visitId));
};

const sendVoice = (file: FileAsset, visitId: string) => {
  store.dispatch(actionSendFile(file, visitId));
};

const sendChat = (text: string, visitId: string) => {
  store.dispatch(actionSendText(text, visitId));
};

const render = (item) => {
  const chat = item.item;
  switch (chat.type) {
    case ChatType.TEXT:
      return <TextHolderView chat={chat} key={chat.id} />;
    default:
      return <FileHolderView chat={chat} key={chat.id} temporary={false} />;
  }
};

export default React.memo(ChatScreen);
