import React, { useEffect, useRef, useState } from 'react';
import { Chat, IOStatus } from 'api';
import R from '../../../../assets/R';
import SendStatusView from '../../send_status_view/SendStatusView';
import { getMyUserId } from '../../../../helpers';
import DownloadUploadStatusView from '../../download_upload_status_view/DownloadUploadStatusView';
import AudioPlayingService from '../../../../services/audio-player/AudioPlayingService';
import AppView from '../../../base/app-view/AppView';
import AppImageButton from '../../../base/app-image-button/AppImageButton';
import { hp, wp } from '../../../../helpers/responsive-screen';
import AppTextView from '../../../base/app-text-view/AppTextView';
import Slider from '@react-native-community/slider';
import { FileAssetState } from '../../../../helpers/file-manager/FileAsset';
import useAudioPlayer from '../../../../services/audio-player';

interface Props {
  chat: Chat;
  fileState: FileAssetState;
}
function VoiceHolderView(props: Props) {
  const { chat, fileState } = props;

  const isSentByUser = chat.sender === getMyUserId();

  return (
    <AppView style={{ alignItems: isSentByUser ? 'flex-end' : 'flex-start' }}>
      <AppView style={{ flexDirection: 'column' }}>
        {fileState.state === IOStatus.READY && fileState.exists && <PlayButton duration={chat.mediaInfo.duration} file={fileState.path} isSentByUser={isSentByUser} chat={chat} />}
        {fileState.state !== IOStatus.READY && <DownloadUploadStatusView chat={chat} fileState={fileState} />}
      </AppView>
    </AppView>
  );
}

const PlayButton = ({ file, duration, isSentByUser, chat }) => {
  const playerState = useAudioPlayer(file);

  const onValueChange = (value: number) => {
    AudioPlayingService.seek(file, value);
  };

  const _voiceTimeFormatter = (initsecond) => {
    const minutes = initsecond >= 60 ? Math.round(initsecond / 60) : 0;
    const seconds = initsecond % 60;
    return ` ${minutes.toString().length === 1 ? '0' + minutes.toString() : minutes.toString()}:${seconds.toString().length === 1 ? '0' + seconds.toString() : seconds.toString()}`;
  };

  const isPlaying = playerState.currentPath === file && playerState.state === 'playing';

  console.log(playerState?.progress.current + ' , ' + (playerState?.progress.total || duration || 100));
  return (
    <AppView style={[{ marginVertical: hp(0.5), padding: hp(1.5), marginHorizontal: hp(1.5) }, isSentByUser ? styles.sender : styles.receiver]}>
      <AppImageButton
        src={isPlaying ? (isSentByUser ? R.images.icons.pauseblue : R.images.icons.pausecyan) : !isSentByUser ? R.images.icons.playcyan : R.images.icons.playblue}
        onClick={() => {
          AudioPlayingService.playOrPause(file);
        }}
        style={{ width: 40, height: 40 }}
      />
      {playerState.currentPath === file && playerState.state === 'playing' ? <AppTextView style={{ fontSize: R.fontsSize.small, fontFamily: R.fonts.fontFamily_faNum, color: isSentByUser ? '#38488A' : '#9E9E9E' }} text={_voiceTimeFormatter(Math.round(playerState.progress.current))} /> : <AppTextView style={{ fontSize: R.fontsSize.small, fontFamily: R.fonts.fontFamily_faNum, color: isSentByUser ? '#38488A' : '#9E9E9E' }} text={_voiceTimeFormatter(Math.round(duration))} />}
      <AppView style={{ position: 'relative', width: '70%', flexDirection: 'row', alignItems: 'center' }}>
        <Slider onSlidingComplete={onValueChange} value={playerState.progress.current || 0} minimumValue={0} maximumValue={playerState.progress.total || duration || 100} minimumTrackTintColor={isSentByUser ? '#38488A' : '#50BCBD'} thumbTintColor={isSentByUser ? '#38488A' : '#50BCBD'} style={{ zIndex: 5, width: '100%', paddingTop: 10, paddingBottom: 10 }} />
      </AppView>
      <SendStatusView sendStatus={chat.sender === getMyUserId() && chat.sendStatus} date={chat.date} style={{ flexDirection: 'row-reverse', width: '100%', alignItems: 'center', paddingHorizontal: wp(1), position: 'absolute', bottom: '1%' }} />
    </AppView>
  );
};

const styles = {
  sender: {
    borderTopLeftRadius: hp(1.2),
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: 0,
    backgroundColor: '#C6E4FF',
    color: '#38488A',
    width: wp(75),
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
  receiver: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: hp(1.2),
    backgroundColor: '#F2F2F2',
    color: '#4F4F4F',
    height: hp(10),
    width: wp(75),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2),
  },
};

export default React.memo(VoiceHolderView);
