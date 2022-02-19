import React, { Component, memo, useEffect, useState } from 'react';
import { Platform, StatusBar, Text, View } from 'react-native';
import AppView from '../../components/base/app-view/AppView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import { DictRecord } from '../../assets/strings/dictionary';

interface Props {
  text: string | DictRecord;
  BgColor: string;
  timer?: number;
  onEnd?: () => void;
}

function GlobalAlert(props: Props) {
  const { text, BgColor, timer, onEnd } = props;
  const [timePassed, setTimePassed] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setTimePassed(true);
      onEnd && onEnd();
    }, timer);
    return () => {
      clearTimeout(id);
    };
  }, [timePassed]);
  return (
    !timePassed && (
      <AppView
        style={{
          height: hp(3.8),
          width: wp(100),
          backgroundColor: BgColor,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 1000,
          top: Platform.OS === 'web' ? hp(0) : StatusBar.currentHeight,
        }}
      >
        <AppTextView textColor="#FFFFFF" text={text} fontSize={wp(3)} />
      </AppView>
    )
  );
}
GlobalAlert.defaultProps = {
  timer: 5000,
  BgColor: 'red',
  position: 'top',
};

export default memo(GlobalAlert);
