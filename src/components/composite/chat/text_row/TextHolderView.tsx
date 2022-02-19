import { Chat } from 'api';

import React, { useState } from 'react';
import { getMyUserId } from '../../../../helpers';
import R from '../../../../assets/R';
import SendStatusView from '../../send_status_view/SendStatusView';
import { Dimensions } from 'react-native';
import AppView from '../../../base/app-view/AppView';
import AppTextView from '../../../base/app-text-view/AppTextView';
import { hp, wp } from '../../../../helpers/responsive-screen';

export const maxMediaWidth = (Dimensions.get('window').width * 60) / 100;

interface Props {
  chat: Chat;
}
function TextHolderView(props: Props) {
  const { chat } = props;
  const [lastSender, setLastSender] = useState(chat.sender);
  const isSentByUser = chat.sender === getMyUserId();
  return (
    <AppView style={{ alignItems: isSentByUser ? 'flex-end' : 'flex-start', paddingBottom: 7 }}>
      <AppView style={{ marginTop: hp(0.5), paddingTop: hp(1), paddingBottom: hp(0.5), marginHorizontal: hp(1.5), ...(isSentByUser ? styles.sender : styles.receiver) }}>
        <AppTextView style={{ color: isSentByUser ? styles.sender.color : styles.receiver.color, fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3), textAlign: 'right', lineHeight: hp(3.5) }} text={chat.text} key={chat.id} />
        <SendStatusView sendStatus={chat.sender === getMyUserId() && chat.sendStatus} date={chat.date} style={{ flexDirection: 'row-reverse', height: hp(3), alignItems: 'flex-start', marginTop: hp(0.2) }} />
      </AppView>
    </AppView>
  );
}

const styles = {
  sender: {
    borderTopLeftRadius: hp(1.2),
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: 0,
    backgroundColor: '#C6E4FF',
    color: '#38488A',
    paddingHorizontal: hp(2),
    minWidth: wp(30),
    maxWidth: wp(70),
  },
  receiver: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: hp(1.2),
    backgroundColor: '#F2F2F2',
    color: '#4F4F4F',
    paddingHorizontal: hp(2),
    minWidth: wp(30),
    maxWidth: wp(70),
  },
};

export default React.memo(TextHolderView);
