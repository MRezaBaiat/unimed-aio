import React from 'react';
import { SendStatus } from 'api';
import R from '../../../assets/R';
import AppView from '../../base/app-view/AppView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppImageView from '../../base/app-image/app-imageview';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { smartDate } from 'javascript-dev-kit';

const types = ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'];

interface Props {
  sendStatus?: SendStatus;
  date: number;
  style?: StyleProp<ViewStyle>;
}
function SendStatusView(props: Props) {
  const { sendStatus, date, style } = props;
  const time = smartDate(date);
  return (
    <AppView style={style}>
      {sendStatus && (
        <AppView style={{ width: hp(2), height: hp(2) }}>
          {sendStatus === SendStatus.WAITING_FOR_QUEUE && renderSending()}
          {sendStatus === SendStatus.SENDING && renderSending()}
          {sendStatus === SendStatus.FAILED && renderFailed()}
          {sendStatus === SendStatus.SENT && renderSent()}
          {sendStatus === SendStatus.DELIVERED && renderSent()}
          {sendStatus === SendStatus.READEN && renderSent()}
        </AppView>
      )}
      <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3), marginHorizontal: hp(1) }} text={`${time.hour()} : ${time.minutes().toString().length === 1 ? '0' + time.minutes() : time.minutes()}`} textColor={'#9e9e9e'} />
    </AppView>
  );
}

const renderSending = () => {
  return null;
  /* return (
    <Spinner style={{ position: 'absolute' }} isVisible={true} size={50} type={types[1]} color={'#ffcb08'}/>
  ); */
};

const renderSent = () => {
  return <AppImageView src={R.images.icons.delivery_sent} style={{ width: '70%', height: '70%', marginTop: hp(0.7) }} />;
};

const renderFailed = () => {
  return <AppTextView text={'failed'} />;
};

export default React.memo(SendStatusView);
