import React from 'react';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppView from '../../base/app-view/AppView';
import AppAvatar from '../app_avatar/AppAvatar';
import AppTextView from '../../base/app-text-view/AppTextView';
import R from '../../../assets/R';
import AppImageView from '../../base/app-image/app-imageview';
import AppCardView from '../../base/app-card-view/AppCardView';
import { StyleProp, ViewStyle } from 'react-native';
import { formatDateShamsi, safeAssignStyles } from '../../../helpers';
import dictionary, { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
  imageSrc: string;
  title: string | DictRecord;
  subTitle?: string | DictRecord;
  date?: string;
  dateExtra?: string | DictRecord;
  dateExtraStyle?: any;
  online?: boolean;
  titleFontSize?: number;
  subtitleFontSize?: number;
  avatarStyle?: any;
  resizeMode?: string;
}
function AppCardRow(props: Props) {
  const { style, onClick, title, date, imageSrc, subTitle, online, titleFontSize, subtitleFontSize, dateExtra, dateExtraStyle, avatarStyle, resizeMode } = props;
  return (
    <AppCardView touchable onClick={onClick} style={safeAssignStyles({ width: wp(92), borderRadius: hp(1.2), marginTop: hp(1.2), alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }, style)}>
      <AppView style={{ width: '100%', height: hp(15.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <AppView style={{ height: '60%', width: '55%', marginRight: '4%', justifyContent: 'space-between' }}>
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: titleFontSize, color: '#38488a' }} text={title} />
          <AppTextView textColor="#50BCBD" fontSize={subtitleFontSize} text={subTitle || ''} />
        </AppView>
        <AppView>
          {online && <AppView style={{ height: hp(1.8), width: hp(1.8), backgroundColor: '#3AED2A', zIndex: 4, elevation: 1, borderRadius: 100, position: 'absolute', right: '28%', bottom: '3%', borderWidth: 1, borderColor: 'white' }} />}
          <AppAvatar resizeMode={resizeMode} url={imageSrc} style={avatarStyle} />
        </AppView>
        {onClick && <AppImageView style={{ height: hp(2), width: hp(1.5), position: 'absolute', left: wp(4) }} src={R.images.icons.arrow_left} />}
      </AppView>
      {date && (
        <AppView
          style={{
            width: '100%',
            height: hp(4.3),
            backgroundColor: '#F2F2F2',
            borderBottomRightRadius: hp(1.2),
            borderBottomLeftRadius: hp(1.2),
            paddingHorizontal: '4%',
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          {dateExtra && <AppTextView style={safeAssignStyles({ fontFamily: R.fonts.fontFamily_faNum }, dateExtraStyle)} text={dateExtra} fontSize={R.fontsSize.small} textColor={'#4F4F4F'} />}
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={`${dictionary.date}: ${formatDateShamsi(date).split('-')[1]}`} fontSize={R.fontsSize.small} textColor={'#4F4F4F'} />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} text={`${dictionary.hour}: ${formatDateShamsi(date).split('-')[0]}`} fontSize={R.fontsSize.small} textColor={'#4F4F4F'} />
        </AppView>
      )}
    </AppCardView>
  );
}

AppCardRow.defaultProps = {
  titleFontSize: wp(3.8),
  subtitleFontSize: wp(3.3),
};

export default React.memo(AppCardRow);
