import React from 'react';
import { ViewStyle, Button, StyleProp, TextStyle } from 'react-native';
import R from '../../../assets/R';
import AppTouchable from '../app-touchable/AppTouchable';
import AppTextView from '../app-text-view/AppTextView';
import { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  text: string | DictRecord;
  textColor?: string;
  backgroundColor?: string;
  onClick: () => void;
  style?: StyleProp<TextStyle>;
  textSize?: number;
  transparent?: boolean;
  rounded?: boolean;
  disabled?: boolean;
}
function AppButton(props: Props) {
  const { text, textColor, style, backgroundColor, textSize, transparent, rounded, disabled, onClick } = props;
  return (
    <AppTouchable onClick={onClick} disabled={disabled} style={[{ backgroundColor, alignItems: 'center', justifyContent: 'center' }, style]}>
      <AppTextView style={{ fontSize: textSize, color: textColor, fontFamily: R.fonts.fontFamily }} text={text} />
    </AppTouchable>
  );
}
AppButton.defaultProps = {
  textColor: 'black',
  text: '',
  backgroundColor: 'white',
  textSize: 15,
};

export default React.memo(AppButton);
