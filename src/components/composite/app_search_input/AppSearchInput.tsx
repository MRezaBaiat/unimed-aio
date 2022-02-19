import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleProp, TextInputState, TextStyle, ViewStyle } from 'react-native';
import AppTextInput from '../../base/app-text-input/AppTextInput';
import AppView from '../../base/app-view/AppView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppImageView from '../../base/app-image/app-imageview';
import R from '../../../assets/R';
import { safeAssignStyles } from '../../../helpers';
import { useIsFocused } from '@react-navigation/native';
import AppActivityIndicator from '../../base/app-activity-indicator/AppActivityIndicator';

interface Props {
  value: string;
  placeHolder: string;
  placeholderTextColor?: string;
  onChange: (text: string) => void;
  getResults: (text: string) => Promise<any>;
  onResults?: (results: any) => void;
  onEmpty?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onFocus?: (focused: boolean) => void;
}
function AppSearchInput(props: Props) {
  const { placeHolder, style, getResults, onResults, textStyle, onEmpty, onFocus, placeholderTextColor, value, onChange } = props;
  const [state, setState] = useState({ tid: undefined as any, text: '' });

  useEffect(() => {
    if (state.text !== value) {
      value === '' && onEmpty && onEmpty();
      state.tid && clearTimeout(state.tid);
      setState({
        text: value,
        tid:
          value !== '' &&
          setTimeout(() => {
            getResults(value).then((res) => {
              setState({
                text: value,
                tid: undefined,
              });
              onResults && onResults(res);
            });
          }, 500),
      });
    }
  }, [value, state]);

  return (
    <AppView style={safeAssignStyles({ width: '100%', height: hp(7), backgroundColor: '#F2F2F2', borderRadius: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center' }, style)}>
      <AppTextInput style={{ width: '100%', height: '100%', flex: 1 }} placeHolder={placeHolder} textStyle={textStyle} value={value} multiline={false} placeholderTextColor={placeholderTextColor} onFocus={onFocus} onChange={onChange} />
      <AppView
        style={{
          height: hp(5),
          width: 1,
          backgroundColor: '#C4C4C4',
        }}
      />
      {state.tid && <AppActivityIndicator style={{ width: wp(5), height: wp(5), marginLeft: 10, marginRight: 10 }} />}
      {!state.tid && <AppImageView resizeMode="contain" style={{ width: wp(5), height: wp(5), marginLeft: 10, marginRight: 10 }} src={R.images.icons.search} />}
    </AppView>
  );
}

export default React.memo(AppSearchInput);
