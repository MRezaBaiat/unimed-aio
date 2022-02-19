import { View, Text } from 'react-native';
import R from '../../../assets/R';
import AppView from '../../base/app-view/AppView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppTouchable from '../../base/app-touchable/AppTouchable';
import AppImageView from '../../base/app-image/app-imageview';
import React from 'react';
import { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  text: string | DictRecord;
  onClosePress?: () => void;
  color?: string;
  closeBtn: boolean;
}
function ModalHeader(props: Props) {
  const { text, onClosePress, color, closeBtn } = props;
  return (
    <AppView
      style={{
        flexDirection: 'row-reverse',
        width: wp(76),
        height: hp(5),
        justifyContent: 'space-between',
        marginTop: hp(5),
        alignItems: 'center',
        alignSelf: 'center',
      }}
    >
      <AppTextView
        style={{
          fontFamily: R.fonts.fontFamily_Bold,
          alignSelf: 'flex-end',
        }}
        textColor={color}
        fontSize={wp(4.6)}
        text={text}
      />
      {!closeBtn && (
        <AppTouchable
          onClick={onClosePress}
          style={{
            width: '9%',
          }}
        >
          <AppImageView resizeMode="contain" style={{ width: '75%', height: 200, alignSelf: 'flex-start' }} src={color === '#38488A' ? R.images.icons.closeblue : color === '#50BCBD' ? R.images.icons.close : ''} />
        </AppTouchable>
      )}
    </AppView>
  );
}
ModalHeader.defaultProps = {
  color: '#38488A',
  closeBtn: false,
};

export default React.memo(ModalHeader);
