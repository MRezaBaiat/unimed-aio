/* eslint-disable multiline-ternary */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chat, User, ChatType } from 'api';

import R from '../../assets/R';
import { ActivityIndicator, BackHandler } from 'react-native';
import VisitApi from '../../network/VisitApi';
import AudioPlayingService from '../../services/audio-player/AudioPlayingService';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppView from '../../components/base/app-view/AppView';
import AppImageView from '../../components/base/app-image/app-imageview';
import { hp } from '../../helpers/responsive-screen';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppHeader from '../../components/composite/header/AppHeader';
import AppListView from '../../components/base/app-list-view/AppListView';
import TextHolderView from '../../components/composite/chat/text_row/TextHolderView';
import FileHolderView from '../../components/composite/chat/file_row/FileHolderView';
import FileSystem from '../../cache/file-system/FileSystem';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';

interface Props {
  visitId: string;
  title: string;
  imageUrl: string;
  specialization: string;
  date: string;
}
function ChatHistoryDetails(props: Props) {
  const { visitId, title, imageUrl, specialization, date } = getScreenParam(props);
  const [data, setData] = useState<Chat[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    VisitApi.getConversationHistory(visitId)
      .then((res) => {
        setData(res.data.reverse());
        setLoaded(true);
      })
      .catch((err) => console.log(err));
    return () => {
      FileSystem.getFileSystem(true).purge();
      AudioPlayingService.release();
    };
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _goBack);
    return () => {
      FileSystem.getFileSystem(true).purge();
      BackHandler.removeEventListener('hardwareBackPress', _goBack);
    };
  }, []);

  const _goBack = (): boolean => {
    AppNavigator.goBack();
    return true;
  };
  return (
    <AppContainer>
      <AppView
        style={{
          width: '100%',
          height: hp(10),
          alignItems: 'center',
          flexDirection: 'row-reverse',
          backgroundColor: '#4E55A1',
        }}
      >
        <AppView style={{ flex: 3, flexDirection: 'row-reverse', alignItems: 'center' }}>
          <AppImageView
            defaultImage={R.images.user_empty_view}
            src={imageUrl}
            style={{
              height: hp(7.5),
              width: hp(7.5),
              borderRadius: 100,
              borderWidth: 1,
              borderColor: 'white',
              marginRight: 10,
            }}
          />
          <AppView
            style={{
              flexDirection: 'column',
              minHeight: '50%',
              alignContent: 'space-around',
              marginRight: hp(2),
            }}
          >
            <AppTextView text={title} textColor={'white'} />
            <AppTextView text={specialization} textColor={'white'} />
          </AppView>
        </AppView>
      </AppView>
      <AppHeader />
      {date && (
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_faNum,
            fontSize: R.fontsSize.xsmall,
            color: '#50BCBD',
            alignSelf: 'center',
            marginVertical: hp(2),
          }}
          text={date}
        />
      )}
      {loaded ? (
        <AppView style={{ width: '100%', flex: 1, paddingBottom: hp(2) }}>
          <AppListView data={data} inverted keyExtractor={(chat: Chat) => chat.id} renderItem={render} />
        </AppView>
      ) : (
        <AppActivityIndicator size="large" color="#4E55A1" style={R.styles.spinner} />
      )}
    </AppContainer>
  );
}

const render = (item) => {
  const chat = item.item;
  switch (chat.type) {
    case ChatType.TEXT:
      return <TextHolderView chat={chat} key={chat.id} />;
    default:
      return <FileHolderView chat={chat} key={chat.id} temporary={true} />;
  }
};

export default React.memo(ChatHistoryDetails);
