import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import R from '../../../../assets/R';
import { Chat } from 'api';
import { getMyUserId } from '../../../../helpers';
import AppImageView from '../../../base/app-image/app-imageview';
import AppTextView from '../../../base/app-text-view/AppTextView';

const sideMargin = 10;

const ivsize = 55;
const greenColor = '#65d315';
const maxMediaWidth = (Dimensions.get('window').width * 67) / 100;

export interface Props {
  chat: Chat;
  children: any;
}
function ChatHolderView(props: Props) {
  const { chat, children } = props;
  const isSentByUser = chat.sender === getMyUserId();
  return (
    <View style={{ width: '100%', flexDirection: 'column', minHeight: ivsize + 10, paddingRight: 3, paddingLeft: 3, marginTop: 5, alignItems: isSentByUser ? 'flex-end' : 'flex-start' }}>
      <View style={isSentByUser ? rightStyles.containerStyle : leftStyles.containerStyle}>
        <AppImageView src={R.images.icons.mic} oval={true} shadowSize={1} style={isSentByUser ? rightStyles.ivstyle : leftStyles} />
        <NameHolder userid={chat.sender} sentByUser={isSentByUser} />
      </View>
      <View style={{ width: 100, height: 100, alignItems: isSentByUser ? 'flex-end' : 'flex-start', marginTop: 22, marginRight: ivsize / 2 }}>{children}</View>
      <Image style={{ width: 40, height: 20, position: 'absolute', right: ivsize - 16, top: 23 }} source={R.images.circle_quarter_right} />
    </View>
  );
}

export default React.memo(ChatHolderView);

const rightStyles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
  },
  ivstyle: {
    width: ivsize,
    height: ivsize,
  },
});

// @ts-ignore
const leftStyles = StyleSheet.create({
  containerStyle: {},
  ivstyle: {},
});

interface NameHolderProps {
  userid: string;
  sentByUser: boolean;
}
const NameHolder = (props: NameHolderProps) => {
  return (
    <View
      style={{
        backgroundColor: greenColor,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'absolute',
        top: 0,
        right: 2,
        paddingLeft: 13,
        paddingRight: 45,
        marginRight: 20,
        height: 50,
      }}
    >
      <AppTextView text={props.userid} textColor={'white'} fontSize={13} />
    </View>
  );
};
