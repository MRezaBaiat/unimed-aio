import React from 'react';
import { ViewStyle } from 'react-native';
import AppView from '../app-view/AppView';
import { safeAssignStyles } from '../../../helpers';
import AppTouchable from '../app-touchable/AppTouchable';

interface Props {
  cardElevation?: number;
  cardMaxElevation?: number;
  cornerRadius?: number;
  style?: ViewStyle | ViewStyle[];
  children?: JSX.Element | JSX.Element[] | any;
  touchable?: boolean;
  onClick?: () => void;
}

function AppCardView(props: Props) {
  const { touchable, style, onClick } = props;
  return (
    <AppTouchable
      onClick={onClick}
      disabled={!touchable}
      {...props}
      style={safeAssignStyles(
        {
          elevation: 1,
          backgroundColor: '#fff',
        },
        style
      )}
    >
      {props.children}
    </AppTouchable>
  );
}
export default React.memo(AppCardView);
