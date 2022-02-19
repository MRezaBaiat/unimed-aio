import AppImageView from '../../base/app-image/app-imageview';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppCardView from '../../base/app-card-view/AppCardView';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { safeAssignStyles } from '../../../helpers';
import R from '../../../assets/R';

interface Props {
  url: string;
  style?: StyleProp<ViewStyle>;
  resizeMode: string;
}
function AppAvatar(props: Props) {
  const { style, url, resizeMode } = props;
  return (
    <AppCardView style={safeAssignStyles({ borderRadius: 100, borderWidth: 2, borderColor: 'white', marginRight: wp(3) }, style)}>
      <AppImageView src={url} resizeMode={resizeMode} style={safeAssignStyles({ width: hp(8), height: hp(8), borderRadius: 100 }, style)} hasDefaultImage={true} defaultImage={R.images.user_empty_view} />
    </AppCardView>
  );
}
AppAvatar.defaultProps = {
  resizeMode: 'cover',
};
export default React.memo(AppAvatar);
