import React, { useState } from 'react';
import { TextProps, TextStyle, Text } from 'react-native';
import R from '../../../assets/R';
import { safeAssignStyles } from '../../../helpers';
import { useFonts } from 'expo-font';
import Kit from 'javascript-dev-kit';
import { DictRecord } from '../../../assets/strings/dictionary';

export interface Props extends TextProps {
  text: string | DictRecord;
  textColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  style?: TextStyle;
  textAlign?: TextStyle['textAlign'];
}
function AppTextView(props: Props) {
  const { text, textColor, backgroundColor, fontSize, style, textAlign } = props;

  /* const [loaded] = useFonts(Kit.toObject(Object.values(R.fonts), (value, createdObject) => {
    return {
      key: value,
      value: require(`../../../assets/fonts/${value}.ttf`)
    };
  })); */

  return (
    <Text
      {...props}
      style={safeAssignStyles(
        {
          fontFamily: R.fonts.fontFamily,
          fontSize: fontSize,
          color: textColor,
          backgroundColor: backgroundColor,
          textAlign: textAlign,
        },
        style
      )}
    >
      {text ? text + ' ' : ''}
    </Text>
  );
}
AppTextView.defaultProps = {
  textColor: 'black',
  textAlign: 'right',
};

export default React.memo(AppTextView);
