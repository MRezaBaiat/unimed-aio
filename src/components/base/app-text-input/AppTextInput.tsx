import React, { useEffect, useState } from 'react';
import R from '../../../assets/R';
import { StyleProp, TextInput, TextStyle, ViewStyle } from 'react-native';
import { HTMLTypes, ValidatorField } from 'api';
import AppView from '../app-view/AppView';
import { safeAssignStyles } from '../../../helpers';
import { DictRecord } from '../../../assets/strings/dictionary';
import useLang from '../../../hooks/useLang';

export interface Props {
  onChange?: (text: string) => void;
  multiline?: any;
  fontFamily?: string;
  placeHolder: string | DictRecord;
  value?: string;
  iconLeft?: any;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  maxLength?: number;
  type?: HTMLTypes;
  autoGrow?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  validatorField?: ValidatorField;
  helperText?: string;
  textColor?: string;
  placeholderTextColor?: string;
  textStyle?: StyleProp<TextStyle>;
  labelStyle?: ViewStyle;
  passiveChangeListener?: (text: string) => void;
  onFocus?: (focused: boolean) => void;
}
function AppTextInput(props: Props) {
  const lang = useLang();
  const [contentSize, setContentSize] = useState(0);
  const { style, disabled, iconLeft, keyboardType, maxLength, multiline, onChange, placeHolder, textColor, textStyle, labelStyle, fontFamily, placeholderTextColor, value, autoGrow, onFocus } = props;

  useEffect(() => {
    autoGrow && value === '' && setContentSize(undefined);
  }, [autoGrow, value]);
  console.log(style);
  console.log(safeAssignStyles({ justifyContent: 'center' }, style));
  return (
    <AppView style={safeAssignStyles({ justifyContent: 'center' }, style)}>
      <TextInput
        style={[
          { width: '100%', textAlign: style?.textAlign, color: textColor, fontFamily: fontFamily, paddingTop: 5, paddingBottom: 5, paddingHorizontal: 7 },
          textStyle,
          autoGrow &&
            Boolean(contentSize) && {
              height: contentSize,
            },
        ]}
        onBlur={() => {
          onFocus && onFocus(false);
          // onBlur();
        }}
        onFocus={() => {
          onFocus && onFocus(true);
          // onFocus();
        }}
        maxLength={maxLength}
        value={value}
        disabled={disabled}
        multiline={multiline}
        inlineLabel={true}
        placeholder={typeof placeHolder === 'object' ? placeHolder[lang] : placeHolder}
        onChangeText={onChange}
        onContentSizeChange={(e) => {
          autoGrow && setContentSize(e.nativeEvent.contentSize.height);
        }}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
      />
    </AppView>
  );
}
AppTextInput.defaultProps = {
  placeHolder: '',
  value: '',
  textColor: 'black',
  themeName: 'normal',
};
export default React.memo(AppTextInput);
